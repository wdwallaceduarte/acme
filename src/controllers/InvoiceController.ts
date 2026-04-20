import { z } from 'zod'
import {
    findAllInvoices,
    findInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceStats
} from '@/services/InvoiceService'
import { 
    ApiError, 
    SortOrder, 
    InvoiceStatus, 
    InvoiceStats
 } from '@/types'


export const CreateInvoiceSchema = z.object({
    customerId: z
        .string({ required_error: 'O campo é obrigatorio.' })
        .uuid('O campo deve ser um UUID válido.'),
    amount: z
        .number({ required_error: 'O campo é obrigatorio' })
        .int('O valor deve ser um número inteiro.')
        .positive('O valor deve ser maior que zero.'),
    date: z.coerce
        .date({ required_error: 'O campo é obrigatório.' }),
    status: z.enum(['PENDENTE', 'PAGO'], { required_error: 'O campo é obrigatório.', message: 'O status deve ser PENDENTE ou PAGO.' })

})

const UpdateInvoiceSchema = CreateInvoiceSchema.partial()

export type CreateInvoiceDTO = z.infer<typeof CreateInvoiceSchema>
export type UpdateInvoiceDTO = z.infer<typeof UpdateInvoiceSchema>

function buildErrorResponse(
    message: string,
    details?: Record<string, string[]>
): ApiError {
    if (details) {
        return { error: message, details }
    }
    return { error: message }
}

export const InvoiceController = {
    async getAll(searchParams: URLSearchParams) {
        const search = searchParams.get('search') ?? undefined
        const page = Number(searchParams.get('page')) || 1
        const limit = Number(searchParams.get('limit')) || 10
        const order = (searchParams.get('order') as SortOrder) ?? 'desc'
        const status = searchParams.get('status') as InvoiceStatus | null ?? undefined
        const customerId = searchParams.get('customerId') ?? undefined
        const dateFrom = searchParams.get('dateFrom') ?? undefined
        const dateTo = searchParams.get('dateTo') ?? undefined

        const invoices = await findAllInvoices({
            search,
            page,
            limit,
            order,
            status,
            customerId,
            dateFrom,
            dateTo
        })

        return { status: 200, body: invoices }
    },

    async stats() {
        const data: InvoiceStats = await getInvoiceStats()
        return
    },

    async getById(id: string) {
        const invoice = await findInvoiceById(id)

        if (!invoice) {
            return {
                status: 404,
                body: buildErrorResponse('Fatura não encontrada.')
            }
        }

        return {
            status: 200, body: invoice
        }

    },
    async create(data: unknown) {
        const parsed = CreateInvoiceSchema.safeParse(data)

        if (!parsed.success) {
            return {
                status: 400,
                body: buildErrorResponse(
                    'Dados invalidos',
                    parsed.error.flatten().fieldErrors as Record<string, string[]>
                )
            }
        }
        const invoice = await createInvoice(parsed.data)

        return { status: 201, body: invoice }
    },

    async update(id: string, data: unknown) {
        const existing = await findInvoiceById(id)

        if (!existing) {
            return {
                status: 404,
                body: buildErrorResponse('Fatura não encontrada.')
            }
        }

        const parsed = UpdateInvoiceSchema.safeParse(data)

        if (!parsed.success) {
            return {
                status: 400,
                body: buildErrorResponse(
                    'Dados inválidos',
                    parsed.error.flatten().fieldErrors as Record<string, string[]>
                )
            }
        }

        const invoice = await updateInvoice(id, parsed.data)

        return { status: 201, body: invoice }
    },

    async remove(id: string) {
        const existing = await findInvoiceById(id)

        if (!existing) {
            return {
                status: 404,
                body: buildErrorResponse('Fatura não encontrada.')
            }
        }

        await deleteInvoice(id)

        return {
            status: 200, body: { message: 'Fatura removida com sucesso' }
        }
    }
}
