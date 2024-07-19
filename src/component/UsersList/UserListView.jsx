import { Tabs } from 'antd'
import TabPane from 'antd/es/tabs/TabPane'
import Authorize from './AuthorizationRequests'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import UserTable from './UsersList'

const UserListView = () => {
   
  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <div className='flex justify-between mt-2'>
        <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>Users</h2>
      </div>
      <Tabs defaultActiveKey='1'>
        <TabPane tab='Users' key='1'>
          <UserTable />
        </TabPane>
        <TabPane tab='Approval requests' key='2'>
          <Authorize />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default UserListView
