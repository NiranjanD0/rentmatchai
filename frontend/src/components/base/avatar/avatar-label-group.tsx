"use client";

import React from "react";
import { Avatar, type AvatarProps } from "./avatar";
import { cx } from "@/utils/cx";

export interface AvatarLabelGroupProps {
  size?: AvatarProps["size"];
  src?: string | null;
  alt?: string;
  initials?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: AvatarProps["status"];
  className?: string;
}

export function AvatarLabelGroup({
  size = "md",
  src,
  alt,
  initials,
  title,
  subtitle,
  status = "online",
  className,
}: AvatarLabelGroupProps) {
  return (
    <div className={cx("flex items-center gap-2.5 min-w-0 text-left", className)}>
      <Avatar
        size={size}
        src={src}
        alt={alt || (typeof title === "string" ? title : undefined)}
        initials={initials}
        status={status}
      />
      <div className="min-w-0 flex-1 leading-tight">
        <div className="truncate text-xs font-semibold text-zinc-100">{title}</div>
        {subtitle && (
          <div className="truncate text-[10px] text-zinc-400 mt-0.5">{subtitle}</div>
        )}
      </div>
    </div>
  );
}
