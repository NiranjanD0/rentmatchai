'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronSelectorVertical,
  LogOut01,
  User01,
} from '@untitledui/icons';
import { cx } from '@/src/utils/cx';
import { Avatar } from '@/src/components/base/avatar/avatar';
import { usePageCurtains } from '@/src/components/ui/page-curtains';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

export interface DropdownAccountCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'tenant' | 'landlord';
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onSignOut: () => void;
  onCloseMobileDrawer?: () => void;
  isExpanded?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const DropdownAccountCardMD = ({
  name,
  email,
  avatarUrl,
  role,
  onSignOut,
  onCloseMobileDrawer,
  isExpanded = true,
  onOpenChange,
}: DropdownAccountCardProps) => {
  const router = useRouter();
  const { navigateWithCurtains } = usePageCurtains();

  const handleNavigate = (path: string, label: string) => {
    onCloseMobileDrawer?.();
    navigateWithCurtains(path, label);
  };

  const handleSignOut = () => {
    onCloseMobileDrawer?.();
    onSignOut();
    router.replace('/login');
  };

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <div className="relative flex items-center h-10 w-full">
        {/* Floating/Prominent Profile Picture (perfectly aligned with sidebar icon axis) */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full shrink-0 flex items-center justify-center ring-2 ring-sidebar shadow-md bg-zinc-100 dark:bg-zinc-800 pointer-events-none">
          <Avatar
            size="md"
            src={avatarUrl}
            alt={name}
            initials={name ? name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() : 'U'}
          />
        </div>

        {/* The Card Box Trigger */}
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label={name}
              className={cx(
                'relative h-10 cursor-pointer rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/70 dark:border-zinc-800/80 transition-[width,background-color] duration-250 ease-out outline-none focus:outline-none focus-visible:outline-none ring-0 flex items-center overflow-hidden w-full',
                isExpanded ? 'pl-12 pr-2' : 'pl-0 pr-0 justify-center'
              )}
            />
          }
        >
          {/* Inner content that slides out from under PFP */}
          <div
            className={`overflow-hidden transition-all duration-200 flex-1 flex items-center justify-between min-w-0 ${
              isExpanded
                ? 'opacity-100 max-w-[150px]'
                : 'opacity-0 max-w-0 pointer-events-none'
            }`}
          >
            <div className="min-w-0 flex-1 leading-tight whitespace-nowrap text-left">
              <div className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">{name}</div>
              <div className="truncate text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                {role === 'tenant' ? 'Tenant' : 'Landlord'}
              </div>
            </div>

            <div className="shrink-0 size-4 flex items-center justify-center text-zinc-400 dark:text-zinc-500 ml-1">
              <ChevronSelectorVertical className="size-3.5 stroke-[2.25px]" />
            </div>
          </div>
        </DropdownMenuTrigger>
      </div>

      <DropdownMenuContent
        align="start"
        side={isExpanded ? 'top' : 'right'}
        sideOffset={isExpanded ? 8 : 12}
        className="w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1 text-zinc-800 dark:text-zinc-200 z-50"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-3.5 py-2.5">
            <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
              {name}
            </p>
            <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{email}</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {role} account
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => handleNavigate('/dashboard/profile?tab=personal', 'Profile & Account')}
          >
            <User01 className="size-4 text-zinc-500 dark:text-zinc-400" />
            <span>View Profile</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1 bg-zinc-100 dark:bg-zinc-800" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xl cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 dark:focus:bg-red-950/40"
            onClick={handleSignOut}
          >
            <LogOut01 className="size-4 text-red-500" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
