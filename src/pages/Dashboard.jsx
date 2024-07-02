import { useLocation } from 'react-router-dom'
import CollegeDatabase from '../component/CollegeDatabase'
import CandidateDatabase from '../component/CandidateDatabase'
import TalentDatabase from '../component/TalentDatabase'
import DashSidebar from '../component/DashSidebar'
import Performance from '../component/Performance'
import Attendance1 from '../component/attendancecomponents/Attendance1'
import Regularization from '../component/attendancecomponents/Regularization'
import DetailedAttendanceView from '../component/attendancecomponents/DetailedAttendanceView'
import Leave from '../component/attendancecomponents/Leave'
import Assesments from '../component/Assesments/Assesments'
import AssesmentToogle from '../component/Assesments/AssesmentToogle'
import { useEffect, useState } from 'react'
import Header from '../component/Header'
import DashHome from '../component/DashHome'
import IndividualAssesments from '../component/Assesments/IndividualAssesments'
import AcademicInternsAttendance from '../component/AcademicInternsAttendance'
import IndividualToogleAssesments from '../component/Assesments/IndividuaTooglelAssesment';
import Alumni from '../component/Alumni';
import EmployeewiseAssignment from '../component/Assignments/EmployeewiseAssignment'
import FinalAssignmentview from '../component/Assignments/FinalAssignmentview'
import Perform from '../component/Perform'
import { CandidateAssesmentsCombined } from '../component/CandidateAssesmentStages.jsx/CandidateAssesmentsCombined'
import CampusCalendarView from '../component/CampusCalendar&InterviewScheduling/CampusCalendarView'
import InkathonDatabase from '../component/Inkathon/InkathonDatabase'
import CreateInkathon from '../component/Inkathon/CreateInkathon'
import TeamTabInkathon from '../component/Inkathon/TeamTabInkathon'

export default function Dashboard() {
  const location = useLocation()
  const [tab, setTab] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  return (
    <>
      <div
        className='flex md:flex-row overflow-auto w-full'
        style={{ height: 'calc(100vh - 64px)' }}
      >
        <div className='flex sticky left-0 top-0 right-0 bottom-0'>
          <DashSidebar />
        </div>

        <div className='overflow-auto w-full'>
          {tab === 'home' && <DashHome />}
          {tab === 'college-and-contact' && <CollegeDatabase />}
          {tab === 'candidates' && <CandidateDatabase />}
          {tab === 'assignments' && <FinalAssignmentview />}
          {tab === 'talent' && <TalentDatabase />}
          {tab === 'performance' && <Performance />}
          {tab === 'attendance' && <Attendance1 />}
          {tab === 'regularization' && <Regularization />}
          {tab === 'leave' && <Leave />}
          {tab === 'trainingAttendance' && <TrainingAttendance/>}
          {tab=== 'trainers' && <Trainers />}
          {tab === 'DetailedAttendanceView' && <DetailedAttendanceView />}
          {tab === 'assessments' && <Assesments />}
          {tab === 'IndividualAssesments' && <IndividualAssesments />}
          {tab === 'attendance-academic' && <AcademicInternsAttendance />}
          {tab === 'assessmenttoogle' && <AssesmentToogle />}
          {tab === 'individualtoogleassesments' && (<IndividualToogleAssesments />)}
          {tab === 'alumni' && <Alumni />}
          {tab === 'EmployeewiseAssignment' && <EmployeewiseAssignment />}
          {tab === 'Perform' && <Perform />}
          {tab === 'inkathon' && <InkathonDatabase />}
          {tab === 'createinkathon' && <CreateInkathon />}
          {tab === 'teamtabinkathon' && <TeamTabInkathon />}
          {tab==='CandidateAssesmentsCombined' && <CandidateAssesmentsCombined/>}
          {tab === 'campus-calendar' && <CampusCalendarView />}
        </div>
      </div>
    </>
  )
}
