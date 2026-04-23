import {NextResponse} from "next/server"
import {getDashboardMetrics} from "@/services/DashboardService"

export async function GET() {
    const metric = await getDashboardMetrics()

    return NextResponse.json(metric, {status: 200})
}
