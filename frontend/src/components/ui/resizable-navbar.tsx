"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/src/lib/utils";
import { Menu as IconMenu2, X as IconX } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

export interface NavItemConfig {
  name: string;
  link: string;
  active?: boolean;
  badge?: number | string;
  icon?: React.ReactNode;
}

interface NavItemsProps {
  items: NavItemConfig[];
  className?: string;
  onItemClick?: (link: string) => void;
}

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 40) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <div
      className={cn(
        "sticky inset-x-0 top-0 z-50 w-full transition-all duration-300",
        visible ? "pt-2 pb-1" : "pt-0 pb-0",
        className
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible }
            )
          : child
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: "blur(16px)",
        boxShadow: visible
          ? "0 14px 34px -10px rgba(15, 34, 46, 0.12), 0 0 0 1px rgba(22, 50, 68, 0.08)"
          : "0 1px 0 rgba(0, 0, 0, 0.05)",
        width: visible ? "min(1180px, 94%)" : "100%",
        y: visible ? 4 : 0,
        borderRadius: visible ? "9999px" : "0px",
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between px-6 py-2.5 transition-colors lg:flex",
        visible
          ? "border border-line/90 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90"
          : "border-b border-line/60 bg-white/95 dark:border-slate-800/80 dark:bg-slate-950/95",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "relative flex flex-row items-center justify-center space-x-1 text-sm font-medium",
        className
      )}
    >
      {items.map((item, idx) => (
        <button
          key={`nav-item-${idx}`}
          type="button"
          onMouseEnter={() => setHovered(idx)}
          onClick={() => onItemClick?.(item.link)}
          className={cn(
            "relative inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-150 rounded-full",
            item.active
              ? "text-green-700 dark:text-emerald-400 font-bold"
              : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
          )}
        >
          {hovered === idx && (
            <motion.div
              layoutId="nav-hover-pill"
              className="absolute inset-0 h-full w-full rounded-full bg-slate-100 dark:bg-slate-800/80"
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
            />
          )}

          {item.active && hovered !== idx && (
            <div className="absolute inset-0 h-full w-full rounded-full bg-emerald-50/70 border border-emerald-200/60 dark:bg-emerald-950/40 dark:border-emerald-800/50" />
          )}

          <span className="relative z-10 flex items-center gap-1.5">
            {item.icon}
            {item.name}
            {item.badge !== undefined && (
              <span className="ml-0.5 rounded-full bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-200">
                {item.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      animate={{
        backdropFilter: "blur(16px)",
        boxShadow: visible
          ? "0 10px 30px -10px rgba(15, 34, 46, 0.12), 0 0 0 1px rgba(22, 50, 68, 0.08)"
          : "none",
        width: visible ? "94%" : "100%",
        y: visible ? 4 : 0,
        borderRadius: visible ? "18px" : "0px",
      }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-4 py-2.5 transition-colors lg:hidden",
        visible
          ? "border border-line/90 bg-white/95 dark:border-slate-800 dark:bg-slate-900/95"
          : "border-b border-line/60 bg-white/95 dark:border-slate-800/80 dark:bg-slate-950/95",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute inset-x-0 top-full mt-2 z-50 flex w-full flex-col items-stretch gap-3 rounded-2xl border border-line bg-white/98 p-5 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/98",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Toggle navigation menu"
      className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
    >
      {isOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
    </button>
  );
};

export const NavbarLogo = () => {
  return (
    <a
      href="/"
      className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-semibold text-slate-900 dark:text-white"
    >
      <span>rentmatch<span className="text-emerald-600">ai</span></span>
    </a>
  );
};

export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-3.5 py-1.5 rounded-full text-xs font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-150 inline-block text-center";

  const variantStyles = {
    primary:
      "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800",
    secondary: "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
    dark: "bg-slate-900 text-white shadow-sm hover:bg-slate-800",
    gradient:
      "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

