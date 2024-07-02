import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

export default function CollegeSidebar({ setShowCollegeSidebar }) {
  const [tab, setTab] = useState('')
  const {currentUser} = useSelector(state=>state.user)

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
          className='hover:cursor-pointer h-6 w-6 mb-0 hover:bg-gray-300'
          onClick={() => setShowCollegeSidebar(false)}
        />
      </div>
      <Sidebar
        aria-label='Sidebar with multi-level dropdown example'
        className='w-full md:w-56'
      >
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item as={'div'} label={currentUser.roles.includes('ROLE_ADMIN')? 'Admin':'User'} labelColor='dark'>
              {currentUser.talentName}
            </Sidebar.Item>
            <Link to='?tab=college-and-contact'>
              <Sidebar.Item as={'div'} active={tab === 'college-and-contact'}>
                College and contact
              </Sidebar.Item>
            </Link>
            <Link to='?tab=campus-calendar'>
              <Sidebar.Item as={'div'} active={tab === 'campus-calendar'}>
                Campus Calendar
              </Sidebar.Item>
            </Link>
            <Link to='?tab=candidates'>
              <Sidebar.Item as={'div'} active={tab === 'candidates'}>
                Candidates
              </Sidebar.Item>
            </Link>
            <Link to='?tab=candidate-assesment'>
              <Sidebar.Item as={'div'} active={tab === 'candidate-assesment'}>
                Assesments
              </Sidebar.Item>
            </Link>
            
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}
