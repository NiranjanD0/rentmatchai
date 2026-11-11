'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  CheckCheck,
  Send,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ExternalLink,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import { useProperty } from '@/src/context/PropertyContext';
import {
  Message,
  MessageContent,
  MessageAvatar,
  MessageHeader,
} from '@/src/components/ui/message';
import { Bubble, BubbleContent } from '@/src/components/ui/bubble';
import {
  InputGroup,
  InputGroupTextarea,
  InputGroupAddon,
  InputGroupButton,
} from '@/src/components/ui/input-group';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';
import { Button } from '@/src/components/ui/button';
import { Skeleton } from '@/src/components/ui/skeleton';

export function InboxSkeleton() {
  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#171513] text-zinc-900 dark:text-zinc-100 overflow-hidden select-none transition-colors duration-200">
      {/* 1. Left Conversation List Pane Skeleton */}
      <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#211E1B]/95 shrink-0 h-full">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-8 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                <Skeleton className="h-3 w-36 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
              </div>
            </div>
            <Skeleton className="h-5 w-16 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60" />
          </div>
          <Skeleton className="h-8 w-full rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" />
          <div className="flex gap-1.5 pt-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-14 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60" />
            ))}
          </div>
        </div>

        <div className="p-2 space-y-2 flex-1 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/60 dark:bg-zinc-900/30 flex items-start gap-3"
            >
              <Skeleton className="size-10 rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70 shrink-0" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
                  <Skeleton className="h-3 w-10 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
                </div>
                <Skeleton className="h-3 w-32 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
                <Skeleton className="h-3 w-4/5 rounded bg-zinc-200/50 dark:bg-zinc-800/50" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Middle Active Chat Pane Skeleton */}
      <section className="hidden md:flex flex-1 flex-col h-full bg-white dark:bg-[#171513] overflow-hidden">
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full bg-zinc-200/70 dark:bg-zinc-800/70" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-36 rounded bg-zinc-200/80 dark:bg-zinc-800/80" />
              <Skeleton className="h-3 w-48 rounded bg-zinc-200/60 dark:bg-zinc-800/60" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="size-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
            <Skeleton className="size-8 rounded-lg bg-zinc-200/70 dark:bg-zinc-800/70" />
          </div>
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-10 w-3/4 max-w-md rounded-2xl bg-zinc-200/50 dark:bg-zinc-800/50" />
          <div className="flex justify-end">
            <Skeleton className="h-12 w-64 rounded-2xl bg-zinc-200/70 dark:bg-zinc-800/70" />
          </div>
        </div>
      </section>
    </div>
  );
}

interface ChatMessageItem {
  id: string;
  sender: 'user' | 'participant' | 'system';
  senderName: string;
  avatarText?: string;
  timestamp: string;
  content: string;
  tourCard?: {
    propertyTitle: string;
    date: string;
    time: string;
    status: 'Confirmed' | 'Pending';
  };
}

interface ConversationItem {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  isOnline: boolean;
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyRent: string;
  propertyImage: string;
  propertyBeds: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  category: 'Enquiries' | 'Tours' | 'All';
  messages: ChatMessageItem[];
}

