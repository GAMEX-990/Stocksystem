"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { SubmitEventHandler, use, useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductType } from "./types/product";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const [open, isopen] = useState(false);
  const [opendeleteall, isopendeleteall] = useState(false);
  const [openedit, isopenedit] = useState(false);
  const [loder, isloder] = useState(false);
  const [opensavepage, isopensavepage] = useState(false);
  const [Product, SetProduct] = useState<ProductType[]>([]);
  // const [props,Setprops] = useState<ProductType | null>(null);
  const router = useRouter();
  useEffect(() => {
    Getproduct();
  }, [])

  const onEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    Setformdata((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const [formdata, Setformdata] = useState({
    id: 0,
    code: "",
    nameTH: "",
    nameEN: "",
    count: 0,
    scrap: 0,
  })

  const EditProduct: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form.entries());
    try {
      const req = await fetch(`/api/geteditproduct/${formdata.id}`, {
        method: "PATCH",
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      })
      const dataapi = await req.json();
      if (req.ok) {
        toast.success(`${dataapi.message}`)
        isopenedit(false)
        Getproduct();
      } else {
        toast.success(`${dataapi.message}`)
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาดฝั่ง client ${error}`)
    }
  }

  const Getproduct = async () => {
    try {
      const fetchproduct = await fetch(`/api/getproduct`)
      if (fetchproduct.status === 200) {
        const data = await fetchproduct.json();
        SetProduct(data.data);
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด${error}`)
    } finally {

    }
  }

  const GetEditproduct = async (productid: number) => {
    isloder(true);
    try {
      const fetchproduct = await fetch(`/api/geteditproduct/${productid}`, {
        method: "GET",
      })
      const data = await fetchproduct.json();
      const ProductEdit = data.data
      if (fetchproduct.ok) {
        Setformdata({
          id: ProductEdit.id,
          code: ProductEdit.code,
          count: ProductEdit.count,
          nameTH: ProductEdit.nameTH || '',
          nameEN: ProductEdit.nameEN || '',
          scrap: ProductEdit.scrap ?? 0
        })
        toast.success(`กำลังแก้ไข ${ProductEdit.nameEN}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาดฝั่ง client ${error}`)
    } finally {
      isloder(false)
    }
  }

  const deleteall = async () => {
    try {
      const fetchdeleteall = await fetch(`/api/delete`, {
        method: "DELETE",
      })
      if (fetchdeleteall.status === 200) {
        Getproduct();
        isopendeleteall(false);
        toast.success("ลบข้อมูลสำเร็จ!!");
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาด`);
    }
  }

  const submit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    isloder(true);
    const formdata = new FormData(e.currentTarget);
    const data = Object.fromEntries(formdata.entries());

    try {
      const req = await fetch(`/api/addproduct`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      })
      const dataproduct = await req.json();
      if (req.status === 200) {
        await isopen(false);
        await Getproduct();
        toast.success(dataproduct.message)
      } else {
        toast.message(dataproduct.message)
      }
    } catch (error) {
      toast.error(`${error}`)
    } finally {
      isloder(false)
    }
  }
  return (
    <div>
      {/* Container หลัก: ปรับพื้นหลังรอบ ๆ ให้คลีน และจัดสเปซให้สมดุล */}
      <div className="mt-10 justify-center flex flex-col px-4 max-w-2xl mx-auto space-y-6 antialiased text-zinc-800">

        {/* ส่วนค้นหาและปุ่มเพิ่มสินค้า: รองรับ Responsive บนมือถือจะเรียงลงมา บนจอใหญ่จะอยู่บรรทัดเดียวกัน */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <Field orientation="horizontal" className="w-full sm:w-auto">
            <Input
              className="w-full sm:w-64 bg-white border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 rounded-lg transition-all"
              autoFocus
              type="search"
              placeholder="ค้นหาสินค้า..."
            />
          </Field>

          <div className="flex gap-2">
            <Button
              className="group transition-all"
              onClick={() => isopen(true)}
              variant="outline"
            >
              เพิ่มสินค้า
              <Plus className="w-4 h-4 transition-all group-hover:rotate-90 duration-300" />
            </Button>
            <Button
              className="group transition-all"
              onClick={() => isopensavepage(true)}
              variant="outline"
            >
              save page
              {/* <Plus className="w-4 h-4 transition-all group-hover:rotate-90 duration-300" /> */}
            </Button>
          </div>

        </div>

        {/* ตัวการ์ดแสดงรายการ: ปรับเป็นสีขาวมินิมอล มีเงาบางๆ และขอบมนโค้งรับสายตา */}
        <Card size="sm" className="w-full bg-white text-zinc-900 border border-zinc-200 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="border-b border-zinc-100 bg-zinc-50/50 px-5 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-semibold text-lg tracking-tight">
                <Badge variant="secondary" className="bg-zinc-100 text-zinc-800 hover:bg-zinc-100 border-none font-medium text-sm px-2.5 py-0.5 rounded-md">
                  รายชื่อของทั้งหมด
                </Badge>
              </CardTitle>
              <Button
                onClick={() => isopendeleteall(true)}
                variant="destructive"
                className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
              >
                ลบทั้งหมด
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {Product.length === 0 ? (
              <div className="text-center py-8 text-zinc-400 text-sm">ไม่มีรายการสินค้า</div>
            ) : (
              Product.map((items, index) => (
                <div key={index} className="group/item">
                  <div
                    onClick={() => { GetEditproduct(items.id), isopenedit(true) }}
                    className="flex justify-between items-center cursor-pointer px-5 py-3.5 hover:bg-zinc-50 transition-colors duration-150"
                  >
                    <Badge variant="secondary">
                      {items.nameEN}
                      ({items.nameTH})
                    </Badge>
                    <Badge variant="outline">{items.count} เศษ {items.scrap}</Badge>
                  </div>
                  {index !== Product.length - 1 && <hr className="border-t border-zinc-100 mx-5" />}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog เพิ่มรายการสินค้า */}
      <Dialog open={open} onOpenChange={isopen}>
        <DialogContent className="sm:max-w-sm bg-white border border-zinc-200 shadow-xl rounded-xl text-zinc-950 p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-900">เพิ่มรายการสินค้า</DialogTitle>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <FieldGroup className="space-y-3">
              <Field className="flex flex-col gap-1.5">
                <Label htmlFor="product_name" className="text-sm font-medium text-zinc-600">ชื่อสินค้า (EN)</Label>
                <Input id="product_name_en" type="text" name="product_name_en" className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label htmlFor="product_name" className="text-sm font-medium text-zinc-600">ชื่อสินค้า (TH)</Label>
                <Input id="product_name_th" type="text" name="product_name_th" className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label htmlFor="code" className="text-sm font-medium text-zinc-600">รหัสสินค้า</Label>
                <Input id="code" type="text" name="code" className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label htmlFor="count" className="text-sm font-medium text-zinc-600">จำนวน</Label>
                <Input id="count" type="number" name="count" className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label htmlFor="scrap" className="text-sm font-medium text-zinc-600">เศษ</Label>
                <Input id="scrap" type="number" name="scrap" className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
            </FieldGroup>
            <div className="flex space-x-2 mt-6 justify-end">
              <Button variant="destructive" onClick={() => isopen(false)} className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none rounded-md px-4 py-2 text-sm font-medium transition-colors">ยกเลิก</Button>
              <Button type="submit">บันทึก</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog ยืนยันการลบ */}
      <Dialog open={opendeleteall} onOpenChange={isopendeleteall}>
        <DialogContent className="sm:max-w-sm bg-white border border-zinc-200 shadow-xl rounded-xl text-zinc-950 p-6">
          <DialogHeader className="mb-3">
            <DialogTitle>
              <Badge className="text-sm font-medium bg-red-50 text-red-600 border border-red-100 px-2.5 py-1 rounded-md" variant="destructive">
                ยืนยันการลบ
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <p className="text-zinc-500 text-sm my-2">ลบแล้วไม่สามารถกู้คืนได้อีก ยืนยันที่จะลบรายการทั้งหมดใช่หรือไม่?</p>
          <div className="flex justify-end space-x-2 mt-5">
            <Button variant="destructive" onClick={() => isopendeleteall(false)} className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none rounded-md px-4 py-2 text-sm font-medium transition-colors">ยกเลิก</Button>
            <Button onClick={() => deleteall()} variant="destructive" type="submit" className="bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-2 text-sm font-medium transition-colors">ลบ</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog แก้ไขสินค้า */}
      <Dialog open={openedit} onOpenChange={isopenedit}>
        <DialogContent className="sm:max-w-sm bg-white border border-zinc-200 shadow-xl rounded-xl text-zinc-950 p-6">
          <DialogHeader className="mb-4">
            <DialogTitle>
              <Badge className="text-sm font-medium bg-zinc-100 text-zinc-800 border-none px-2.5 py-1 rounded-md" variant="secondary">
                 {loder ? (
                  <div className="flex items-center">
                    <Spinner />แปปนึง....
                  </div>
                ) : (
                  <div>
                    แก้ไขสินค้า {formdata.nameEN}
                  </div>
                )}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={EditProduct} className="space-y-4">
            <FieldGroup className="space-y-3">
              <Field className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-600">ชื่อสินค้าEN</Label>
                <Input id="nameEN" type="text" name="nameEN" value={formdata.nameEN} onChange={onEdit} className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-600">ชื่อสินค้าTH</Label>
                <Input id="nameTH" type="text" name="nameTH" value={formdata.nameTH} onChange={onEdit} className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-600">จำนวนสินค้า</Label>
                <Input id="count" type="number" name="count" value={formdata.count} onChange={onEdit} className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
              <Field className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-zinc-600">เศษ</Label>
                <Input id="scrap" type="number" name="scrap" value={formdata.scrap} onChange={onEdit} className="bg-white border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900" />
              </Field>
            </FieldGroup>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="destructive" onClick={() => isopenedit(false)} className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 border-none rounded-md px-4 py-2 text-sm font-medium transition-colors">ยกเลิก</Button>
              <Button type="submit" className="bg-zinc-950 text-white hover:bg-zinc-800 rounded-md px-4 py-2 text-sm font-medium transition-colors">บันทึก</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={opensavepage} onOpenChange={isopensavepage}>
        <DialogContent>
          <form>
            <FieldGroup>
              <Field>
                <Label>ใส่ชื่อคนนับ</Label>
                <Input type="text" name="product_name" />
              </Field>
            </FieldGroup>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="destructive" onClick={() => isopensavepage(false)}>ยกเลิก</Button>
              <Button onClick={() => router.push(`/savepage`)} type="submit">บันทึก</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  );
}
