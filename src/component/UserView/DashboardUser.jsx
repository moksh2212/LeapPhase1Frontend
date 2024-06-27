// Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Box
} from '@mui/material';
import {
  Assignment,
  AssignmentTurnedIn,
  DescriptionTwoTone,
  EventNote,
  PhotoFilterTwoTone,
  TrendingUp,
  Work,
} from '@mui/icons-material';

const dashboardItems = [
    { title: 'Assignments', icon: Assignment, color: '#2196f3', link: '/assignments' },
    // { title: 'Assessments', icon: AssignmentTurnedIn, color: '#4caf50', link: '/assessments' },
    { title: 'Attendance', icon: EventNote, color: '#ff9800', link: '/attendance' },
    { title: 'Performance', icon: TrendingUp, color: '#f44336', link: '/performance' },
    { title: 'Daily Work Tracker', icon: Work, color: '#9c27b0', link: '/daily-work-tracker' },
    { title: 'Skills', icon: DescriptionTwoTone, color: '#434a4a', link: '/skills' },
  ];

  function DashboardItem({ title, icon: Icon, color, link }) {
    return (
      <Link to={link} style={{ textDecoration: 'none' }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            color: color,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: 5,
            },
          }}
        >
          <Box sx={{ p: 1 }}>
            <Icon sx={{ fontSize: 48, color: color }} />
          </Box>
          <Typography variant="h6" component="h3" align="center" sx={{ mt: 2, color: '#333333' }}>
            {title}
          </Typography>
        </Paper>
      </Link>
    );
  }

function DashboardUser() {
  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ mb: 4, color: '#2196f3' }}>
          Student Dashboard
        </Typography>
        <Grid container spacing={4}>
          {dashboardItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <DashboardItem {...item} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardUser;