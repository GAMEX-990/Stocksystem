import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const Query = searchParams.get("search") || "";
        const Getproduct = await prisma.product.findMany({
            where: Query ? {
                OR: [
                    {
                        nameEN: {
                            contains: Query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        nameTH: {
                            contains: Query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        code: {
                            contains: Query,
                            mode: 'insensitive'
                        }
                    }
                ]
            } : {},
            orderBy: {
                id: "asc"
            }

        });
        return NextResponse.json({ data: Getproduct }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: `เกิดข้อผิดพลาด${error}` }, { status: 500 })
    }
}