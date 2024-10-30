# 基础镜像
# Base image
FROM node:20.14-alpine AS base

# 仅在需要时安装依赖
# Install dependencies only when needed
FROM base AS deps
# 设置镜像源为USTC镜像
# Change the repository source to USTC mirror
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories
RUN apk update
# 安装兼容库
# Install compatibility libraries
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 复制依赖文件
# Copy dependency files
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./

# 根据包管理器安装依赖
# Install dependencies based on the package manager
RUN \
    if [ -f yarn.lock ]; then \
        corepack enable && \
        yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
        npm config set registry https://registry.npmmirror.com && \
        npm ci; \
    elif [ -f pnpm-lock.yaml ]; then \
        corepack enable pnpm && \
        pnpm config set registry https://registry.npmmirror.com && \
        pnpm i --frozen-lockfile; \
    else \
        echo "未找到lock文件。" && exit 1; \
    fi

# 仅在需要时重新构建源代码
# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# 复制依赖和源代码
# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 根据构建模式执行构建
# Execute build based on the build mode
RUN corepack enable pnpm && pnpm run build;


# 生产镜像，复制所有文件并运行 Next.js
# Production image, copy all files and run Next.js
FROM base AS runner
WORKDIR /app

# 创建非特权用户
# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制静态文件
# Copy static files
COPY --from=builder /app/public ./public

# 设置预渲染缓存的权限
# Set permissions for pre-rendered cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# 复制构建产物
# Copy build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 .env 文件
# Copy .env file
COPY --chown=nextjs:nodejs .env .env

# 创建持久化数据目录并设置权限
# Create a persistent data directory and set permissions
RUN mkdir -p /app/shared && chmod -R 777 /app/shared

# 切换到非特权用户
# Switch to the non-privileged user
USER nextjs

# 暴露端口
# Expose the port
EXPOSE 3000

# 设置环境变量
# Set environment variables
ENV PORT=3000

# 启动命令
# Startup command
CMD HOSTNAME="0.0.0.0" node server.js
