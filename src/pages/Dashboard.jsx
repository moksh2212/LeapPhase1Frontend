import { useLocation } from 'react-router-dom'
import CandidateDatabase from '../component/CandidateDatabase'
import TalentDatabase from '../component/Talent/TalentDatabase'
import DashSidebar from '../component/DashSidebar'
import Performance from '../component/Performance'
import Attendance1 from '../component/attendancecomponents/Attendance1'
import Regularization from '../component/attendancecomponents/Regularization'
import DetailedAttendanceView from '../component/attendancecomponents/DetailedAttendanceView'
import Leave from '../component/attendancecomponents/Leave'
import Assesments from '../component/Assesments/Assesments'
import AssesmentToogle from '../component/Assesments/AssesmentToogle'
import { useEffect, useState } from 'react'
import IndividualAssesments from '../component/Assesments/IndividualAssesments'
import AcademicInternsAttendance from '../component/AcademicInternsAttendance'
import IndividualToogleAssesments from '../component/Assesments/IndividuaTooglelAssesment'
import Alumni from '../component/Alumni'
import EmployeewiseAssignment from '../component/Assignments/EmployeewiseAssignment'
import FinalAssignmentview from '../component/Assignments/FinalAssignmentview'
import CampusCalendarView from '../component/CampusCalendar&InterviewScheduling/CampusCalendarView'
import { CandidateAssesmentsCombined } from '../component/CandidateAssesmentStages.jsx/CandidateAssessmentsCombined'
import TrainingAttendance from '../component/attendancecomponents/TrainingAttendance'
import Trainers from '../component/Trainers'
import InkathonDatabase from '../component/Inkathon/InkathonDatabase'
import CreateInkathon from '../component/Inkathon/CreateInkathon'
import TeamTabInkathon from '../component/Inkathon/TeamTabInkathon'
import TSView from '../component/TrainingSchedule/TSView'
import HomePage from '../component/HomePage'
import CollegeDBView from '../component/CollegeDB/CollegeDBView'

import CombinedTalent from '../component/Assesments/CombinedTalent'
import AssesmentCollege from '../component/CandidateAssesmentStages.jsx/AssesmentCollege'
import CollegeTable from '../component/CollegeDB/CollegeDatabase'
import UserListView from '../component/UsersList/UserListView'
import DashHome from '../component/DashHome'
import { useSelector } from 'react-redux'
export default function Dashboard() {
  const location = useLocation()
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
          {tab === 'college-and-contact' && <CollegeDBView />}
          {tab === 'candidates' && <CandidateDatabase />}
          {tab === 'assignments' && <FinalAssignmentview />}
          {tab === 'talent' && <TalentDatabase />}
          {tab === 'performance' && <Performance />}
          {tab === 'attendance' && <Attendance1 />}
          {tab === 'regularization' && <Regularization />}
          {tab === 'leave' && <Leave />}
          {tab === 'trainingAttendance' && <TrainingAttendance />}
          {tab === 'trainers' && <Trainers />}
          {tab === 'DetailedAttendanceView' && <DetailedAttendanceView />}
          {tab === 'assessments' && <Assesments />}
          {tab === 'IndividualAssesments' && <IndividualAssesments />}
          {tab === 'attendance-academic' && <AcademicInternsAttendance />}
          {tab === 'assessmenttoogle' && <AssesmentToogle />}
          {tab === 'individualtoogleassesments' && (
            <IndividualToogleAssesments />
          )}
          {tab === 'alumni' && <Alumni />}
          {tab === 'EmployeewiseAssignment' && <EmployeewiseAssignment />}
          {tab === 'inkathon' && <InkathonDatabase />}
          {tab === 'createinkathon' && <CreateInkathon />}
          {tab === 'teamtabinkathon' && <TeamTabInkathon />}
          {tab === 'CandidateAssesmentsCombined' && (
            <CandidateAssesmentsCombined />
          )}
          {tab === 'campus-calendar' && <CampusCalendarView />}
          {tab === 'candidate-assesment' && <CandidateAssesmentsCombined />}
          {tab === 'training' && <TSView />}
          {tab === 'candidate-assessment' && <CandidateAssesmentsCombined />}
          {tab === 'CombinedTalent' && <CombinedTalent />}
          {tab === 'AssesmentCollege' && <AssesmentCollege />}

          {currentUser.roles.includes('SUPERADMIN') && tab==='users' && <UserListView/>}
        </div>
      </div>
    </>
  )
}
