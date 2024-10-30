
'use client'
import { cn } from "@/lib/utils"
import { Root as RootPrimitive, Thumb as ThumbPrimitive } from "@radix-ui/react-switch"
import { forwardRef, ElementRef, ComponentPropsWithoutRef } from "react"


const Root = forwardRef<
  ElementRef<typeof RootPrimitive>,
  ComponentPropsWithoutRef<typeof RootPrimitive>
>(({ className, ...props }, ref) => (
  <RootPrimitive
    ref={ref}
    className={cn(
      'data-[state=checked]:bg-purple-700 active:data-[state=checked]:bg-purple-600 w-11 rounded-full bg-gray-700 p-px shadow-inner shadow-black/50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 active:bg-gray-600',
      className
    )}
    {...props}
  >
  </RootPrimitive>
))
const Thumb = forwardRef<
  ElementRef<typeof ThumbPrimitive>,
  ComponentPropsWithoutRef<typeof ThumbPrimitive>
>(({ className, ...props }, ref) => (
  <ThumbPrimitive
    ref={ref}
    className={cn(
      'data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-white block h-6 w-6 rounded-full bg-gray-200 shadow-sm transition',
      className
    )}
    {...props}
  >
  </ThumbPrimitive>
))

Root.displayName = RootPrimitive.displayName
Thumb.displayName = ThumbPrimitive.displayName
export {
  Root,
  Thumb
}
