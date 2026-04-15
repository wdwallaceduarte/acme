import { NextRequest, NextResponse } from "next/server"
import { InvoiceController } from "@/controllers/InvoiceController"

type RouteParams = {
    params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
    const { id } = await params

    const result = await InvoiceController.getById(id)

    return NextResponse.json(result.body, { status: result.status })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
    const { id } = await params

    const body = await request.json()

    const result = await InvoiceController.update(id, body)

    return NextResponse.json(result.body, { status: result.status })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
    const { id } = await params

    const result = await InvoiceController.remove(id)

    return NextResponse.json(result.body, { status: result.status })
}