const INITIAL_CONVERSATIONS: ConversationItem[] = [
  {
    id: 'conv-1',
    participantName: 'Dr. Ramesh Patel',
    participantRole: 'Landlord',
    participantAvatar: 'RP',
    isOnline: true,
    propertyId: 'prop-1',
    propertyTitle: '3 BHK High-Floor Flat, Kudasan',
    propertyLocation: 'Near Infocity, Kudasan, Gandhinagar',
    propertyRent: '₹28,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    propertyBeds: '3 BHK',
    lastMessage: 'Sure, you are welcome to visit tomorrow between 4 PM and 6 PM.',
    lastTimestamp: '12m ago',
    unreadCount: 1,
    category: 'Tours',
    messages: [
      {
        id: 'm-1',
        sender: 'system',
        senderName: 'System',
        timestamp: 'Yesterday, 10:15 AM',
        content: 'Direct rental channel initiated. RentMatch zero-brokerage guarantee active.',
      },
      {
        id: 'm-2',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday, 10:20 AM',
        content: 'Hello Dr. Patel, I saw your 3 BHK listing in Kudasan. Is covered parking included in the rent?',
      },
      {
        id: 'm-3',
        sender: 'participant',
        senderName: 'Dr. Ramesh Patel',
        avatarText: 'RP',
        timestamp: 'Yesterday, 11:05 AM',
        content: 'Hello! Yes, one covered basement slot is designated for this flat. Maintenance is ₹2,000/month.',
      },
      {
        id: 'm-4',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Today, 2:10 PM',
        content: 'Could we schedule a walkthrough tour tomorrow evening?',
      },
      {
        id: 'm-5',
        sender: 'participant',
        senderName: 'Dr. Ramesh Patel',
        avatarText: 'RP',
        timestamp: '12m ago',
        content: 'Sure, you are welcome to visit tomorrow between 4 PM and 6 PM.',
        tourCard: {
          propertyTitle: '3 BHK High-Floor Flat, Kudasan',
          date: 'Tomorrow, Nov 9',
          time: '4:30 PM IST',
          status: 'Confirmed',
        },
      },
    ],
  },
  {
    id: 'conv-2',
    participantName: 'Sunita Sharma',
    participantRole: 'Landlord',
    participantAvatar: 'SS',
    isOnline: false,
    propertyId: 'prop-2',
    propertyTitle: '2 BHK Fully Furnished, Infocity',
    propertyLocation: 'Near DA-IICT, Infocity, Gandhinagar',
    propertyRent: '₹22,000/mo',
    propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    propertyBeds: '2 BHK',
    lastMessage: 'Maintenance includes covered car parking and water charges.',
    lastTimestamp: '2h ago',
    unreadCount: 2,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-201',
        sender: 'user',
        senderName: 'You',
        timestamp: '2h ago',
        content: 'Hi Sunita, does the flat have high speed Wi-Fi infrastructure ready?',
      },
      {
        id: 'm-202',
        sender: 'participant',
        senderName: 'Sunita Sharma',
        avatarText: 'SS',
        timestamp: '2h ago',
        content: 'Maintenance includes covered car parking and water charges.',
      },
    ],
  },
  {
    id: 'conv-3',
    participantName: 'Amit Shah',
    participantRole: 'Landlord',
    participantAvatar: 'AS',
    isOnline: true,
    propertyId: 'prop-3',
    propertyTitle: '1 BHK Cozy Studio, Raysan',
    propertyLocation: 'Near PDPU, Raysan, Gandhinagar',
    propertyRent: '₹14,500/mo',
    propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    propertyBeds: '1 BHK',
    lastMessage: 'The security deposit is 2 months rent, fully refundable on vacating.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    category: 'Enquiries',
    messages: [
      {
        id: 'm-301',
        sender: 'user',
        senderName: 'You',
        timestamp: 'Yesterday',
        content: 'Hi Amit, what are the security deposit terms?',
      },
      {
        id: 'm-302',
        sender: 'participant',
        senderName: 'Amit Shah',
        avatarText: 'AS',
        timestamp: 'Yesterday',
        content: 'The security deposit is 2 months rent, fully refundable on vacating.',
      },
    ],
  },
];

const QUICK_REPLIES = [
  'Is this property still available for immediate move-in?',
  'What are the security deposit terms?',
  'Can I schedule a walkthrough visit tomorrow?',
  'Are pets permitted in this building?',
];

