import { NextResponse } from 'next/server'
import { InvoiceController } from '@/controllers/InvoiceController'

const { stats } = InvoiceController

export async function GET() {
    const result = await stats()

    return NextResponse.json(
        result.body,
        { status: result.status }
    )
}