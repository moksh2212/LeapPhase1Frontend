import { Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import React from 'react'
import { useSelector } from 'react-redux'
import DashHome from './DashHome'
import Authorize from './UsersList/AuthorizationRequests'

const HomePage = () => {
  const { currentUser } = useSelector(state => state.user)

  return (
    <>
      {currentUser.roles.includes('SUPERADMIN') ? (
        <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='Home' key='1'>
              <DashHome />
            </TabPane>
            <TabPane tab='User Approval Requests' key='2'>
              <Authorize />
            </TabPane>
            {/* <TabPane tab='Interviewer Table' key='3'>
       <InterviewerTable />
       <Temp/>
     </TabPane> */}
          </Tabs>
        </div>
      ) : (
        <DashHome />
      )}
    </>
  )
}

export default HomePage
