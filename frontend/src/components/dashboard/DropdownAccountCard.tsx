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
import type { Selection } from 'react-aria-components';
import { Button as AriaButton, SubmenuTrigger } from 'react-aria-components';

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

  return (
    <Dropdown.Root>
      <AriaButton
        className={({ isPressed, isFocusVisible }) =>
          cx(
            'relative w-full cursor-pointer rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/70 dark:border-zinc-800/80 p-2 text-left transition-all outline-offset-2 outline-focus-ring',
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
          <ChevronSelectorVertical className="size-4 shrink-0 stroke-[2.25px] text-zinc-400 dark:text-zinc-500" />
        </div>
      </AriaButton>

      <Dropdown.Popover
        placement="top start"
        offset={8}
        className="w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-1 text-zinc-800 dark:text-zinc-200 z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 px-4 py-3">
          <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
            {name}
          </p>
          <p className="truncate text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{email}</p>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            {role} account
          </p>
        </div>

        <Dropdown.Menu className="py-1">
          <Dropdown.Item
            icon={User01}
            onAction={() => handleNavigate('/profile?tab=personal', 'Profile & Account')}
          >
            View Profile
          </Dropdown.Item>

          <Dropdown.Item
            icon={Settings01}
            onAction={() => handleNavigate('/profile?tab=security', 'Settings')}
          >
            Settings
          </Dropdown.Item>

          <Dropdown.Section
            selectionMode="single"
            selectedKeys={new Set(isDarkMode ? ['dark'] : [])}
            onSelectionChange={() => {
              onToggleDarkMode();
            }}
          >
            <Dropdown.Item
              id="dark"
              icon={Moon01}
              selectionIndicator="toggle"
            >
              Dark Mode
            </Dropdown.Item>
          </Dropdown.Section>

          <SubmenuTrigger>
            <Dropdown.Item icon={HelpCircle}>
              Support
            </Dropdown.Item>

            <Dropdown.Popover
              placement="right bottom"
              offset={4}
              className="w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl p-1 text-zinc-800 dark:text-zinc-200 z-50"
            >
              <Dropdown.Menu className="py-1">
                <Dropdown.Item
                  onAction={() => window.open('mailto:support@rentmatch.ai', '_blank')}
                >
                  Help Center
                </Dropdown.Item>

                <Dropdown.Item
                  onAction={() => window.open('mailto:support@rentmatch.ai', '_blank')}
                >
                  Contact Support
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Popover>
          </SubmenuTrigger>

          <Dropdown.Separator className="my-1 bg-zinc-200/80 dark:bg-zinc-800/80" />

          <Dropdown.Item
            icon={LogOut01}
            onAction={handleSignOut}
            destructive
          >
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};
