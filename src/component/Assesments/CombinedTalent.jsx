import React from 'react';
import { Tabs } from 'antd';
import AssesmentToogle from './AssesmentToogle';
import TalentAssessment from './Assesments';

const CombinedTalent = () => {

  const items = [
    {
      key: '1',
      label: 'Talent wise view',
      children: <TalentAssessment />,
    },
    {
      key: '2',
      label: 'Assessment wise view',
      children: <AssesmentToogle />,
    }
  ];

  return <Tabs defaultActiveKey="1" items={items}       style={{ marginTop: '20px', marginLeft: '20px' }} 
/>;
};

export default CombinedTalent;

