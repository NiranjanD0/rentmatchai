import React from "react"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import { cn } from "@/src/lib/utils"

export interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isInvalid?: boolean
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ children, className, isInvalid = false, disabled, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      animate={
        isInvalid
          ? {
              x: [-10, 10, -8, 8, -4, 4, 0],
              transition: { duration: 0.45, ease: "easeInOut" },
            }
          : { x: 0 }
      }
      className={cn(
        "group relative w-full cursor-pointer overflow-hidden rounded-2xl border p-2.5 px-6 text-center font-semibold text-xs sm:text-sm bg-white dark:bg-zinc-950 transition-colors shadow-xs",
        isInvalid
          ? "border-red-500 ring-2 ring-red-500/30 text-red-600 dark:text-red-400"
          : "border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:border-emerald-500/60",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled}
      {...(props as any)}
    >
      <div className="flex items-center justify-center gap-2 w-full">
        <div
          className={cn(
            "h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100.8]",
            isInvalid ? "bg-red-500" : "bg-emerald-600 dark:bg-emerald-500"
          )}
        />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="text-white absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-bold">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </motion.button>
  )
})

InteractiveHoverButton.displayName = "InteractiveHoverButton"
