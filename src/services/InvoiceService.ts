import prisma from '@/lib/prisma'
import {
  Invoice,
  CreateInvoiceData,
  UpdateInvoiceData,
  FindAllInvoiceParams,
  PaginatedResponse,
  InvoiceStats
} from '@/types'

export async function findAllInvoices(
  params: FindAllInvoiceParams = {}
): Promise<PaginatedResponse<Invoice>> {
  const {
    search,
    page = 1,
    limit = 10,
    order = 'desc',
    status,
    customerId,
    dateFrom,
    dateTo
  } = params

  const safePage = Math.max(1, page)
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const skip = (safePage - 1) * safeLimit

  const conditions: object[] = []

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
    conditions.push({ status })
  }

  if (customerId) {
    conditions.push({ customerId })
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
  ])

  const totalPages = Math.ceil(total / safeLimit)

  return {
    data: invoices as unknown as Invoice[], // antes era 'invoice' => para solucionar erro agora 'invoice as unknown as Invoice[]'
    meta: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasMore: safePage < totalPages
    }
  }
}

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
  })

  return invoice as Invoice | null // antes era 'invoice' => para solucionar erro agora 'invoice as Invoice | null'
}

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
  })

  return invoice as Invoice
}

export async function updateInvoice(
  id: string,
  data: UpdateInvoiceData
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
  })

  return invoice as Invoice
}

export async function deleteInvoice(
  id: string
): Promise<void> {
  await prisma.invoice.delete({
    where: { id }
  })
}

export async function getInvoiceStats(): Promise<InvoiceStats> {
  const [pendente, pago, total] = await Promise.all([
    prisma.invoice.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { status: 'PENDENTE' }
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      _count: { id: true },
      where: { status: 'PAGO' }
    }),
    prisma.invoice.count()
  ])

  return {
    totalPendente: pendente._sum.amount ?? 0,
    totalPago: pago._sum.amount ?? 0,
    countPendente: pendente._count.id,
    countPago: pago._count.id,
    countTotal: total
  }
}

