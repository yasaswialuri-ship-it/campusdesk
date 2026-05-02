'use client'

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import type { Conversation } from '@/lib/types'
import { formatDistanceToNow } from '@/lib/utils'
import { MessageCircle, Sparkles } from 'lucide-react'

type Tab = 'all' | 'unread' | 'requests' | 'updates'

function TabButton({
  active,
  onClick,
  children,
  badge,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  badge?: number
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2.5 text-sm font-medium relative transition-all duration-200
        ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}
      `}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        {children}
        {badge !== undefined && badge > 0 && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full min-w-[18px] text-center">
            {badge}
          </span>
        )}
      </span>
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" />
      )}
    </button>
  )
}

function ChatListItem({
  conversation,
  onClick,
}: {
  conversation: Conversation
  onClick: () => void
}) {
  const { participant, lastMessage, lastMessageTime, unreadCount, isOnline, offerType } =
    conversation

  return (
    <button
      onClick={onClick}
      className="w-full p-4 flex gap-4 hover:bg-surface/50 transition-all duration-200 border-b border-border/50 text-left group active:bg-surface"
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg group-hover:scale-105 transition-transform"
          style={{ backgroundColor: participant.avatarColor }}
        >
          {participant.avatar}
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success border-[3px] border-background rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`font-semibold truncate text-base ${
              unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'
            }`}
          >
            {participant.name}
          </h3>
          <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
            {formatDistanceToNow(lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-md">
            {offerType}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {conversation.subject}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p
            className={`text-sm truncate leading-relaxed ${
              unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}
          >
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 w-6 h-6 flex items-center justify-center text-[11px] font-bold bg-primary text-primary-foreground rounded-full flex-shrink-0 shadow-lg shadow-primary/25">
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  )
}

export function InboxScreen() {
  const { conversations, selectConversation, navigateTo, totalUnreadCount } = useApp()
  const [activeTab, setActiveTab] = useState<Tab>('all')

  const filteredConversations = conversations.filter((c) => {
    if (activeTab === 'unread') return c.unreadCount > 0
    return true
  })

  const handleOpenChat = (conversation: Conversation) => {
    selectConversation(conversation)
    navigateTo('chat')
  }

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/50 safe-area-top">
        <div className="p-4 pb-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center glow-primary-subtle">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-syne)] text-xl font-bold text-foreground">
                Inbox
              </h1>
              <span className="text-xs text-muted-foreground">
                {totalUnreadCount > 0 ? `${totalUnreadCount} unread messages` : 'All caught up'}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border/50 -mx-4 px-2">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
            >
              All
            </TabButton>
            <TabButton
              active={activeTab === 'unread'}
              onClick={() => setActiveTab('unread')}
              badge={totalUnreadCount}
            >
              Unread
            </TabButton>
            <TabButton
              active={activeTab === 'requests'}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </TabButton>
            <TabButton
              active={activeTab === 'updates'}
              onClick={() => setActiveTab('updates')}
            >
              Updates
            </TabButton>
          </div>
        </div>
      </div>

      {/* Chat list */}
      <div>
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation, index) => (
            <div key={conversation.id} className="slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ChatListItem
                conversation={conversation}
                onClick={() => handleOpenChat(conversation)}
              />
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No conversations yet</h3>
            <p className="text-muted-foreground text-sm">Start chatting with writers</p>
          </div>
        )}
      </div>
    </div>
  )
}
