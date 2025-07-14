import React from 'react'
import Navbar from './components/navbar'

const Page = () => {
  return (
    <div className='h-full w-full flex '>
        <div className='bg-red-500 w-[30%] h-screen'> <Navbar/></div>
        <div className='bg-blue-600 w-[70%] h-screen'>asd</div>
    </div>
  )
}

export default Page