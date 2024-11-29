'use client'
import { env } from 'next-runtime-env'
import { useUserStore } from '../stores/use-user-store'

export function useDomain() {
  const isChina = useUserStore((state) => state.region)

  const domain = (typeof isChina === "number" && isChina === 0)
    ? env('NEXT_PUBLIC_OFFICIAL_WEBSITE_URL_CHINA')
    : env('NEXT_PUBLIC_OFFICIAL_WEBSITE_URL_GLOBAL')
  return domain
}
