import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: Promise<({ id: string })> }) {
    try {
        const userid = await params
        const iD = Number(userid.id)

        const Getuserdata = await prisma.user.findUnique({
            where: { id: iD },
        })
        return NextResponse.json({ data: Getuserdata }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `เกิดข้อผิดพลาดฝั่ง Server${error}` }, { status: 404 })
    }
}