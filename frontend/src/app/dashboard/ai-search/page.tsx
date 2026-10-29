'use client';

import React, { useState, useRef } from 'react';
import {
  Sparkles,
  History,
  Plus,
  ArrowUp,
  MessageSquare,
  Trash2,
  Clock,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Compass,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/src/context/AuthContext';
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/src/components/ui/message-scroller';
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
import { Button } from '@/src/components/ui/button';
import { ScrollArea, ScrollBar } from '@/src/components/ui/scroll-area';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  properties?: Array<{
    title: string;
    price: string;
    location: string;
    beds: string;
    matchScore: number;
    badge?: string;
  }>;
}

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  category: 'Today' | 'Yesterday' | 'Previous 7 Days';
  previewPrompt: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      "Hello! I'm your RentMatch AI Search assistant. Describe what you're looking for—such as neighborhood, budget, pet policies, or specific amenities—and I'll find matching properties and market comparisons.",
    timestamp: '10:42 AM',
  },
  {
    id: 'msg-2',
    role: 'user',
    content:
      'Find me pet-friendly 2-bedroom apartments near Downtown Austin with in-unit laundry under $2,400/month.',
    timestamp: '10:43 AM',
  },
  {
    id: 'msg-3',
    role: 'assistant',
    content:
      'I analyzed 48 properties in Downtown and surrounding corridors. Here are 3 top matches fitting your criteria:',
    timestamp: '10:43 AM',
    properties: [
      {
        title: 'The Monarch High-Rise',
        price: '$2,350/mo',
        location: 'Downtown • 0.4 mi to transit',
        beds: '2 Bed • 2 Bath',
        matchScore: 98,
        badge: 'Top Match',
      },
      {
        title: 'Barton Springs Lofts',
        price: '$2,180/mo',
        location: 'South Congress • Dog park on-site',
        beds: '2 Bed • 1.5 Bath',
        matchScore: 94,
      },
      {
        title: 'Rainey Street Residences',
        price: '$2,400/mo',
        location: 'Rainey Historic District • In-unit W/D',
        beds: '2 Bed • 2 Bath',
        matchScore: 91,
      },
    ],
  },
];

const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'h-1',
    title: 'Downtown Austin 2BHK with balcony',
    timestamp: 'Just now',
    category: 'Today',
    previewPrompt:
      'Find me pet-friendly 2-bedroom apartments near Downtown Austin with in-unit laundry under $2,400/month.',
  },
  {
    id: 'h-2',
    title: 'Pet friendly flats near Zilker Park',
    timestamp: '2 hours ago',
    category: 'Today',
    previewPrompt: 'Looking for modern flats near Zilker Park allowing large dogs.',
  },
  {
    id: 'h-3',
    title: 'Average rent in Travis County',
    timestamp: 'Yesterday',
    category: 'Yesterday',
    previewPrompt: 'Compare average rental yield and rent growth in Travis County.',
  },
  {
    id: 'h-4',
    title: 'Modern studio near University campus',
    timestamp: 'Yesterday',
    category: 'Yesterday',
    previewPrompt: 'Furnished studio lofts near university with high-speed internet.',
  },
  {
    id: 'h-5',
    title: 'High-rise lofts with EV charging',
    timestamp: '3 days ago',
    category: 'Previous 7 Days',
    previewPrompt: 'Apartments with dedicated EV charging stalls and garage parking.',
  },
  {
    id: 'h-6',
    title: 'Quiet 1-bedroom near tech hubs',
    timestamp: '5 days ago',
    category: 'Previous 7 Days',
    previewPrompt: 'Quiet 1-bed apartments within 15 minutes of Apple campus.',
  },
];

const SUGGESTIONS = [
  '2-bed pet-friendly apartments under $2,200',
  'Compare average rent near tech hubs',
  'Lofts with in-unit laundry and garage',
  'Top-rated school district family rentals',
];

