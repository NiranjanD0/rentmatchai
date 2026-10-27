"use client"

import React, { useCallback, useRef, useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

export interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = mounted ? (theme === "system" ? resolvedTheme : theme) : "light"

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return

    const isDark = (theme === "system" ? resolvedTheme : theme) === "dark"
    const newTheme = isDark ? "light" : "dark"

    // Check if View Transition API is supported
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [theme, resolvedTheme, setTheme, duration])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "theme-toggle-btn",
        className
      )}
      aria-label="Toggle dark mode"
      title={currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      {...props}
    >
      {currentTheme === "dark" ? (
        <Sun size={18} className="theme-icon sun" />
      ) : (
        <Moon size={18} className="theme-icon moon" />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}

export default AnimatedThemeToggler
