import React from 'react';
import { Tabs, Card } from 'antd';
import EmployeewiseAssignment from './EmployeewiseAssignment';
import Assignment from './AssignmentList';

const { TabPane } = Tabs;

const FinalAssignmentview = () => {
  return (
    <div className='mt-4 ml-3'>
     
        <Tabs defaultActiveKey="1">
          <TabPane tab="Assigment view" key="1"><Assignment/></TabPane>
          <TabPane tab="Employee wise Assignment view" key="2"><EmployeewiseAssignment/></TabPane>
        </Tabs> 
     
    </div>
  );
};

export default FinalAssignmentview;

