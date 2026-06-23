import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: Promise<({ id: string })> }) {
    try {
        const productid = await params
        const iD = Number(productid.id)

        const Deleteproduct = await prisma.product.delete({
            where: { id: iD }
        })
        return NextResponse.json({message: `ลบ ${Deleteproduct.nameEN} สำเร็จ`},{status: 200})
    } catch (error) {
        return NextResponse.json({message: `เกิดข้อผิดพลาดฝั่ง server${error}`},{status: 500})
    }
}