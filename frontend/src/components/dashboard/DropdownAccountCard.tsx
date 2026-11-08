'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronSelectorVertical,
  HelpCircle,
  LogOut01,
  Moon01,
  Settings01,
  User01,
} from '@untitledui/icons';
import { Button as AriaButton } from 'react-aria-components';

import { Dropdown } from '@/src/components/base/dropdown/dropdown';
import { cx } from '@/src/utils/cx';
import { AvatarLabelGroup } from '@/src/components/base/avatar/avatar-label-group';
import { usePageCurtains } from '@/src/components/ui/page-curtains';

export interface DropdownAccountCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'tenant' | 'landlord';
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onSignOut: () => void;
  onCloseMobileDrawer?: () => void;
}

export const DropdownAccountCardMD = ({
  name,
  email,
  avatarUrl,
  role,
  isDarkMode,
  onToggleDarkMode,
  onSignOut,
  onCloseMobileDrawer,
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

  const roleLabel = role === 'tenant' ? 'Tenant account' : 'Landlord account';

  return (
    <Dropdown.Root>
      <AriaButton
        className={({ isPressed, isFocusVisible }) =>
          cx(
            'relative w-full cursor-pointer rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/80 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/60 dark:border-zinc-800/70 p-2 text-left transition-colors outline-offset-2 outline-focus-ring',
            (isPressed || isFocusVisible) && 'outline-2'
          )
        }
      >
        <AvatarLabelGroup
          size="md"
          src={avatarUrl}
          initials={name ? name.split(' ').map((n) => n[0]).filter(Boolean).join('').slice(0, 2).toUpperCase() : 'U'}
          title={name}
          subtitle={role === 'tenant' ? 'Tenant' : 'Landlord'}
        />

        <div className="absolute top-2.5 right-2 flex size-7 items-center justify-center rounded-md pointer-events-none">
          <ChevronSelectorVertical className="size-4 shrink-0 stroke-[1.5px] text-zinc-400 dark:text-zinc-500" />
        </div>
      </AriaButton>

      <Dropdown.Popover
        placement="top start"
        offset={8}
        className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-xl shadow-lg p-1 text-zinc-800 dark:text-zinc-200 z-50 animate-in fade-in duration-150"
      >
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 px-3.5 py-3">
          <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{email}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-normal">
            <span className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            {roleLabel}
          </p>
        </div>

        <Dropdown.Menu className="py-1">
          <Dropdown.Item
            icon={User01}
            onAction={() => handleNavigate('/profile?tab=personal', 'Profile & Account')}
          >
            Profile & Account
          </Dropdown.Item>

          <Dropdown.Item
            icon={Settings01}
            onAction={() => handleNavigate('/profile?tab=preferences', 'Preferences')}
          >
            Preferences
          </Dropdown.Item>

          <Dropdown.Item
            icon={Moon01}
            onAction={onToggleDarkMode}
          >
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </Dropdown.Item>

          <Dropdown.Item
            icon={HelpCircle}
            onAction={() => handleNavigate('/docs', 'Documentation')}
          >
            Help & Documentation
          </Dropdown.Item>

          <Dropdown.Separator />

          <Dropdown.Item
            icon={LogOut01}
            destructive
            onAction={handleSignOut}
          >
            Sign out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};
