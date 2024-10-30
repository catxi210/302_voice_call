# 🎙️🤖 Welcome to 302.AI's AI Voice Call! 🚀✨

[中文](README_zh.md) | [English](README.md) | [日本語](README_ja.md)

The open-source version of [AI Voice Call](https://302.ai/tools/realtime/) from [302.AI](https://302.ai).

You can directly log in to 302.AI and use the online version with zero code and zero configuration. Alternatively, modify this project according to your needs, input your 302.AI API KEY, and deploy it yourself.

## ✨ 302.AI Introduction ✨

[302.AI](https://302.ai) is an on-demand AI application platform that solves the last-mile problem of putting AI into practice for users.

1. 🧠 It aggregates the latest and most comprehensive AI capabilities and brands, including but not limited to language models, image models, voice models, and video models.
2. 🚀 We develop real AI products, not just simple chatbots, through deep application development based on foundational models.
3. 💰 Zero monthly fees, with all functions paid on demand, fully open, achieving truly low thresholds and high ceilings.
4. 🛠 Powerful management backend for teams and small-to-medium enterprises, allowing one person to manage and multiple people to use.
5. 🔗 All AI capabilities provide API access, and all tools are open-source for customization (in progress).
6. 💡 Strong development team, launching 2-3 new applications weekly, with daily product updates. Developers interested in joining are also welcome to contact us.

## Project Features

1. 📱 Intercom and Phone Mode: Select according to needs.
2. ⏰ Custom Hang-up Time: Save resources.
3. 🎶 Voice Tone and Personality Commands: Support multiple voice tones, support custom personality commands, adapt to dialogue scenarios.
4. 🌓 Dark Mode: Support dark mode to protect your eyes.
5. 🌐 Internationalization: Support multiple languages, currently supporting Chinese, English, and Japanese.

Through AI Voice Call, anyone can have conversations with AI anytime, anywhere. 🎉🎙️ Let's explore the new world of AI-driven podcasts together! 🌟🚀

## Technology Stack

- Next.js 14
- Tailwind CSS
- Shadcn UI
- OpenAI Realtime

## Development & Deployment

1. Clone the project `git clone https://github.com/302ai/pub_realtime`
2. Install dependencies `pnpm install`
3. Configure the 302 API KEY with reference to .env.example
4. Run the project `pnpm dev`
5. Package and deploy `docker build -t realtime . && docker run -p 3000:3000 realtime`

## Interface Preview

### 1. Intercom

![1. Intercom](docs/one.png)
![1. Intercom - Dark](docs/one_dark.png)

### 2. Phone

![2. Phone](docs/two.png)
![2. Phone - Dark](docs/two_dark.png)
