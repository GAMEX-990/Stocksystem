import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const deleteall = await prisma.product.updateMany({
      data: {
        count: 0,
        scrap: 0,
      }
    });
    return NextResponse.json({message: `ลบข้อมูล ${deleteall.count} รายการสำเร็จ!!`}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: `เกิดข้อผิดพลาด ${error}` })
  }
}