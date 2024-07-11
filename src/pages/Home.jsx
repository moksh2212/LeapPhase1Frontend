import { Button } from 'flowbite-react'
import { FaArrowRight } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Home() {

  
  return (
    <>
      <div className='flex flex-col m-5 lg:flex-row' style={{ height: 'calc(100vh - 84px)' }}>
        <div className='flex flex-1 mt-2 items-center justify-center'>
          <img src='cover.svg' alt='Cover' />
        </div>
        <div className='flex flex-col items-center justify-center w-full gap-3 flex-1 my-auto'>
          <img
            className='mx-auto h-16 w-auto'
            src='https://incture.com/wp-content/uploads/2022/02/Incture-Logo-Blue-150x34-px.svg'
            alt='Incture Logo'
          />
          <h4 className='mt-4 text-center text-2xl text-gray-900'>
            Welcome to Incture&apos;s Campus Program Management
          </h4>

          <Link to={'/dashboard?tab=home'}>
            <Button outline pill color={'blue'} className='w-60 mt-3 hover:text-white'>
              <p className='text-lg'>Proceed</p>
              <FaArrowRight className='ml-1 my-auto' />
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
