import { z } from 'zod'
import {
    findAllCustomers,
    findCustomerById,
    createCustomer,
    updateCustomer,
    deletCustomer
} from '@/services/CustomerService'
import { ApiError } from '@/types'


const CreateCustomerSchema = z.object({
    name: z
        .string({ required_error: 'O campo é obrigatorio.' })
        .min(1)
        .max(100),
    email: z
        .string({ required_error: 'O campo é obrigatório.' })
        .email('O campo possui formado inválido.'),
    imageUrl: z
        .string({ required_error: 'O campo é obrigatorio.' })
        .url('O campo possui formato inválido.')
})

const UpdateCustomerSchema = CreateCustomerSchema.partial()

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>
export type UpdateCustomerDTO = z.infer<typeof UpdateCustomerSchema>

async function buildErrorResponse(
    message: string,
    details?: Record<string, string[]>
): Promise<ApiError> { // Correção do codigo => ): ApiError {
    if (details) {
        return { error: message, details }
    }
    return { error: message }
}

export const CustomerController = {
    async getAll(searchParams: URLSearchParams) {
        const search = searchParams.get('search') ?? undefined

        const customers = await findAllCustomers({ search })

        return {
            status: 200,
            body: customers
        }
    },
    async getById(id: string) {
        const customer = await findCustomerById(id)

        if (!customer) {
            return {
                status: 404,
                body: buildErrorResponse('Cliente não encontrado.')
            }
        }
        return {
            status: 200,
            body: customer
        }
    },
    async create(data: undefined) {
        const parsed = CreateCustomerSchema.safeParse(data)

        if (!parsed.success) {
            return {
                status: 400,
                body: buildErrorResponse(
                    'Dados inválidos.',
                    parsed.error.flatten().fieldErrors as Record<string, string[]>
                )
            }
        }
        const customer = await createCustomer(parsed.data)

        return {
            status: 201,
            body: customer
        }
    },
    async update(id: string, data: unknown) {
        const existing = await findCustomerById(id)

        if (!existing) {
            return {
                status: 404,
                body: buildErrorResponse('Cliente não encontrado.')
            }
        }

        const parsed = UpdateCustomerSchema.safeParse(data)

        if (!parsed.success) {
            return {
                status: 400,
                body: buildErrorResponse(
                    'Dados inválidos.',
                    parsed.error.flatten().fieldErrors as Record<string, string[]>
                )
            }
        }

        const customer = await updateCustomer(id, parsed.data)

        return {
            status: 200,
            body: customer
        }

    },
    async remove(id: string) {
        const existing = await findCustomerById(id)

        if (!existing) {
            return {
                status: 404,
                body: buildErrorResponse('Cliente não encontrado')
            }
        }

        await deletCustomer(id)

        return {
            status: 200,
            body: { message: 'Cliente removido com sucesso.' }
        }
    }
}
