"use client"

import { type CSSProperties, type HTMLAttributes } from "react"
import {
  motion,
  type DOMMotionComponents,
  type MotionProps,
} from "motion/react"

import { cn } from "@/src/lib/utils"

const motionElements = {
  article: motion.article,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  h5: motion.h5,
  h6: motion.h6,
  li: motion.li,
  p: motion.p,
  section: motion.section,
  span: motion.span,
} as const

type MotionElementType = Extract<
  keyof DOMMotionComponents,
  keyof typeof motionElements
>

interface LineShadowTextProps
  extends Omit<HTMLAttributes<HTMLElement>, keyof MotionProps>, MotionProps {
  children: string
  shadowColor?: string
  as?: MotionElementType
}

export function LineShadowText({
  children,
  shadowColor = "black",
  className,
  as: Component = "span",
  ...props
}: LineShadowTextProps) {
  const MotionComponent = motionElements[Component]

  return (
    <MotionComponent
      style={{ "--shadow-color": shadowColor } as CSSProperties}
      className={cn(
        "relative z-0 inline-block line-shadow-text",
        className
      )}
      data-text={children}
      {...props}
    >
      {children}
    </MotionComponent>
  )
}
