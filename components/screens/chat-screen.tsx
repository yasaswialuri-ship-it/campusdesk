'use client'

import { useState, useRef, useEffect } from 'react'
import { useApp } from '@/lib/app-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDistanceToNow } from '@/lib/utils'
import { ArrowLeft, Send, CreditCard, Check, CheckCheck, BadgeCheck } from 'lucide-react'

export function ChatScreen() {
  const {
    selectedConversation,
    navigateTo,
    sendMessage,
    selectConversation,
  } = useApp()
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages])

  if (!selectedConversation) {
    navigateTo('inbox')
    return null
  }

  const { participant, messages, subject, offerType, isOnline } = selectedConversation

  const handleSend = () => {
    if (!newMessage.trim()) return
    sendMessage(selectedConversation.id, newMessage.trim())
    setNewMessage('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleBack = () => {
    selectConversation(null)
    navigateTo('inbox')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 glass border-b border-border/50 p-4 safe-area-top">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-xl glass border border-border/50 flex items-center justify-center text-foreground hover:bg-surface transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg"
              style={{ backgroundColor: participant.avatarColor }}
            >
              {participant.avatar}
            </div>
            {isOnline && (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success border-[3px] border-background rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-lg text-foreground truncate">
                {participant.name}
              </h2>
              <BadgeCheck className="w-5 h-5 text-primary fill-primary/20 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-primary/15 text-primary rounded-md">
                {offerType}
              </span>
              <span className="text-xs text-muted-foreground truncate">{subject}</span>
            </div>
          </div>

          {isOnline && (
            <span className="px-2.5 py-1 text-xs font-medium text-success bg-success/10 rounded-full flex items-center gap-1.5 flex-shrink-0">
              <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              Online
            </span>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message, index) => {
          const isMe = message.senderId === 'me'
          const showTimestamp = index === 0 || 
            new Date(messages[index - 1].timestamp).getTime() - new Date(message.timestamp).getTime() > 300000

          return (
            <div key={message.id} className="slide-up" style={{ animationDelay: `${index * 30}ms` }}>
              {showTimestamp && (
                <p className="text-center text-xs text-muted-foreground mb-3">
                  {formatDistanceToNow(message.timestamp)}
                </p>
              )}
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold text-white mr-2 flex-shrink-0 self-end"
                    style={{ backgroundColor: participant.avatarColor }}
                  >
                    {participant.avatar}
                  </div>
                )}
                <div
                  className={`
                    max-w-[75%] rounded-2xl px-4 py-3 relative
                    ${
                      isMe
                        ? 'bg-gradient-to-br from-primary to-violet-600 text-primary-foreground rounded-br-md shadow-lg shadow-primary/20'
                        : 'glass border border-border/50 text-foreground rounded-bl-md'
                    }
                  `}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-end' : ''}`}>
                    <p
                      className={`text-[10px] ${
                        isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'
                      }`}
                    >
                      {new Date(message.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                    {isMe && (
                      <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/70" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Confirm & Pay Banner */}
      <div className="flex-shrink-0 bg-success/5 border-t border-success/20 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/15 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ready to proceed?</p>
              <p className="text-xs text-muted-foreground">Secure payment via UPI</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-success hover:bg-success/90 text-success-foreground font-semibold rounded-xl gap-1.5"
          >
            <Check className="w-4 h-4" />
            Confirm & Pay
          </Button>
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 glass border-t border-border/50 p-4 safe-area-bottom">
        <div className="flex gap-3">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-12 bg-surface border-border text-foreground placeholder:text-muted-foreground rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="h-12 w-12 p-0 bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-primary-foreground rounded-xl disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
