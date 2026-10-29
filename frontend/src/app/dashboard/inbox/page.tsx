'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Inbox,
  Search,
  Filter,
  Phone,
  Video,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  CheckCheck,
  Send,
  Sparkles,
  Paperclip,
  PanelRightClose,
  PanelRightOpen,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  User,
  AlertCircle,
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

interface ChatEntry {
  id: string;
  sender: 'user' | 'participant' | 'system';
  senderName: string;
  avatarText?: string;
  content: string;
  timestamp: string;
  tourCard?: {
    date: string;
    time: string;
    propertyTitle: string;
    status: 'Confirmed' | 'Pending' | 'Completed';
  };
}

interface Conversation {
  id: string;
  participantName: string;
  participantRole: 'Landlord' | 'Tenant' | 'Property Manager';
  participantAvatar: string;
  isOnline: boolean;
  propertyTitle: string;
  propertyLocation: string;
  propertyRent: string;
  propertyBeds: string;
  propertyImage: string;
  propertyId: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  category: 'All' | 'Unread' | 'Enquiries' | 'Tours';
  messages: ChatEntry[];
}

export default function DashboardInboxPage() {
  const { user, isTenant, isLister } = useAuth();
  const { properties } = useProperty();

  // Find dynamic fallback property for realistic context
  const primaryProperty = properties[0] || {
    id: 'prop-1',
    title: 'The Monarch High-Rise 2BHK',
    location: 'Sector 7, Gandhinagar',
    rent: 24500,
    bedrooms: 2,
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80'],
  };

  const secondaryProperty = properties[1] || {
    id: 'prop-2',
    title: 'Barton Springs Lofts & Garden',
    location: 'Sargasan, Gandhinagar',
    rent: 21000,
    bedrooms: 2,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80'],
  };

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      participantName: isLister ? 'Aarav Sharma' : 'Rohit Mehta',
      participantRole: isLister ? 'Tenant' : 'Landlord',
      participantAvatar: 'RM',
      isOnline: true,
      propertyTitle: primaryProperty.title,
      propertyLocation: primaryProperty.location,
      propertyRent: `₹${primaryProperty.rent.toLocaleString('en-IN')}/mo`,
      propertyBeds: `${primaryProperty.bedrooms} BHK`,
      propertyImage: (primaryProperty as any).image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=80',
      propertyId: primaryProperty.id,
      unreadCount: 2,
      lastMessage: 'The walkthrough visit is scheduled for Saturday at 2:00 PM. See you then!',
      lastTimestamp: '10:45 AM',
      category: 'Tours',
      messages: [
        {
          id: 'm1',
          sender: 'system',
          senderName: 'RentMatch AI Matchmaker',
          content: 'Direct rental inquiry opened. Both parties verified via Zero-Brokerage Authenticator.',
          timestamp: 'Yesterday 3:15 PM',
        },
        {
          id: 'm2',
          sender: 'participant',
          senderName: isLister ? 'Aarav Sharma' : 'Rohit Mehta',
          avatarText: 'RM',
          content: isLister
            ? "Hello! I saw your listing for The Monarch High-Rise and would love to know if covered car parking is included with the flat."
            : "Hello! Thank you for inquiring about The Monarch High-Rise. Yes, the flat is vacant and ready for immediate possession with dedicated basement parking.",
          timestamp: 'Yesterday 3:20 PM',
        },
        {
          id: 'm3',
          sender: 'user',
          senderName: user?.firstName || 'You',
          content: 'That sounds perfect. Could we schedule an in-person walkthrough this coming Saturday afternoon?',
          timestamp: 'Yesterday 4:10 PM',
        },
        {
          id: 'm4',
          sender: 'participant',
          senderName: isLister ? 'Aarav Sharma' : 'Rohit Mehta',
          avatarText: 'RM',
          content: 'Saturday afternoon works great. How does 2:00 PM sound for you?',
          timestamp: '10:30 AM',
          tourCard: {
            date: 'Saturday, Nov 2, 2026',
            time: '2:00 PM - 2:45 PM',
            propertyTitle: primaryProperty.title,
            status: 'Confirmed',
          },
        },
        {
          id: 'm5',
          sender: 'participant',
          senderName: isLister ? 'Aarav Sharma' : 'Rohit Mehta',
          avatarText: 'RM',
          content: 'The walkthrough visit is scheduled for Saturday at 2:00 PM. See you then!',
          timestamp: '10:45 AM',
        },
      ],
    },
    {
      id: 'conv-2',
      participantName: isLister ? 'Pooja Desai' : 'Vikram Patel',
      participantRole: isLister ? 'Tenant' : 'Landlord',
      participantAvatar: 'PD',
      isOnline: true,
      propertyTitle: secondaryProperty.title,
      propertyLocation: secondaryProperty.location,
      propertyRent: `₹${secondaryProperty.rent.toLocaleString('en-IN')}/mo`,
      propertyBeds: `${secondaryProperty.bedrooms} BHK`,
      propertyImage: (secondaryProperty as any).image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
      propertyId: secondaryProperty.id,
      unreadCount: 1,
      lastMessage: 'Are small pets (golden retriever puppy) permitted in the society?',
      lastTimestamp: '9:12 AM',
      category: 'Enquiries',
      messages: [
        {
          id: 'm2-1',
          sender: 'system',
          senderName: 'RentMatch AI Matchmaker',
          content: 'Direct rental inquiry opened for Barton Springs Lofts.',
          timestamp: '9:00 AM',
        },
        {
          id: 'm2-2',
          sender: 'participant',
          senderName: isLister ? 'Pooja Desai' : 'Vikram Patel',
          avatarText: 'PD',
          content: 'Hello! I work at GIFT City and really like the location of this apartment. Are small pets (golden retriever puppy) permitted in the society?',
          timestamp: '9:12 AM',
        },
      ],
    },
    {
      id: 'conv-3',
      participantName: isLister ? 'Karan Joshi' : 'Ananya Trivedi',
      participantRole: isLister ? 'Tenant' : 'Landlord',
      participantAvatar: 'KJ',
      isOnline: false,
      propertyTitle: 'Shivalik Greens 3BHK Penthouse',
      propertyLocation: 'Kudasan, Gandhinagar',
      propertyRent: '₹32,000/mo',
      propertyBeds: '3 BHK',
      propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80',
      propertyId: 'prop-3',
      unreadCount: 0,
      lastMessage: 'Lease agreement draft has been generated. Please review the terms.',
      lastTimestamp: 'Oct 28',
      category: 'All',
      messages: [
        {
          id: 'm3-1',
          sender: 'user',
          senderName: user?.firstName || 'You',
          content: 'Hi Ananya, is the society maintenance fee included in the monthly ₹32,000 rent?',
          timestamp: 'Oct 28, 11:00 AM',
        },
        {
          id: 'm3-2',
          sender: 'participant',
          senderName: 'Ananya Trivedi',
          avatarText: 'AT',
          content: 'Yes! Society maintenance is included. Lease agreement draft has been generated. Please review the terms.',
          timestamp: 'Oct 28, 1:15 PM',
        },
      ],
    },
  ]);

  const [activeId, setActiveId] = useState<string>('conv-1');
  const [filterTab, setFilterTab] = useState<'All' | 'Unread' | 'Enquiries' | 'Tours'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(true);
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId) || conversations[0];

  // Auto-scroll chat to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSelectConversation = (conv: Conversation) => {
    setActiveId(conv.id);
    setMobileThreadOpen(true);
    // Mark as read
    if (conv.unreadCount > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
      );
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConversation) return;

    const newMessage: ChatEntry = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: user?.firstName || 'You',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              lastMessage: text,
              lastTimestamp: newMessage.timestamp,
              messages: [...c.messages, newMessage],
            }
          : c
      )
    );
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterTab === 'All') return true;
    if (filterTab === 'Unread') return c.unreadCount > 0;
    if (filterTab === 'Enquiries') return c.category === 'Enquiries';
    if (filterTab === 'Tours') return c.category === 'Tours';
    return true;
  });

  const QUICK_REPLIES = [
    'Is this property still available?',
    'Can we schedule a visit this Saturday at 2 PM?',
    'What is the security deposit amount?',
    'Is dedicated parking included?',
  ];

  return (
    <div className="h-full w-full flex bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 overflow-hidden select-none transition-colors duration-200">
      {/* 1. Left Conversation List Pane */}
      <aside
        className={`${
          mobileThreadOpen ? 'hidden md:flex' : 'flex'
        } w-full md:w-80 lg:w-96 flex-col border-r border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/70 backdrop-blur-md shrink-0 h-full`}
      >
        {/* Pane Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Inbox size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Conversations</h2>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Direct renter-owner communication
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
              3 Active
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search conversations, listings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pt-0.5">
            {(['All', 'Unread', 'Enquiries', 'Tours'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                  filterTab === tab
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Items List with ScrollArea */}
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
                      {/* Avatar with status indicator */}
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
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 truncate mt-0.5 font-medium">
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
                          <span className="size-4 rounded-full bg-emerald-600 text-white font-bold text-[9px] flex items-center justify-center">
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
          } flex-1 flex-col h-full min-w-0 bg-zinc-50 dark:bg-[#09090b] relative`}
        >
          {/* Active Conversation Top Bar */}
          <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back Button */}
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
                  <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  <span className="truncate">{activeConversation.propertyTitle}</span>
                  <span>•</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">{activeConversation.propertyRent}</span>
                </div>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
                title="Call Participant"
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

          {/* Active Message Stream with ScrollArea */}
          <ScrollArea className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* System Security Notice Banner */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                <ShieldCheck size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="leading-relaxed">
                  RentMatch Verified Channel: You are connected directly with the verified owner/tenant. No middleman brokerage fees apply.
                </span>
              </div>

              {/* Messages Mapping using shadcn Message and Bubble */}
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
                          ? 'bg-emerald-600/15 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-300 border border-emerald-500/30'
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
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs'
                          }`}
                        >
                          {msg.content}

                          {/* Embedded Tour Request Card */}
                          {msg.tourCard && (
                            <div className="mt-3.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 text-zinc-900 dark:text-zinc-100 shadow-2xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                  <Calendar size={13} />
                                  Property Walkthrough Tour
                                </span>
                                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
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
          <footer className="p-4 sm:p-6 pt-0 border-t border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md shrink-0">
            <div className="max-w-3xl mx-auto space-y-3">
              {/* Quick Canned Reply Chips */}
              <ScrollArea className="w-full whitespace-nowrap py-1">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                    <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                    Quick replies:
                  </span>
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(reply)}
                      className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* shadcn InputGroup with multi-line textarea */}
              <InputGroup className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 rounded-2xl p-2 transition-all shadow-lg">
                <InputGroupTextarea
                  placeholder={`Type a message to ${activeConversation.participantName}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 min-h-12 max-h-36 py-1 px-2 resize-none"
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
                      className="size-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
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
                      <MapPin size={12} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span className="truncate">{activeConversation.propertyLocation}</span>
                    </div>
                    <div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-[11px]">
                      <span className="font-medium text-zinc-600 dark:text-zinc-300">
                        {activeConversation.propertyBeds} Layout
                      </span>
                      <a
                        href={`/properties/${activeConversation.propertyId}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold inline-flex items-center gap-1"
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
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
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
                    <Calendar size={14} className="mr-2 text-emerald-600 dark:text-emerald-400" />
                    Schedule Walkthrough Tour
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-xs h-9 border-zinc-200 hover:bg-zinc-100 text-zinc-800 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-200 cursor-pointer"
                    onClick={() => alert('Digital Lease Agreement generation flow.')}
                  >
                    <Building2 size={14} className="mr-2 text-emerald-600 dark:text-emerald-400" />
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
