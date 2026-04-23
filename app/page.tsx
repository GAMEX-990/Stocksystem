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

export default function Home() {
  const [open, isopen] = useState(false);
  const [opendeleteall, isopendeleteall] = useState(false);
  const [openedit, isopenedit] = useState(false);
  const [loder, isloder] = useState(false);
  const [Product, SetProduct] = useState<ProductType[]>([]);
  // const [props,Setprops] = useState<ProductType | null>(null);
  // const router = useRouter();
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
    product_name: '',
    count: 0,
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
    try {
      const fetchproduct = await fetch(`/api/geteditproduct/${productid}`, {
        method: "GET",
      })
      const data = await fetchproduct.json();
      const ProductEdit = data.data
      if (fetchproduct.ok) {
        Setformdata({
          id: ProductEdit.id,
          product_name: ProductEdit.name,
          count: ProductEdit.count
        })
        toast.success(`กำลังแก้ไข ${ProductEdit.name}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(`เกิดข้อผิดพลาดฝั่ง client ${error}`)
    } finally {

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
      <div className="mt-10 justify-center flex flex-col px-4 space-y-4">
        <div className="flex justify-end">
          <Field orientation="horizontal">
            <Input className="w-50 text-white" autoFocus type="search" placeholder="ค้นหาสินค้า..." />
          </Field>
          <Button className="group" onClick={() => isopen(true)} variant="me">เพิ่มสินค้า <Plus className=" transition-all group-hover:rotate-90 duration-300" /></Button>
        </div>
        <Card size="sm" className="mx-auto w-full max-w-sm bg-green-500/20 text-white border border-green-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-bold"><Badge variant="secondary">รายชื่อของทั้งหมด</Badge></CardTitle>
              <Button onClick={() => isopendeleteall(true)} variant="destructive">ลบทั้งหมด</Button>
            </div>
            {/* <CardDescription>
              This card uses the small size variant.
            </CardDescription> */}
          </CardHeader>
          <CardContent>
            {Product.map((items, index) => (
              <div key={index}>
                <div onClick={() => { GetEditproduct(items.id), isopenedit(true) }} className="flex justify-between cursor-pointer mt-2">
                  <p>{items.name}</p>
                  <p>{items.count}</p>
                </div>
                <hr className="border border-white" />
              </div>
            ))}
          </CardContent>
          {/* <CardFooter>
            <Button variant="outline" size="sm" className="w-full">
              Action
            </Button>
          </CardFooter> */}
        </Card>
      </div>

      {/* Dialog เพิ่มรายการสินค้า */}
      <Dialog open={open} onOpenChange={isopen}>
        {/* <DialogTrigger asChild>
              </DialogTrigger> */}
        <DialogContent className="sm:max-w-sm bg-green-500/20 border border-green-600 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">เพิ่มรายการสินค้า</DialogTitle>
            {/* <DialogDescription>
                    Make changes to your profile here. Click save when you&apos;re
                    done.
                    </DialogDescription> */}
          </DialogHeader>
          <form onSubmit={submit}>
            <FieldGroup>
              <Field>
                <Label htmlFor="product_name">ชื่อสินค้า</Label>
                <Input id="product_name" type="text" name="product_name" />
              </Field>
              <Field>
                <Label htmlFor="count">จำนวน</Label>
                <Input id="count" type="number" name="count" />
              </Field>
            </FieldGroup>
            <div className="flex space-x-4 mt-4 justify-end">
              <Button variant="destructive" onClick={() => isopen(false)} >ยกเลิก</Button>
              <Button variant="me" type="submit">บันทึก</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* ลบ */}
      <Dialog open={opendeleteall} onOpenChange={isopendeleteall}>
        <DialogContent className="sm:max-w-sm bg-green-500/20 border border-green-600 text-white">
          <DialogHeader>
            <DialogTitle>
              <Badge className="text-lg font-bold w-fit h-fit" variant="destructive">ยืนยันการลบ</Badge>
            </DialogTitle>
          </DialogHeader>
          ลบแล้วไม่สามารถกู้คืนได้อีก
          <div className="flex justify-end space-x-4">
            <Button variant="destructive" onClick={() => isopendeleteall(false)} >ยกเลิก</Button>
            <Button onClick={() => deleteall()} variant="me" type="submit">ลบ</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* แก้ไขสินค้า */}
      <Dialog open={openedit} onOpenChange={isopenedit}>
        <DialogContent className="sm:max-w-sm bg-green-500/20 border border-green-600 text-white">
          <DialogHeader>
            <DialogTitle>
              <Badge className="text-lg font-bold w-fit h-fit" variant="secondary">แก้ไขสินค้า {formdata.product_name}</Badge>
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={EditProduct}>
            <FieldGroup>
              <Field>
                <Label>ชื่อสินค้า</Label>
                <Input id="product_name" type="text" name="product_name" value={formdata.product_name} onChange={onEdit} />
                <Label>จำนวนสินค้า</Label>
                <Input id="count" type="number" name="count" value={formdata.count} onChange={onEdit} />
              </Field>
            </FieldGroup>
            <div className="flex justify-end space-x-4">
              <Button variant="destructive" onClick={() => isopenedit(false)}>ยกเลิก</Button>
              <Button variant="me" type="submit">บันทึก</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
