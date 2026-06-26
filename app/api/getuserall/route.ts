import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
   try {
      const useall = await prisma.user.findMany({
         orderBy: {
            id: "asc"
         }
      })
      return NextResponse.json({ data: useall }, { status: 200 })
   } catch (error) {
      return NextResponse.json({ message: `เกิดข้อผิดพลาดที่ Server ${error}` }, { status: 404 })
   }
}