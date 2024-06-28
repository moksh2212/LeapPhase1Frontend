import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CandidatesAssesmentsStage1 from './AssesmentStage1';
import CandidatesAssesmentsStage2 from './AssesmentStage2';
import CandidatesAssesmentsStage3 from './AssesmentStage3';
import CandidatesAssesmentsStage4 from './AssesmentStage4';
import CandidatesAssesmentsStage5 from './AssesmentStage5';
export const CandidateAssesmentsCombined = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        console.log(newValue)
      setValue(newValue);
    };
  return (
    <>
    <div className='flex items-center justify-center mt-1 border'>
    <Box sx={{ maxWidth: { xs: 320, sm: 480 }, bgcolor: 'background.paper' }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons={false}
        aria-label="scrollable prevent tabs example"
        className=' mt-1 text-black'
      >
        <Tab label="Level 1" />
        <Tab label="Level 2" />
        <Tab label="Level 3" />
        <Tab label="Level 4" />
        <Tab label="Level 5" />
        
      </Tabs>
    </Box>
    </div>
    {value===0 && <CandidatesAssesmentsStage1/>}
    {value===1 && <CandidatesAssesmentsStage2/>}
    {value===2 && <CandidatesAssesmentsStage3/>}
    {value===3 && <CandidatesAssesmentsStage4/>}
    {value===4 && <CandidatesAssesmentsStage5/>}
    </>
  )
}
