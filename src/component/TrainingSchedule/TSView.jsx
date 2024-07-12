import { Tabs } from 'antd'

import TrainingScheduleTable from './TSTable'
import TrainingCalendarView from './TSCalendar'


const { TabPane } = Tabs

const TSView = () => {
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-between mt-2'>
        <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
          Training Schedules
        </h2>
        
      </div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Table View' key='1'>
          <TrainingScheduleTable />
        </TabPane>
        <TabPane tab='Calendar View' key='2'>
        <div style={{ width: '100%', height: '100%' }}>
            <TrainingCalendarView />
          </div>
        </TabPane>
        {/* <TabPane tab='Interviewer Table' key='3'>
          <InterviewerTable />
          <Temp/>
        </TabPane> */}
      </Tabs>
    </div>
  )
}

export default TSView
