"use client"
import { useParams, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Userdata } from '../types/product';

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [userdata, Setuserdata] = useState<Userdata | null>(null);

  useEffect(() => {
    if (!id) return
    Getuser();
  }, [id])

  const Getuser = async () => {
    if (!id) return;
    const req = await fetch(`/api/getuser/${id}`, {
      method: "GET",
    })
    const data = await req.json();
    Setuserdata(data.data)
  }

  return (
    <div>
      <div>
        {userdata && (
          <div>
            <p>{userdata.name}</p>
            <p>{userdata.createdAt}</p>
          </div>
         )}
      </div>
    </div>
  )
}

export default page