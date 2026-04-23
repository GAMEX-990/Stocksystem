import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { abort } from "process"

export async function GET(req: Request, { params }: { params: Promise<({ id: number })> }) {
    try {
        const productid = await params
        const id = Number(productid.id)

        const Getproductedit = await prisma.product.findUnique({
            where: { id: id },
        })
        return NextResponse.json({data: Getproductedit},{status: 200})
    } catch (erroe) {
        return NextResponse.json({message: `เกิดข้อผิดพลาดฝั่ง Server${erroe}`},{status: 500})
    }
}

export async function PATCH(req: Request,{params}:{params: Promise<({id: number})>}) {
    try {
        const productid = await params
        const id = await Number(productid.id)
        const body = await req.json();
        const EditProduct = await prisma.product.update({
            where: { id: id},
            data: {
                name: body.product_name,
                count: Number(body.count)
            }
        })
        return NextResponse.json({message: "แก้ไขข้อมูลสำเร็จ"},{status: 200})
    } catch (error) {
         return NextResponse.json({message: `เกิดข้อผิดพลาดฝั่ง Server ${error}`})
    }
}