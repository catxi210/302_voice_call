'use client'
import { cn } from "@/lib/utils";
import { ReactNode, useEffect, useRef } from "react"

/**
 * 底部弹出的组件
 * dropup from bottom
 * @param props
 * @returns
 */
const DropupMenu = (props: {
  open: boolean,
  onClose: () => void,
  children: ReactNode,
  className?: string,
}) => {

  const { onClose, children, open, className: classNameFromParent = "" } = props;

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }
    if (open) {
      document.body.appendChild(modalRef.current)
    }
    return () => {
      try {
        if (modalRef.current && document.body.contains(modalRef.current)) {
          document.body.removeChild(modalRef.current)
        }
      } catch (e) { }
    }
  }, [open])
  return (
    <>
      <div className="hidden">
        {/* dom，插入到body下显示 */}
        {/* dom, append to body */}
        <div
          className={`${open ? 'fixed' : 'hidden'} flex flex-col z-10 top-0 bottom-0 left-0 right-0 justify-end`}
          ref={modalRef}
        >
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-slate-400 dark:bg-slate-400 opacity-55 box-content z-0" onClick={() => onClose()}></div>
          <div className={cn(
            `relative z-10 flex h-4/5 flex-col bg-card shadow p-2 rounded-tl-lg rounded-tr-lg border-t-2 border-r-2 border-l-2 border-purple-700 dark:border-slate-50 mx-auto`,
            classNameFromParent
          )}>
            <div className="flex flex-1 flex-col overflow-auto">
              {children}
              <div className="w-full min-h-20 md:min-h-0"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DropupMenu;
