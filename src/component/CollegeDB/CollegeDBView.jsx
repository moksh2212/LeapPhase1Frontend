import { Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import React from 'react'
import CollegeTable from './CollegeDatabase'
import ArchiveTable from './ArchiveTable'

const CollegeDBView = () => {
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-between mt-2'>
        <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
          College and Contact
        </h2>
        
      </div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Home' key='1'>
          <CollegeTable />
        </TabPane>
        <TabPane tab='Archives' key='2'>
          <ArchiveTable/>
        </TabPane>
       
      </Tabs>
    </div>
  )
}

export default CollegeDBView