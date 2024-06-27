// src/AssignmentUser.js
import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  Button,
  Box,
  Badge,
  TextField,
  IconButton,
} from '@mui/material';
import { CloudDownload, CloudUpload, CheckCircleOutline, ErrorOutline } from '@mui/icons-material';
import FileBase from 'react-file-base64';

const assignments = [
  {
    id: 1,
    title: 'Assignment 1',
    dueDate: '2024-06-30',
    status: 'Checked',
    downloadLink: '#',
  },
  {
    id: 2,
    title: 'Assignment 2',
    dueDate: '2024-07-10',
    status: 'Not Checked',
    downloadLink: '#',
  },
];

const AssignmentUser = () => {
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const handleFileChange = (file, id) => {
    setSelectedFiles((prevState) => ({
      ...prevState,
      [id]: file.base64,
    }));
  };

  const handleFileUpload = (id) => {
    if (selectedFiles[id]) {
      setUploadedFiles((prevState) => ({
        ...prevState,
        [id]: selectedFiles[id],
      }));
      alert('File uploaded successfully!');
    } else {
      alert('Please select a file first.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Your Assignments
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Total Assignments: <Badge badgeContent={assignments.length} color="primary" />
      </Typography>
      <Grid container spacing={4}>
        {assignments.map((assignment) => (
          <Grid item xs={12} key={assignment.id}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6">{assignment.title}</Typography>
              <Typography variant="body1">Due Date: {assignment.dueDate}</Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudDownload />}
                  href={assignment.downloadLink}
                >
                  Download
                </Button>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={(file) => handleFileChange(file, assignment.id)}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<CloudUpload />}
                    onClick={() => handleFileUpload(assignment.id)}
                    sx={{ ml: 2 }}
                  >
                    Upload File
                  </Button>
                </Box>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  {uploadedFiles[assignment.id] ? 'File Uploaded' : 'No file uploaded'}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  Status: {assignment.status === 'Checked' ? (
                    <CheckCircleOutline color="success" />
                  ) : (
                    <ErrorOutline color="error" />
                  )}
                  {assignment.status}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AssignmentUser;
