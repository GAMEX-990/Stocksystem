"use client"
import { useParams, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useState } from 'react'
import { ProductType, Userdata } from '../types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';

const SavePageContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [userdata, Setuserdata] = useState<Userdata | null>(null);
  const [product, Setproduct] = useState<ProductType[]>([]);
  const [loder, Setloder] = useState(false);

  useEffect(() => {
    if (!id) return
    Getuser();
    Getproduct();
  }, [id])

  const Getuser = async () => {
    if (!id) return;
    const req = await fetch(`/api/getuser/${id}`, {
      method: "GET",
    })
    const data = await req.json();
    Setuserdata(data.data)
  }

  const Getproduct = async () => {
    Setloder(true);
    if (!id) return;
    try {
      const req = await fetch(`/api/getproduct`, {
        method: "GET",
      })
      const data = await req.json();
      Setproduct(data.data)
    } catch (error) {
      toast.error("ไม่สามารถดึงข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      Setloder(false);
    }
  }

  return (
    <div>

      {/* 📋 ส่วนหัวเอกสารและแดชบอร์ดผู้ใช้งาน */}
      <div className="mt-10 justify-center flex flex-col px-4 max-w-2xl mx-auto space-y-6">
        <div className="text-center border border-zinc-200 rounded-lg p-4 shadow-sm bg-white">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            ✓ บันทึกข้อมูลสำเร็จ
          </span>
          <h1 className="text-2xl font-bold text-zinc-900 mt-2 tracking-tight">รายงานสรุปยอดนับสต็อก</h1>
          <p className="text-xs text-zinc-500 mt-0.5">ตรวจสอบความถูกต้องของรายการสินค้าทั้งหมด</p>
        </div>

        <div>
          {userdata && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-zinc-50 p-4 rounded-lg border border-zinc-100 w-full md:w-auto">
              <div>
                <p className="text-xs text-zinc-400 font-medium">ชื่อผู้ตรวจสอบ/ผู้นับ</p>
                <p className="text-sm font-semibold text-zinc-800 mt-0.5">{userdata.name}</p>
              </div>
              <div className="sm:border-l sm:pl-8 border-zinc-200">
                <p className="text-xs text-zinc-400 font-medium">วันที่</p>
                <p className="text-sm font-medium text-zinc-700 mt-0.5">
                  {new Date(userdata.updatedAt).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })} น.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* 📦 ส่วนตารางสรุปรายการสินค้า */}
        <Card size="sm" className="w-full bg-white text-zinc-900 border border-zinc-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-semibold text-lg tracking-tight">
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-800 hover:bg-zinc-100 border-none font-medium text-sm px-2.5 py-0.5 rounded-md">
                  รายชื่อของทั้งหมด
                </Badge>
              </CardTitle>
              {/* <Button
                onClick={() => isopendeleteall(true)}
                variant="destructive"
                className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                ลบทั้งหมด
              </Button> */}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {loder ? (
              <div className="flex justify-center items-center gap-4 text-center py-8 text-zinc-400 text-sm"><Loader /> กำลังโหลดข้อมูลสินค้า...</div>
            ) : (
              product.map((items, index) => (
                <div key={index} className="group/item">
                  <div
                    className="flex justify-between items-center cursor-pointer px-5 py-3.5 hover:bg-zinc-50 transition-colors duration-150"
                  >
                    <p className={`flex flex-col text-wrap bg-gray-100 px-1 rounded-sm ${items.count != 0 ? 'text-green-500' : ''}`}>
                      <>
                        {items.nameEN}
                        ({items.nameTH})</>
                      <span className="hidden md:block text-yellow-500">Code: {items.code}</span>
                    </p>
                    <Badge variant="outline">{items.count} เศษ {items.scrap}</Badge>
                  </div>
                  {index !== product.length - 1 && <hr className="border-t border-zinc-100 mx-5" />}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SavePage() {
  return (
    <Suspense>
      <SavePageContent />
    </Suspense>
  )
}