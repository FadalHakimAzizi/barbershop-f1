export type UserRole = 'admin' | 'customer'

export interface Profile {
  id: string
  name: string
  role: UserRole
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
  tone: number
  created_at: string
}

export type BookingStatus = 'menunggu' | 'dikonfirmasi' | 'selesai' | 'dibatalkan'

export interface Booking {
  id: string
  customer_id: string
  service_id: string
  date: string
  time: string
  status: BookingStatus
  created_at: string
  service?: Service
  customer?: Profile
}

export interface ServiceWithCount extends Service {
  count: number
}
