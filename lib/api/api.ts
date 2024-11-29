'use client'
import { useUserStore } from '@/app/stores/use-user-store'
import { emitter } from '@/lib/mitt'
import ky from 'ky'
import { env } from 'next-runtime-env'
import { isEmpty } from 'radash'
import { langToCountry } from './lang-to-country'
import { getApiKey } from '../utils'

export type ErrorResponse = {
  error: {
    err_code: number
    [key: `message${string}`]: string
    type: string
  }
}

const apiKy = ky.create({
  prefixUrl: env('NEXT_PUBLIC_API_URL'),
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const apiKey = getApiKey()
        if (apiKey) {
          request.headers.set('Authorization', `Bearer ${apiKey}`)
        }
        const lang = useUserStore.getState().language
        if (lang) {
          request.headers.set('Lang', langToCountry(lang))
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (!response.ok) {
          const res = await response.json<ErrorResponse>()

          // Emit a toast error if there is an error code
          const uiLanguage = useUserStore.getState().language
          if (res.error && uiLanguage) {
            const countryCode =
              langToCountry(uiLanguage) === 'en'
                ? null
                : langToCountry(uiLanguage)

            const message =
              res.error[`message${countryCode ? `_${countryCode}` : ''}`]
            emitter.emit('ToastErrorNew', {
              code: res.error.err_code,
              message,
            })
          }
        }
      },
    ],
  },
})

const authKy = ky.create({
  prefixUrl: env('NEXT_PUBLIC_AUTH_API_URL'),
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        const lang = useUserStore.getState().language
        if (lang) {
          request.headers.set('Lang', langToCountry(lang))
        }
      },
    ],
  },
})

export { apiKy, authKy }
