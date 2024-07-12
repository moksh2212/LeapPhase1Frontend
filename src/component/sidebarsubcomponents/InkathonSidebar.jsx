import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

export default function InkathonSidebar({ setShowInkathonSidebar }) {
  const [tab, setTab] = useState('')
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  return (
    <div className='md:w-56'>
      <div className='flex justify-end bg-[#F9FAFB] h-[14px]'>
        <IoIosClose
          className='hover:cursor-pointer h-6 w-6 mb-0  hover:bg-gray-300'
          onClick={() => setShowInkathonSidebar(false)}
        />
      </div>
      <Sidebar
        aria-label='Sidebar with multi-level dropdown example'
        className='w-full md:w-56'
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item
              as={'div'}
              label={
                currentUser.roles.includes('ROLE_ADMIN') ? 'Admin' : 'User'
              }
              labelColor='dark'
            >
              {currentUser.talentName}
            </Sidebar.Item>
            <Link to='?tab=inkathon'>
              <Sidebar.Item as={'div'} active={tab === 'inkathon'}>
                Inkathon Database
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}
