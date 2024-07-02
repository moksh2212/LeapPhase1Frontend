import { Sidebar } from 'flowbite-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { IoIosClose } from 'react-icons/io'
import { useSelector } from 'react-redux'

export default function EmployeesSidebar({ setShowEmployeesSidebar }) {
  const [tab, setTab] = useState('')
  const {currentUser} = useSelector(state=>state.user);

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
          onClick={() => setShowEmployeesSidebar(false)}
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
            <Link to='/dashboard?tab=attendance'>
              <Sidebar.Item as={'div'} active={tab === 'attendance'}>
                Attendance
              </Sidebar.Item>
            </Link>
          
            <Link to='?tab=performance'>
              <Sidebar.Item as={'div'} active={tab === 'performance'}>
                Performance
              </Sidebar.Item>
            </Link>
            <Link to='?tab=talent'>
              <Sidebar.Item as={'div'} active={tab === 'talent'}>
                Talent
              </Sidebar.Item>
            </Link>
           
            <Link to='?tab=assignments'>
              <Sidebar.Item as={'div'} active={tab === 'assignments'}>
                Assignments
              </Sidebar.Item>
            </Link>
            <Link to='?tab=assessments'>
              <Sidebar.Item as={'div'} active={tab === 'assessments'}>
                Assessments
              </Sidebar.Item>
            </Link>
            <Link to='?tab=trainers'>
              <Sidebar.Item as={'div'} active={tab === 'trainers'}>
                Trainers
              </Sidebar.Item>
            </Link>
          
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}
