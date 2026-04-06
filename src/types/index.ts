export interface User {
    id: string;
    nome: string;
    email: string;
    password: string;
}

export type CreatUserData = Omit<User, 'id'>
export type UpdateUserData = Partial<CreatUserData>

export interface Customer {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
}

export type CreateCustomerData = Omit<Customer, 'id'>
export type UpdateCustomerData = Partial<CreateCustomerData>

export type InvoiceStatus = 'PAGO' | 'PENDENTE'
export interface Invoice {
    id: string;
    amount: number;
    date: Date;
    status: InvoiceStatus;
    customer_id: string;
}

export type CreatInvoiceData = Omit<Invoice, 'id'>
export type UpdateInvoiceData = Partial<CreatInvoiceData>

export interface Revenue {
    month: string;
    revenue: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface ApiError {
    error: string;
    details?: Record<string, string[]>
}