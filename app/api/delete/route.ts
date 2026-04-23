import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function DELETE() {
    try {
        const deleteall = await prisma.product.deleteMany({});
        return NextResponse.json(deleteall,{status: 200})
    } catch (error) { 
      return NextResponse.json({message: `เกิดข้อผิดพลาด ${error}`})
    }
}