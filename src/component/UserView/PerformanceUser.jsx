// src/PerformancePage.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Container, Grid, Typography, Paper, Avatar, Card, CardContent, CardHeader, Box } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Register the required components
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PerformancePage = () => {
  // Dummy data for the pie charts
  const data = {
    assessment: 75,
    assignment: 85,
    attendance: 90,
  };

  const pieData = {
    labels: ['Assessment', 'Assignment', 'Attendance'],
    datasets: [
      {
        label: 'Performance',
        data: [data.assessment, data.assignment, data.attendance],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const employee = {
    name: 'Moksh Thakran',
    position: 'Software Engineer',
    department: 'Development',
    image: '<img src="data:image/png;base64,rg+vXfzxmQx/4Pdl9POsyfTk0cPOniSaFvMXwQBHaPbk1pW18jIUdvj44A6dkZMj/hj/PvIjXuOmve2Bo4yYmYiNWJgxzpwORpT1xAtbaEGEYN6RHj3R1lMRSrOOZOlu/jWzZvtcua8jZRwhCFtF6I9f26BIWv2x8aung6CR/+CJUeW8I2pjJyvwhvA8ui0AahZyPH0N1phnUQ9S7SAsvQRj6m8vnKxWeeR8yGNzEcwzBn36kOgYeTig7Nj5HBscoLAOQxCDKJjA8hLA4bEQ/IxsRumVXqGSwr4UtTf8/Liiz47zhf0AAAAAASUVORK5CYII=" alt="image" iscopyblocked="false">', // Replace with actual image URL
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Card sx={{ mb: 5 }}>
        <CardHeader
          avatar={<Avatar alt={employee.name} src={employee.image} sx={{ width: 100, height: 100 }} />}
          title={<Typography variant="h5">{employee.name}</Typography>}
          subheader={
            <Typography variant="subtitle1" color="text.secondary">
              {employee.position}, {employee.department}
            </Typography>
          }
        />
      </Card>

      <Typography variant="h4" align="center" gutterBottom>
        Performance Overview
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Pie data={pieData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Average Assessment Score</Typography>
                <Typography variant="h4">{data.assessment}%</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Average Assignment Score</Typography>
                <Typography variant="h4">{data.assignment}%</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Attendance Score</Typography>
                <Typography variant="h4">{data.attendance}%</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PerformancePage;
