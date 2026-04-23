"use client"
import React, { use } from 'react'

const page = ({params}: {params: Promise<{id: number}>}) => {
  const {id} = use(params)
  return (
    <div className='text-white'>page {id}</div>
  )
}

export default page