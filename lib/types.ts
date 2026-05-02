export type Screen =
  | 'splash'
  | 'otp'
  | 'profile-setup'
  | 'home'
  | 'seller-profile'
  | 'post-request'
  | 'inbox'
  | 'chat'
  | 'profile'

export type Department =
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'MECH'
  | 'CE'
  | 'IT'
  | 'AIDS'
  | 'AIML'
  | 'Pharmacy'
  | 'MBA'
  | 'MCA'

export type Year =
  | '1st Year'
  | '2nd Year'
  | '3rd Year'
  | '4th Year'
  | 'PG 1st Year'
  | 'PG 2nd Year'

export type Role = 'find-writers' | 'be-writer' | 'both'

export type OfferType = 'Assignment' | 'Lab Record' | 'Project'

export interface User {
  id: string
  name: string
  email: string
  department: Department
  year: Year
  role: Role
  avatar: string
  avatarColor: string
  verified: boolean
  bio?: string
  rating?: number
  reviewCount?: number
  ordersCompleted?: number
  responseTime?: string
  deliveryDays?: number
  totalEarned?: number
  requestsPosted?: number
}

export interface Seller extends User {
  pricePerPage?: number
  flatPrice?: number
  offers: OfferType[]
  subjects: string[]
}

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: Date
  read: boolean
}

export interface Conversation {
  id: string
  participantId: string
  participant: Seller
  subject: string
  offerType: OfferType
  messages: Message[]
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  isOnline: boolean
}

export interface Request {
  id: string
  type: OfferType
  subject: string
  description: string
  budget: number
  deadline: string
  status: 'active' | 'in-progress' | 'completed' | 'cancelled'
  createdAt: Date
  responses: number
}
