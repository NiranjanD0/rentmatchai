import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/src/lib/utils"

const rainbowButtonVariants = cva(
  cn(
    "relative cursor-pointer group transition-all animate-rainbow",
    "inline-flex items-center justify-center gap-2 shrink-0",
    "rounded-full outline-none focus-visible:ring-[3px] aria-invalid:border-destructive",
    "text-sm font-semibold whitespace-nowrap",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "border-0 [border:calc(0.125rem)_solid_transparent] bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box]",
          "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm",
          "bg-[linear-gradient(#121213,#121213),linear-gradient(#121213_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "dark:bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow",
          "before:bg-[linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "before:bg-[length:200%] before:[filter:blur(0.75rem)]"
        ),
        outline: cn(
          "border border-input border-b-transparent bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white",
          "bg-[length:200%] [background-clip:padding-box,border-box,border-box] [background-origin:border-box]",
          "bg-[linear-gradient(#ffffff,#ffffff),linear-gradient(#ffffff_50%,rgba(18,18,19,0.6)_80%,rgba(18,18,19,0)),linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "dark:bg-[linear-gradient(#0a0a0a,#0a0a0a),linear-gradient(#0a0a0a_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "before:absolute before:bottom-[-20%] before:left-1/2 before:z-0 before:h-1/5 before:w-3/5 before:-translate-x-1/2 before:animate-rainbow",
          "before:bg-[linear-gradient(90deg,var(--color-1,hsl(0_100%_63%)),var(--color-5,hsl(90_100%_63%)),var(--color-3,hsl(210_100%_63%)),var(--color-4,hsl(195_100%_63%)),var(--color-2,hsl(270_100%_63%)))]",
          "before:bg-[length:200%] before:[filter:blur(0.75rem)]"
        ),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface RainbowButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {asChild ? children : <span className="relative z-10 inline-flex items-center gap-2">{children}</span>}
      </Comp>
    )
  }
)

RainbowButton.displayName = "RainbowButton"

export { RainbowButton, rainbowButtonVariants, type RainbowButtonProps }
