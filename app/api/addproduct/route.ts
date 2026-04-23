import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        if (!body.product_name || !body.count) {
            return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 404 });
        }
        const appproduct = await prisma.product.create({
            data: {
                name: body.product_name,
                count: Number(body.count)
            }
        })

        return NextResponse.json({ message: "บันทึกสำเร็จ" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: `เกิดข้อผิดพลาดในการบันทึกข้อมูล${error}` }, { status: 500 })
    }
}