export default function AISearchPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>(INITIAL_HISTORY);
  const [activeHistoryId, setActiveHistoryId] = useState<string>('h-1');
  const [historySearch, setHistorySearch] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        content: `I searched RentMatch AI's verified database for "${text}". Found multiple matching listings with current lease availability and market valuation.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        properties: [
          {
            title: 'Cedar Valley Residences',
            price: '$2,150/mo',
            location: 'Central District • Fast transit link',
            beds: '2 Bed • 2 Bath',
            matchScore: 96,
            badge: 'Verified Match',
          },
          {
            title: 'Skyline Overlook Lofts',
            price: '$2,300/mo',
            location: 'West End • Balcony & Parking',
            beds: '2 Bed • 2 Bath',
            matchScore: 92,
          },
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setActiveHistoryId(item.id);
    // Load conversation context preview
    setMessages([
      {
        id: `prev-1-${item.id}`,
        role: 'user',
        content: item.previewPrompt,
        timestamp: item.timestamp,
      },
      {
        id: `prev-2-${item.id}`,
        role: 'assistant',
        content: `Here are the search results and comparative analysis saved from your query "${item.title}".`,
        timestamp: item.timestamp,
        properties: [
          {
            title: 'The Monarch High-Rise',
            price: '$2,350/mo',
            location: 'Downtown • 0.4 mi to transit',
            beds: '2 Bed • 2 Bath',
            matchScore: 98,
            badge: 'Top Match',
          },
          {
            title: 'Barton Springs Lofts',
            price: '$2,180/mo',
            location: 'South Congress • Dog park on-site',
            beds: '2 Bed • 1.5 Bath',
            matchScore: 94,
          },
        ],
      },
    ]);
  };

  const handleNewChat = () => {
    setActiveHistoryId('');
    setMessages([
      {
        id: `new-${Date.now()}`,
        role: 'assistant',
        content:
          "Ready for a new search! Tell me your desired city, budget, bedrooms, or special preferences.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    textareaRef.current?.focus();
  };

  const handleDeleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    if (activeHistoryId === id) {
      setActiveHistoryId('');
    }
  };

  const filteredHistory = historyItems.filter((item) =>
    item.title.toLowerCase().includes(historySearch.toLowerCase())
  );

  const categories: Array<'Today' | 'Yesterday' | 'Previous 7 Days'> = [
    'Today',
    'Yesterday',
    'Previous 7 Days',
  ];

  return (
    <div className="h-full w-full flex overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 select-none transition-colors duration-200">
      {/* Center Chat Thread Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-zinc-50 dark:bg-[#09090b] transition-colors duration-200">
        {/* Sub-header inside Chat Pane */}
        <div className="h-12 border-b border-zinc-200 dark:border-zinc-800/80 px-4 sm:px-6 flex items-center justify-between bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xs shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
              <Sparkles size={13} className="text-emerald-600 dark:text-emerald-400" />
              <span>RentMatch AI Agent</span>
            </span>
            <span className="text-zinc-400 dark:text-zinc-500 hidden sm:inline">•</span>
            <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline text-[11px]">
              Natural language rental search &amp; market intelligence
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="text-xs text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 h-8 gap-1.5 cursor-pointer"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Search</span>
            </Button>

            {/* Toggle History Sidebar button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800/80 cursor-pointer"
              aria-label={isHistoryOpen ? 'Collapse history' : 'Expand history'}
              title={isHistoryOpen ? 'Hide search history' : 'Show search history'}
            >
              {isHistoryOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            </Button>
          </div>
        </div>

        {/* Message Scroller Container */}
        <div className="flex-1 min-h-0 relative">
          <MessageScrollerProvider autoScroll>
            <MessageScroller className="h-full">
              <MessageScrollerViewport className="p-4 sm:p-6 lg:p-8">
                <MessageScrollerContent className="max-w-3xl mx-auto space-y-6 pb-4">
                  {messages.map((msg) => (
                    <MessageScrollerItem key={msg.id} messageId={msg.id} scrollAnchor>
                      <Message align={msg.role === 'user' ? 'end' : 'start'}>
                        {/* Avatar */}
                        <MessageAvatar
                          className={`size-8 text-xs font-semibold ${
                            msg.role === 'user'
                              ? 'bg-emerald-600/15 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-300 border border-emerald-500/30'
                              : 'bg-white text-zinc-800 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700/80 shadow-xs'
                          }`}
                        >
                          {msg.role === 'user' ? (
                            <span>{user?.firstName?.[0] || 'U'}</span>
                          ) : (
                            <Bot size={15} className="text-emerald-600 dark:text-emerald-400" />
                          )}
                        </MessageAvatar>

                        {/* Content */}
                        <MessageContent>
                          <MessageHeader>
                            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                              {msg.role === 'user' ? 'You' : 'RentMatch AI'}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 ml-2">
                              {msg.timestamp}
                            </span>
                          </MessageHeader>

                          <Bubble
                            align={msg.role === 'user' ? 'end' : 'start'}
                            variant={msg.role === 'user' ? 'default' : 'muted'}
                            className="max-w-[85%] sm:max-w-[78%]"
                          >
                            <BubbleContent
                              className={`p-3.5 text-xs sm:text-sm leading-relaxed rounded-2xl ${
                                msg.role === 'user'
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xs'
                              }`}
                            >
                              {msg.content}

                              {/* Rich Property Cards Inside Assistant Message */}
                              {msg.properties && msg.properties.length > 0 && (
                                <div className="mt-3.5 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5">
                                  {msg.properties.map((prop, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                                    >
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold text-xs sm:text-sm text-zinc-900 dark:text-white truncate">
                                            {prop.title}
                                          </span>
                                          {prop.badge && (
                                            <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                              {prop.badge}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                                          {prop.location}
                                        </div>
                                        <div className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 mt-1">
                                          {prop.beds}
                                        </div>
                                      </div>

                                      <div className="text-right shrink-0">
                                        <div className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                          {prop.price}
                                        </div>
                                        <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                                          Match: <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{prop.matchScore}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </BubbleContent>
                          </Bubble>
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <Message align="start">
                      <MessageAvatar className="size-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
                        <Bot size={15} className="text-emerald-600 dark:text-emerald-400 animate-pulse" />
                      </MessageAvatar>
                      <MessageContent>
                        <Bubble variant="muted">
                          <BubbleContent className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs">
                            <div className="flex items-center gap-1.5 py-1 px-1">
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" />
                            </div>
                          </BubbleContent>
                        </Bubble>
                      </MessageContent>
                    </Message>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </div>

        {/* Input & Suggestions Footer Area */}
        <div className="p-4 sm:p-6 pt-0 border-t border-zinc-200 dark:border-zinc-800/80 bg-white/90 dark:bg-[#09090b]/80 backdrop-blur-md shrink-0 transition-colors duration-200">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Quick Suggestions Chips */}
            {messages.length <= 3 && (
              <ScrollArea className="w-full whitespace-nowrap py-1">
                <div className="flex items-center gap-1.5 pb-1">
                  <span className="text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                    <Compass size={12} />
                    Suggested:
                  </span>
                  {SUGGESTIONS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item)}
                      className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/90 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-white text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-2xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            )}

            {/* shadcn InputGroup with Textarea and Bottom Addons */}
            <InputGroup className="bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-400 dark:focus-within:ring-zinc-600 rounded-2xl p-2 transition-all shadow-lg">
              <InputGroupTextarea
                ref={textareaRef}
                placeholder="Ask RentMatch AI to find homes, check rent trends, or compare neighborhoods..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 min-h-12 max-h-36 py-1 px-2 resize-none"
              />

              <InputGroupAddon
                align="block-end"
                className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/80 pt-2 px-1 text-xs"
              >
                <div className="flex items-center gap-2 text-zinc-500">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    <Sparkles size={12} className="text-emerald-600 dark:text-emerald-400" />
                    <span>RentMatch Search v2</span>
                  </span>
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
                    disabled={!inputValue.trim() || isTyping}
                    className="size-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    aria-label="Send message"
                  >
                    <ArrowUp size={14} strokeWidth={2.5} />
                  </InputGroupButton>
                </div>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </div>

      {/* Right Side: Search History Sidebar */}
      {isHistoryOpen && (
        <aside className="w-72 xl:w-80 h-full border-l border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/60 backdrop-blur-md flex flex-col shrink-0 animate-in slide-in-from-right duration-200 transition-colors">
          {/* History Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="font-semibold text-sm text-zinc-900 dark:text-white">Search History</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              onClick={handleNewChat}
              className="text-[11px] h-7 gap-1 border-zinc-200 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/80 dark:text-zinc-300 dark:hover:text-white cursor-pointer"
            >
              <Plus size={12} />
              <span>New</span>
            </Button>
          </div>

          {/* Search filter in history */}
          <div className="p-3 border-b border-zinc-100 dark:border-zinc-800/60">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Search history..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-zinc-900 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-hidden focus:border-zinc-400 dark:focus:border-zinc-700 transition-colors"
              />
            </div>
          </div>

          {/* History Item List */}
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-4 pr-2">
              {categories.map((category) => {
                const items = filteredHistory.filter((item) => item.category === category);
                if (items.length === 0) return null;

                return (
                  <div key={category} className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      {category}
                    </div>
                    {items.map((item) => {
                      const isActive = activeHistoryId === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectHistory(item)}
                          className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-zinc-100 text-zinc-900 font-medium border border-zinc-200/90 dark:bg-zinc-800/90 dark:text-white dark:border-zinc-700/50 shadow-2xs'
                              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-900/70 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2">
                            <MessageSquare
                              size={14}
                              className={`shrink-0 ${
                                isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                              }`}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium">{item.title}</p>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate mt-0.5">
                                {item.timestamp}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistory(e, item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-zinc-400 hover:text-rose-600 dark:text-zinc-500 dark:hover:text-rose-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                            aria-label="Delete history entry"
                            title="Delete"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {filteredHistory.length === 0 && (
                <div className="text-center py-8 text-zinc-400 dark:text-zinc-500 text-xs">
                  <Clock size={20} className="mx-auto mb-2 opacity-50" />
                  No searches matching &quot;{historySearch}&quot;
                </div>
              )}
            </div>
          </ScrollArea>

          {/* History Footer */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 text-[11px] text-zinc-500 flex items-center justify-between">
            <span>{historyItems.length} saved searches</span>
            <button
              type="button"
              onClick={() => setHistoryItems([])}
              className="hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}
