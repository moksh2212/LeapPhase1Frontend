// src/PerformancePage.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Container, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import axios from 'axios';
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PerformancePage = () => {
  const token = useSelector(state => state.user.token);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const { currentUser } = useSelector(state => state.user);
  
  useEffect(() => {
    // Fetch performance data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.147:8080/cpm/performance/getPerformanceById?talentId=${currentUser.talentId}`, {
          headers: {
            Authorization: `Basic ${token}`
          }
        });
        setData(response.data);
      } catch (error) {
        console.error('Error fetching performance data:', error);
        setError('Error fetching performance data');
        setOpen(true);
      }
    };

    fetchData();
  }, [token, currentUser]);

  const handleClose = () => {
    setOpen(false);
  };

  const pieData = data ? {
    labels: ['Assessment', 'Assignment', 'Attendance'],
    datasets: [
      {
        label: 'Performance',
        data: [data.assessmentScore, data.assignmentScore, data.averageAttendance],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  } : null;

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: '#12C2E9' }}>
        Performance Overview
      </Typography>

      {data && (
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Pie data={pieData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Average Assessment Score</Typography>
                  <Typography variant="h4">{data.assessmentScore}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Average Assignment Score</Typography>
                  <Typography variant="h4">{data.assignmentScore}%</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Attendance Score</Typography>
                  <Typography variant="h4">{data.averageAttendance}%</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}

      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity="error" variant='filled' sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PerformancePage;
 