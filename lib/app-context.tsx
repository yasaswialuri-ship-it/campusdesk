'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Screen, User, Department, Year, Role, Seller, Conversation, Request, Message, OfferType } from './types'
import { mockSellers, mockConversations, mockRequests } from './mock-data'

interface AppState {
  currentScreen: Screen
  user: Partial<User> | null
  profileSetupStep: number
  selectedSeller: Seller | null
  selectedConversation: Conversation | null
  conversations: Conversation[]
  requests: Request[]
  sellers: Seller[]
  filters: {
    offerType: OfferType | 'All'
    branch: Department | 'All'
    search: string
    sort: 'rating' | 'price-low' | 'price-high' | 'orders'
  }
}

interface AppContextType extends AppState {
  navigateTo: (screen: Screen) => void
  setUserEmail: (email: string) => void
  setUserName: (name: string) => void
  setUserDepartment: (department: Department) => void
  setUserYear: (year: Year) => void
  setUserRole: (role: Role) => void
  nextProfileStep: () => void
  prevProfileStep: () => void
  selectSeller: (seller: Seller | null) => void
  selectConversation: (conversation: Conversation | null) => void
  sendMessage: (conversationId: string, text: string) => void
  setFilter: <K extends keyof AppState['filters']>(key: K, value: AppState['filters'][K]) => void
  addRequest: (request: Omit<Request, 'id' | 'createdAt' | 'responses' | 'status'>) => void
  totalUnreadCount: number
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentScreen: 'splash',
    user: null,
    profileSetupStep: 1,
    selectedSeller: null,
    selectedConversation: null,
    conversations: mockConversations,
    requests: mockRequests,
    sellers: mockSellers,
    filters: {
      offerType: 'All',
      branch: 'All',
      search: '',
      sort: 'rating',
    },
  })

  const navigateTo = useCallback((screen: Screen) => {
    setState((prev) => ({ ...prev, currentScreen: screen }))
  }, [])

  const setUserEmail = useCallback((email: string) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, email },
    }))
  }, [])

  const setUserName = useCallback((name: string) => {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, name, avatar: initials },
    }))
  }, [])

  const setUserDepartment = useCallback((department: Department) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, department },
    }))
  }, [])

  const setUserYear = useCallback((year: Year) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, year },
    }))
  }, [])

  const setUserRole = useCallback((role: Role) => {
    setState((prev) => ({
      ...prev,
      user: { ...prev.user, role },
    }))
  }, [])

  const nextProfileStep = useCallback(() => {
    setState((prev) => {
      if (prev.profileSetupStep >= 4) {
        return { ...prev, currentScreen: 'home' }
      }
      return { ...prev, profileSetupStep: prev.profileSetupStep + 1 }
    })
  }, [])

  const prevProfileStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      profileSetupStep: Math.max(1, prev.profileSetupStep - 1),
    }))
  }, [])

  const selectSeller = useCallback((seller: Seller | null) => {
    setState((prev) => ({ ...prev, selectedSeller: seller }))
  }, [])

  const selectConversation = useCallback((conversation: Conversation | null) => {
    if (conversation) {
      setState((prev) => ({
        ...prev,
        selectedConversation: conversation,
        conversations: prev.conversations.map((c) =>
          c.id === conversation.id ? { ...c, unreadCount: 0 } : c
        ),
      }))
    } else {
      setState((prev) => ({ ...prev, selectedConversation: null }))
    }
  }, [])

  const sendMessage = useCallback((conversationId: string, text: string) => {
    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text,
      timestamp: new Date(),
      read: true,
    }
    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              lastMessage: text,
              lastMessageTime: new Date(),
            }
          : c
      ),
      selectedConversation:
        prev.selectedConversation?.id === conversationId
          ? {
              ...prev.selectedConversation,
              messages: [...prev.selectedConversation.messages, newMessage],
              lastMessage: text,
              lastMessageTime: new Date(),
            }
          : prev.selectedConversation,
    }))
  }, [])

  const setFilter = useCallback(
    <K extends keyof AppState['filters']>(key: K, value: AppState['filters'][K]) => {
      setState((prev) => ({
        ...prev,
        filters: { ...prev.filters, [key]: value },
      }))
    },
    []
  )

  const addRequest = useCallback(
    (request: Omit<Request, 'id' | 'createdAt' | 'responses' | 'status'>) => {
      const newRequest: Request = {
        ...request,
        id: `r${Date.now()}`,
        createdAt: new Date(),
        responses: 0,
        status: 'active',
      }
      setState((prev) => ({
        ...prev,
        requests: [newRequest, ...prev.requests],
        currentScreen: 'home',
      }))
    },
    []
  )

  const totalUnreadCount = state.conversations.reduce((acc, c) => acc + c.unreadCount, 0)

  return (
    <AppContext.Provider
      value={{
        ...state,
        navigateTo,
        setUserEmail,
        setUserName,
        setUserDepartment,
        setUserYear,
        setUserRole,
        nextProfileStep,
        prevProfileStep,
        selectSeller,
        selectConversation,
        sendMessage,
        setFilter,
        addRequest,
        totalUnreadCount,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
