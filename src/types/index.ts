export type SortOrder = 'asc' | 'desc'

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export type CreateUserData = Omit<User, 'id'>
export type UpdateUserData = Partial<CreateUserData>

export interface Customer {
  id: string
  name: string
  email: string
  imageUrl: string
}

export type CreateCustomerData = Omit<Customer, 'id'>
export type UpdateCustomerData = Partial<CreateCustomerData>

export interface FindAllCustomersParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  order?: SortOrder
}

export type InvoiceStatus = 'PENDENTE' | 'PAGO'

export interface Invoice {
  id: string
  customerId: string
  amount: number
  date: Date
  status: InvoiceStatus
  customer?: {
    name: string
    email: string
    imageUrl: string
  }
}

export type CreateInvoiceData = Omit<Invoice, 'id' | 'customer'>
export type UpdateInvoiceData = Partial<CreateInvoiceData>

export interface FindAllInvoiceParams {
  search?: string
  page?: number
  limit?: number
  order?: SortOrder
  status?: InvoiceStatus
  customerId?: string
  dateFrom?: string
  dateTo?: string
}

export interface InvoiceStats {
  totalPendente: number
  totalPago: number
  countPendente: number
  countPago: number
  countTotal: number
}

export interface Revenue {
  month: string
  revenue: number
}

export interface DashboardMetrics {
  customerCount: number
  invoiceCount: number
  totalPendente: number
  totalPago: number
  countPendente: number
  countPago: number
  revenue: Revenue[]
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasMore: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  error: string
  details?: Record<string, string[]>
}