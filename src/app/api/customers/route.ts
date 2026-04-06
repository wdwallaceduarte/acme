import {
    NextRequest,
    NextResponse
} from 'next/server'
import { CustomerController } from '@/controllers/CustomerController'

const {
    getAll,
    getById,
    create,
    update,
    remove
} = CustomerController

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl

    const result = await getAll(searchParams)

    return NextResponse.json(
        result.body,
        { status: result.status }
    )
}

export async function POST(request: NextRequest) {
    const body = await request.json()

    const result = await create(body)

    return NextResponse.json(
        result.body,
        { status: result.status}
    )
}