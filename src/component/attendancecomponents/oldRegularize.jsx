import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import Box from '@mui/material/Box';
import TablePagination from '@mui/material/TablePagination';

import {
  Button, Grid, Typography, Paper, Table, TableContainer, TableHead, TableRow,
  TableCell, TableBody, Snackbar, Alert
} from '@mui/material';

const RegularizeRequestTable = ({ requests, onApprove, onReject, isPendingTab}) => {
  const [selectedRequest] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleApprove = (request) => {
    if (request) {
      onApprove(request.regularizeId);
    }
  };
  
  const handleReject = (request) => {
    if (request) {
      onReject(request.regularizeId);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate the start and end indices for the current page
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedRequests = requests.slice(startIndex, endIndex);
  
  return (
    <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant="h5" gutterBottom>Regularization Requests</Typography>
      <TableContainer  style={{ maxHeight: 400 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle1">Employee ID</Typography></TableCell>
              <TableCell><Typography variant="subtitle1">Employee Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle1">Date</Typography></TableCell>
              <TableCell><Typography variant="subtitle1">Check-in</Typography></TableCell>
              <TableCell><Typography variant="subtitle1">Check-out</Typography></TableCell>
              <TableCell><Typography variant="subtitle1">Approval Manager</Typography></TableCell>
              {isPendingTab && <TableCell><Typography variant="subtitle1">Actions</Typography></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.regularizeId} >
                <TableCell>{request.talentId}</TableCell>
                <TableCell>{request.talentName}</TableCell>
                <TableCell>{request.attendanceDate}</TableCell>
                <TableCell>{request.checkin}</TableCell>
                <TableCell>{request.checkout}</TableCell>
                <TableCell>{request.approvalManager}</TableCell>
                {isPendingTab && (
                  <TableCell>
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleApprove(request)}
                      >
                        Approval
                      </Button>{" "}
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleReject(request)}
                      >
                        Decline
                      </Button>
                    </>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
 
const Regularize = () => {
  const [regularizeRequests, setRegularizeRequests] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tabValue, setTabValue] = useState(0); // State for managing active tab
  const API_URL=process.env.BASE_URL

  useEffect(() => {
    fetchRegularizeRequests();
  }, []);
 
  const fetchRegularizeRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/cpm/regularize/getAll`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch regularize requests: ${errorText}`);
      }
      const data = await response.json();
      setRegularizeRequests(data);
    } catch (error) {
      console.error('Error fetching regularize requests:', error);
    }
  };
 
  const handleApproveRequest = async (regularizeId) => {
    console.log("hello");
    try {
      const response = await fetch(`${API_URL}/cpm/regularize/approveRegularize/${regularizeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to approve regularize request: ${response.statusText}`);
      }
 
      const updatedRequests = regularizeRequests.map(request =>
        request.regularizeId === regularizeId ? { ...request, approvalStatus: 'Approved' } : request
      );
      setRegularizeRequests(updatedRequests);
      setSnackbarMessage('Regularization request approved successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error approving Regularization request:', error);
    }
  };
 
  const handleRejectRequest = async (regularizeId) => {
    try {
      const response = await fetch(`${API_URL}/cpm/regularize/declineRegularize/${regularizeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response text:', errorText);
        throw new Error(`Failed to reject regularize request: ${response.statusText}`);
      }
 
      const updatedRequests = regularizeRequests.map(request =>
        request.regularizeId === regularizeId ? { ...request, approvalStatus: 'Declined' } : request
      );
      setRegularizeRequests(updatedRequests);
      setSnackbarMessage('regularize request rejected successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error rejecting regularize request:', error);
    }
  };
 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Filter regularize requests to show only those with approvalStatus 'Pending'
  //const pendingRequests = regularizeRequests.filter(request => request.approvalStatus === 'Pending');

  // Filter regularize requests based on tabValue
  const filteredRequests = regularizeRequests.filter(request => {
    if (tabValue === 0) {
      return request.approvalStatus === 'Pending';
    } else if (tabValue === 1) {
      return request.approvalStatus === 'Approved';
    } else {
      return request.approvalStatus === 'Declined';
    }
  });

  return (
    <Grid container justifyContent="center" style={{ padding: '20px' }}>
      <Grid item xs={12} md={10}>
        {/* Tab View */}
        <Paper square>
          <Tabs
            value={tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleTabChange}
            aria-label="regularize-tabs"
          >
            <Tab label="Pending" />
            <Tab label="Approved" />
            <Tab label="Declined" />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <Box mt={2}>
          <TabPanel value={tabValue} index={0}>
            <RegularizeRequestTable
              requests={filteredRequests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              isPendingTab={true}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <RegularizeRequestTable
              requests={filteredRequests}
              isPendingTab={false}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <RegularizeRequestTable
              requests={filteredRequests}
              isPendingTab={false}
            />
          </TabPanel>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  );
};

// Function to render tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}


export default Regularize;
