import React from 'react';
import { Tabs, Card } from 'antd';
import WeeklyCalendar from './WeeklyCalendar'
import MonthlyCalendar from './MonthlyCalendar'
const { TabPane } = Tabs;

const DetailedAttendanceView = () => {
  return (
    <div className='mt-4'>
      <Card title="Attendance view" bordered={false} style={{ width: '100%' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Weekly" key="1"><WeeklyCalendar/></TabPane>
          <TabPane tab="Monthly" key="2"><MonthlyCalendar/></TabPane>
        </Tabs> 
      </Card>
    </div>
  );
};

export default DetailedAttendanceView;

