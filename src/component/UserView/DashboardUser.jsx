// Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid,
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import {
  Assignment,
  EventNote,
  TrendingUp,
  Work,
  DescriptionTwoTone,
} from '@mui/icons-material';
import { keyframes } from '@emotion/react';

const dashboardItems = [
  { title: 'Assignments', icon: Assignment, color: '#42a5f5', link: '/assignments' },
  { title: 'Attendance', icon: EventNote, color: '#ffb74d', link: '/attendance' },
  { title: 'Performance', icon: TrendingUp, color: '#ef5350', link: '/performance' },
  { title: 'Daily Work Tracker', icon: Work, color: '#ab47bc', link: '/daily-work-tracker' },
  { title: 'Skills', icon: DescriptionTwoTone, color: '#78909c', link: '/skills' },
];

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

function DashboardItem({ title, icon: Icon, color, link }) {
  return (
    <Link to={link} style={{ textDecoration: 'none', width: '100%' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          animation: `${fadeIn} 0.6s ease`,
          '&:hover': {
            transform: 'scale(1.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: '50%',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
          }}
        >
          <Icon sx={{ fontSize: 48, color: '#ffffff' }} />
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
    <Box
      sx={{
        background: 'linear-gradient(to right, #7F7FD5, #91EAE4)',
        minHeight: '100vh',
        py: 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg">
        {/* <Typography
          variant="h2"
          component="h1"
          align="center"
          gutterBottom
          sx={{
            mb: 6,
            color: '#ffffff',
            textShadow: '4px 4px 6px rgba(0, 0, 0, 0.6)',
            fontWeight: 'bold',
            animation: `${fadeIn} 1s ease`,
          }}
        >
          Student Dashboard
        </Typography> */}
        <Grid container spacing={4} justifyContent="center">
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
 