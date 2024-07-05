import { useEffect, useState } from 'react'
import { FaHome, FaTrophy, FaUsers } from 'react-icons/fa'

import { FaDatabase, FaUserGraduate } from 'react-icons/fa6'

import CollegeSidebar from './sidebarsubcomponents/CollegeSidebar'
import EmployeesSidebar from './sidebarsubcomponents/EmployeesSidebar'
import InternSidebar from './sidebarsubcomponents/InternSidebar'
import InkathonSidebar from './sidebarsubcomponents/InkathonSidebar'
import { Link } from 'react-router-dom'

export default function DashSidebar() {
  const [tab, setTab] = useState('')
  const [showCollegeSidebar, setShowCollegeSidebar] = useState(false)
  const [showEmployeeSidebar, setShowEmployeeSidebar] = useState(false)
  const [showInternSidebar, setShowInternSidebar] = useState(false)
  const [showInkathonSidebar, setShowInkathonSidebar] = useState(false)

  const [homeActive, setHomeActive] = useState(true)
  const [collegeActive, setCollegeActive] = useState(false)
  const [employeeActive, setEmployeeActive] = useState(false)
  const [internActive, setInternActive] = useState(false)
  const [inkathonActive, setInkathonActive] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  return (
    <>
      <div className='flex flex-col w-[60px] sm:w-16 bg-gray-100 gap-4'>
        <div
          className={`${
            homeActive ? 'bg-gray-200' : 'null'
          }   flex flex-col items-center justify-center text-gray-500 p-1 hover:cursor-pointer h-16 mt-4`}
          onClick={() => {
            setShowCollegeSidebar(false)
            setShowInternSidebar(false)
            setShowEmployeeSidebar(false)
            setShowInkathonSidebar(false)
            setHomeActive(true)
            setCollegeActive(false)
            setEmployeeActive(false)
            setInternActive(false)
            setInkathonActive(false)
          }}
        >
          <Link to={'/dashboard?tab=home'}>
            <FaHome className='w-6 h-6 sm:h-8 sm:w-8 mx-auto' />
            <span className='text-xs font-semibold'>Home</span>
          </Link>
        </div>

        <div
          className={`${
            collegeActive ? 'bg-gray-200' : 'null'
          }   flex flex-col items-center justify-center p-1 text-gray-500 hover:cursor-pointer h-16`}
          onClick={() => {
            setShowCollegeSidebar(!showCollegeSidebar)
            setShowEmployeeSidebar(false)
            setShowInternSidebar(false)
            setShowInkathonSidebar(false)
            setCollegeActive(true)
            setHomeActive(false)
            setEmployeeActive(false)
            setInternActive(false)
            setInkathonActive(false)
          }}
        >
          <FaDatabase className='w-6 h-6 sm:h-8 sm:w-8 mx-auto' />
          <span className='text-xs font-semibold'>Colleges</span>
        </div>

        <div
          className={`${
            employeeActive ? 'bg-gray-200' : 'null'
          }   flex flex-col items-center justify-center p-1 text-gray-500 hover:cursor-pointer h-16`}
          onClick={() => {
            setShowEmployeeSidebar(!showEmployeeSidebar)
            setShowInternSidebar(false)
            setShowCollegeSidebar(false)
            setShowInkathonSidebar(false)
            setCollegeActive(false)
            setHomeActive(false)
            setEmployeeActive(true)
            setInternActive(false)
            setInkathonActive(false)
          }}
        >
          <FaUsers className=' w-6 h-6 sm:h-8 sm:w-8 mx-auto' />
          <span className='text-xs font-semibold'>Employees</span>
        </div>
        

        <div
          className={`${
            internActive ? 'bg-gray-200' : 'null'
          }   flex flex-col items-center justify-center p-1 text-gray-500 hover:cursor-pointer h-16`}
          onClick={() => {
            setShowInternSidebar(!showInternSidebar)
            setShowEmployeeSidebar(false)
            setShowCollegeSidebar(false)
            setShowInkathonSidebar(false)
            setCollegeActive(false)
            setHomeActive(false)
            setEmployeeActive(false)
            setInternActive(true)
            setInkathonActive(false)
          }}
        >
          <FaUserGraduate className='w-6 h-6 sm:h-8 sm:w-8 mx-auto' />
          <span className='text-xs font-semibold text-center'>
            Industrial Interns
          </span>
        </div>

        <div
          className={`${
            inkathonActive ? 'bg-gray-200' : 'null'
          }   flex flex-col items-center justify-center p-1 text-gray-500 hover:cursor-pointer h-16`}
          onClick={() => {
            setShowInkathonSidebar(!showInkathonSidebar)
            setShowEmployeeSidebar(false)
            setShowCollegeSidebar(false)
            setShowInternSidebar(false)
            setCollegeActive(false)
            setHomeActive(false)
            setEmployeeActive(false)
            setInternActive(false)
            setInkathonActive(true)
          }}
        >
          <FaTrophy className='w-6 h-6 sm:h-8 sm:w-8 mx-auto' />
          <span className='text-xs font-semibold text-center'>
            Inkathon
          </span>
        </div>
      </div>

      {showCollegeSidebar && (
        <CollegeSidebar setShowCollegeSidebar={setShowCollegeSidebar} />
      )}
      {showEmployeeSidebar && (
        <EmployeesSidebar setShowEmployeesSidebar={setShowEmployeeSidebar} />
      )}
      {showInternSidebar && (
        <InternSidebar setShowInternSidebar={setShowInternSidebar} />
      )}
      {showInkathonSidebar && (
        <InkathonSidebar setShowInkathonSidebar={setShowInkathonSidebar} />
      )}
    </>
  )
}