export default function DashboardInboxPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>(INITIAL_CONVERSATIONS);
  const [activeConversation, setActiveConversation] = useState<ConversationItem | null>(INITIAL_CONVERSATIONS[0]);
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Enquiries' | 'Tours'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSelectConversation = (conv: ConversationItem) => {
    setActiveConversation(conv);
    setMobileThreadOpen(true);
    // Mark as read
    if (conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeConversation) return;

    const newMsg: ChatMessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: 'You',
      timestamp: 'Just now',
      content: text.trim(),
    };

    const updatedConvs = conversations.map((c) => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: text.trim(),
          lastTimestamp: 'Just now',
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setActiveConversation((prev) => (prev ? { ...prev, messages: [...prev.messages, newMsg] } : null));
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (filterTab === 'Unread' && c.unreadCount === 0) return false;
      if (filterTab === 'Enquiries' && c.category !== 'Enquiries') return false;
      if (filterTab === 'Tours' && c.category !== 'Tours') return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.participantName.toLowerCase().includes(q) ||
          c.propertyTitle.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [conversations, filterTab, searchQuery]);

  if (!mounted) {
    return <InboxSkeleton />;
  }

  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#171513] text-zinc-900 dark:text-zinc-100 overflow-hidden select-none transition-colors duration-200">
      {/* 1. Left Conversation List Pane */}
      <aside
        className={`${
          mobileThreadOpen ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-[#211E1B]/95 backdrop-blur-md shrink-0 h-full`}
      >
        {/* Pane Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Conversations</h2>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Direct renter-owner communication
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60">
              3 Active
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search conversations, listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-8 py-1.5 text-base sm:text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 active:scale-95 touch-manipulation"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {(['All', 'Unread', 'Enquiries', 'Tours'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer shrink-0 active:scale-[0.98] ${
                  filterTab === tab
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-850'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items List */}
        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1 pr-1">
            {filteredConversations.map((conv) => {
              const isSelected = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-3 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-zinc-100/90 dark:bg-zinc-900 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700/80 shadow-xs'
                      : 'border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                          {conv.participantAvatar}
                        </div>
                        {conv.isOnline && (
                          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs truncate text-zinc-900 dark:text-white">
                            {conv.participantName}
                          </span>
                          <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700/60 shrink-0">
                            {conv.participantRole}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400 truncate mt-0.5 font-medium">
                          {conv.propertyTitle}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                        {conv.lastTimestamp}
                      </span>
                      {conv.unreadCount > 0 && (
                        <div className="mt-1 flex justify-end">
                          <span className="size-4 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-[9px] flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-2 pl-11">
                    {conv.lastMessage}
                  </p>
                </div>
              );
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12 text-zinc-400 dark:text-zinc-500 text-xs">
                <Inbox size={28} className="mx-auto mb-2 opacity-40" />
                No messages found.
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* 2. Middle Active Thread Chat Pane */}
      {activeConversation ? (
        <section
          className={`${
            mobileThreadOpen ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col h-full min-w-0 bg-zinc-50 dark:bg-[#171513] relative`}
        >
          {/* Active Conversation Top Bar */}
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/90 dark:bg-[#211E1B]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileThreadOpen(false)}
                className="md:hidden p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800"
                aria-label="Back to conversations list"
              >
                <ArrowLeft size={18} />
              </button>

              <div className="relative shrink-0">
                <div className="size-9 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-800 dark:text-zinc-200">
                  {activeConversation.participantAvatar}
                </div>
                {activeConversation.isOnline && (
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    {activeConversation.participantName}
                  </h3>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Owner
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  <span className="truncate">{activeConversation.propertyTitle}</span>
                  <span>•</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{activeConversation.propertyRent}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
                title="Direct Encrypted Call"
                onClick={() => alert(`Starting direct encrypted call with ${activeConversation.participantName}...`)}
              >
                <Phone size={15} />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
                title="Toggle property details panel"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              >
                {isDetailsOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
              </Button>
            </div>
          </header>

          {/* Active Message Stream */}
          <ScrollArea className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Zero-Brokerage Trust Banner */}
              <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-2.5">
                <ShieldCheck size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="leading-relaxed">
                  RentMatch Verified Channel: You are connected directly with the verified owner. Zero brokerage fees apply.
                </span>
              </div>

              {/* Messages Mapping */}
              {activeConversation.messages.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div key={msg.id} className="flex justify-center my-4">
                      <span className="px-3 py-1 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 text-[11px] font-medium border border-zinc-300/50 dark:border-zinc-700/50">
                        {msg.content}
                      </span>
                    </div>
                  );
                }

                const isMe = msg.sender === 'user';
                return (
                  <Message key={msg.id} align={isMe ? 'end' : 'start'}>
                    <MessageAvatar
                      className={`size-8 text-xs font-bold ${
                        isMe
                          ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                          : 'bg-white text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 shadow-2xs'
                      }`}
                    >
                      {isMe ? user?.firstName?.[0] || 'U' : msg.avatarText || 'P'}
                    </MessageAvatar>

                    <MessageContent>
                      <MessageHeader>
                        <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                          {isMe ? 'You' : msg.senderName}
                        </span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-2">
                          {msg.timestamp}
                        </span>
                      </MessageHeader>

                      <Bubble
                        align={isMe ? 'end' : 'start'}
                        variant={isMe ? 'default' : 'muted'}
                        className="max-w-[85%] sm:max-w-[75%]"
                      >
                        <BubbleContent
                          className={`p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl ${
                            isMe
                              ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs'
                          }`}
                        >
                          {msg.content}

                          {/* Tour Card */}
                          {msg.tourCard && (
                            <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-zinc-900 dark:text-white">
                                  <Calendar size={13} />
                                  Property Walkthrough Tour
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  {msg.tourCard.status}
                                </span>
                              </div>
                              <p className="text-xs font-semibold">{msg.tourCard.propertyTitle}</p>
                              <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                                <span>{msg.tourCard.date}</span>
                                <span>•</span>
                                <span>{msg.tourCard.time}</span>
                              </div>
                            </div>
                          )}
                        </BubbleContent>
                      </Bubble>
                    </MessageContent>
                  </Message>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Bottom Message Input Area */}
          <footer className="p-4 sm:p-6 pt-0 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:pb-6 border-t border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#211E1B]/90 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Quick Replies */}
              <ScrollArea className="w-full whitespace-nowrap py-1">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 mr-1">
                    Quick replies:
                  </span>
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs active:scale-95 touch-manipulation"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Message Textarea */}
              <InputGroup className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 rounded-2xl p-2 transition-all shadow-lg">
                <InputGroupTextarea
                  placeholder={`Type a message to ${activeConversation.participantName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-base sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 min-h-12 max-h-36 py-1 px-2 resize-none"
                />

                <InputGroupAddon
                  align="block-end"
                  className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 px-1 text-xs"
                >
                  <div className="flex items-center gap-2 text-zinc-500">
                    <button
                      type="button"
                      className="p-1 rounded-md text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Attach documents or photos"
                      onClick={() => alert('Attachment upload ready')}
                    >
                      <Paperclip size={15} />
                    </button>
                    <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
                    <span className="hidden sm:inline text-[10px] text-zinc-400 dark:text-zinc-500">
                      Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700 font-mono text-[9px]">Enter</kbd> to send
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <InputGroupButton
                      size="icon-xs"
                      variant="default"
                      onClick={() => handleSendMessage()}
                      disabled={!inputText.trim()}
                      className="size-7 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white dark:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                      aria-label="Send message"
                    >
                      <Send size={13} strokeWidth={2.2} />
                    </InputGroupButton>
                  </div>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </footer>
        </section>
      ) : null}

      {/* 3. Right Property & Contact Details Pane (Toggleable) */}
      {isDetailsOpen && activeConversation && (
        <aside className="hidden xl:flex w-80 h-full border-l border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/70 backdrop-blur-md flex-col shrink-0 animate-in slide-in-from-right duration-200 transition-colors">
          <ScrollArea className="flex-1 p-5">
            <div className="space-y-6">
              {/* Linked Property Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Inquired Property
                </h4>
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 overflow-hidden shadow-xs group">
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeConversation.propertyImage}
                      alt={activeConversation.propertyTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-zinc-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
                      {activeConversation.propertyRent}
                    </div>
                  </div>
                  <div className="p-3.5 space-y-2">
                    <h5 className="font-bold text-xs text-zinc-900 dark:text-white line-clamp-1">
                      {activeConversation.propertyTitle}
                    </h5>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <MapPin size={12} className="shrink-0 text-zinc-600 dark:text-zinc-400" />
                      <span className="truncate">{activeConversation.propertyLocation}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-zinc-600 dark:text-zinc-300">
                        {activeConversation.propertyBeds} Layout
                      </span>
                      <a
                        href={`/properties/${activeConversation.propertyId}`}
                        className="text-zinc-900 dark:text-white hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        Listing Details <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Participant Profile Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Contact Information
                </h4>
                <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-800 dark:text-zinc-200 shrink-0">
                      {activeConversation.participantAvatar}
                    </div>
                    <div>
                      <p className="font-bold text-xs text-zinc-900 dark:text-white">
                        {activeConversation.participantName}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                        Verified {activeConversation.participantRole}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Response Rate</span>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">98% (Within 1 hr)</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span>Identity Verification</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Aadhaar Verified
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs h-9 border-zinc-200 hover:bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer"
                    onClick={() => alert('Tour scheduling flow initiated.')}
                  >
                    <Calendar size={14} className="mr-2 text-zinc-600 dark:text-zinc-400" />
                    Schedule Walkthrough Tour
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs h-9 border-zinc-200 hover:bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer"
                    onClick={() => alert('Digital Lease Agreement generation flow.')}
                  >
                    <Building2 size={14} className="mr-2 text-zinc-600 dark:text-zinc-400" />
                    Review Rental Agreement
                  </Button>
                </div>
              </div>

              {/* Zero-Brokerage Safety Note */}
              <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs space-y-1.5">
                <p className="font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600 dark:text-emerald-400" />
                  RentMatch AI Guarantee
                </p>
                <p className="text-[11px] leading-relaxed">
                  Never pay deposits or token amounts before an in-person walkthrough. Verified listings protect your funds with zero broker commissions.
                </p>
              </div>
            </div>
          </ScrollArea>
        </aside>
      )}
    </div>
  );
}
