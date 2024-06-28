import { Tabs } from 'antd'
import CampusCalendarTable from './CampusCalendarTable'
import InterviewerTable from './InterviewerTable'
import CollegeCalendarView from './CalendarView'


const { TabPane } = Tabs

const CampusCalendarView = () => {
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-between mt-2'>
        <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
          Campus Calendar
        </h2>
        
      </div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Table View' key='1'>
          <CampusCalendarTable />
        </TabPane>
        <TabPane tab='Calendar View' key='2'>
          {/* <CampusCalendar /> */}
          <CollegeCalendarView/>
        </TabPane>
        <TabPane tab='Interviewer Table' key='3'>
          <InterviewerTable />
          {/* <Temp/> */}
        </TabPane>
        {/* <TabPane tab='Interviewer Calendar' key='4'>
          <InterviewerCalendarView />
        </TabPane> */}
      </Tabs>
    </div>
  )
}

export default CampusCalendarView
