import prisma from '@/lib/prisma';
import {
    Invoice,
    CreateInvoiceData,
    UpdateInvoiceData,
    FindAllInvoiceParams,
    PaginatedReponse,
    InvoiceStatus
} from '@/types';

export async function findAllInvoices(
    params: FindAllInvoiceParams = {}
): Promise<PaginatedReponse<Invoice>> {
    const {
        search,
        page = 1,
        limit = 10,
        order = 'desc',
        status,
        customerId,
        dateFrom,
        dateTo
    } = params;

    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);
    const skip = (safePage - 1) * safeLimit;


    const conditions: object[] = [];

    if (search) {
        conditions.push({
            customer: {
                OR: [
                    { name: { contains: search, mode: 'insensitive' as const } },
                    { email: { contains: search, mode: 'insensitive' as const } }
                ]
            }
        })
    }

    if (status) {
        conditions.push({ status });
    }

    if (customerId) {
        conditions.push({ customerId });
    }

    const dateFilter: { gte?: Date; lte?: Date } = {}

    if (dateFrom) {
        dateFilter.gte = new Date(dateFrom)
    }

    if (dateTo) {
        dateFilter.lte = new Date(dateTo)
    }

    if (Object.keys(dateFilter).length > 0) {
        conditions.push({ date: dateFilter })
    }

    const where = conditions.length > 0 ? { AND: conditions } : undefined

    const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
            where,
            include: {
                customer: {
                    select: {
                        name: true,
                        email: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { date: order },
            take: safeLimit,
            skip
        }),
        prisma.invoice.count({ where })
    ]);

    const totalPages = Math.ceil(total / safeLimit);

    return {
        data: invoices,     //ERRO NÃO IDENTIFICADO
        meta: {
            total,
            page: safePage,
            limit: safeLimit,
            totalPages,
            hasMore: safePage < totalPages
        }
    }
};

export async function findInvoiceById(
    id: string
): Promise<Invoice | null> {
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    });

    return invoice;
};

export async function createInvoice(
    data: CreateInvoiceData
): Promise<Invoice> {
    const invoice = await prisma.invoice.create({
        data,
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    });

    return invoice;
};

export async function updateInvoice(
    id: string,
    data: CreateInvoiceData
): Promise<Invoice> {
    const invoice = await prisma.invoice.update({
        where: { id },
        data,
        include: {
            customer: {
                select: {
                    name: true,
                    email: true,
                    imageUrl: true
                }
            }
        }
    });

    return invoice;
};

export async function deleteInvoice(
    id: string
): Promise<void> {
    await prisma.invoice.delete({
        where: { id }
    });
};

