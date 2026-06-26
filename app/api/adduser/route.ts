import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST (req:Request) {
    try {
         const body = await req.json();
         if (!body.username) {
            return NextResponse.json({message: "กรุณากรอกข้อมูลให้ครบถ้วน"},{status: 404})
         }
         const appusername = await prisma.user.create({
            data: {
                name: body.username
            }
         })
         return NextResponse.json({data: appusername},{status: 200})
    } catch (error) {
      return NextResponse.json({message: `เกิดข้อผิดพลาดฝั่ง Server ${error}`},{status: 404})
    }
}