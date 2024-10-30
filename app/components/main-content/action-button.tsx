'use client'
import { cn } from "@/lib/utils";
import { ReactNode } from "react"

const ActionButton = (props: {
  children: ReactNode,
  onClick?: () => void,
  className: string,
  onMouseDown?: () => void,
  /**
   * 鼠标离开时同样会触发
   * triggered when mouse leave
   * @returns
   */
  onMouseUp?: () => void,
}) => {

  const {
    children: icon,
    className,
    onClick = () => { },
    onMouseDown = () => { },
    onMouseUp = () => { }
  } = props;

  return (
    <div
      className={cn(
        "flex select-none flex-col relative justify-center mx-auto my-auto shadow-md text-4xl rounded-full cursor-pointer bg-white dark:bg-gray-800",
        className
      )}
      style={{
        width: "148px",
        height: "148px"
      }}
      onClick={() => onClick()}
      onMouseDown={() => {
        onMouseDown();
      }}
      onMouseUp={() => {
        onMouseUp();
      }}
      onMouseLeave={() => onMouseUp()}
      onContextMenu={e => {
        e.preventDefault();
      }}
      onContextMenuCapture={e => e.preventDefault()}
      onTouchStart={() => onMouseDown()}
      onTouchEnd={() => onMouseUp()}
    >
      <div className="m-auto">
        {icon}
      </div>
    </div>
  )
}
export default ActionButton
