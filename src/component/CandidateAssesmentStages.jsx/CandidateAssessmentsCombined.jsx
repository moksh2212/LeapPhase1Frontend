import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CandidatesAssesmentsStage1 from './AssessmentStage1';
import CandidatesAssesmentsStage2 from './AssessmentStage2';
import CandidatesAssesmentsStage3 from './AssessmentStage3';
import CandidatesAssesmentsStage4 from './AssessmentStage4';
import CandidatesAssesmentsStage5 from './AssessmentStage5';
import AssesmentFinalSelected from './AssesmentFinalSelected';

export const CandidateAssesmentsCombined = () => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="flex items-center justify-center mt-1 border">
        <Box sx={{ maxWidth: {  sm: 700 }, bgcolor: 'background.paper' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            className="mt-1 text-black"
          >
            <Tab label="Level 1" />
            <Tab label="Level 2" />
            <Tab label="Level 3" />
            <Tab label="Level 4" />
            <Tab label="Level 5" />
            <Tab label="Final Selected" />
          </Tabs>
        </Box>
      </div>
      {value === 0 && <CandidatesAssesmentsStage1 />}
      {value === 1 && <CandidatesAssesmentsStage2 />}
      {value === 2 && <CandidatesAssesmentsStage3 />}
      {value === 3 && <CandidatesAssesmentsStage4 />}
      {value === 4 && <CandidatesAssesmentsStage5 />}
      {value === 5 && <AssesmentFinalSelected />}
    </>
  );
};
