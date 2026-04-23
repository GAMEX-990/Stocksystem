import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const Getproduct = await prisma.product.findMany({
            orderBy:{
                count: "desc"
            }
        });
        return NextResponse.json({data: Getproduct},{status: 200});
    } catch (error) {
         return NextResponse.json({message: `เกิดข้อผิดพลาด${error}`},{status: 500})
    }
}