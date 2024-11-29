'use client'
import mitt from 'mitt'

export type ToastInfo = {
  code: number
  message: string
}

type Events = {
  ToastError: number,
  ToastErrorNew: ToastInfo,
}
const emitter = mitt<Events>()

export { emitter }
