import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@mui/material'
import Box from '@mui/material/Box'

import {
  Button,
  Grid,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Snackbar,
  Alert,
} from '@mui/material'
import { useSelector } from 'react-redux'

const LeaveRequestTable = ({ requests, onApprove, onReject, isPendingTab }) => {
  const [selectedRequest, setSelectedRequest] = useState(null)

  const handleRowClick = request => {
    setSelectedRequest(request)
  }

  const handleCloseModal = () => {
    setSelectedRequest(null)
  }

  const handleApprove = () => {
    onApprove(selectedRequest.leaveId)
    handleCloseModal()
  }

  const handleReject = () => {
    onReject(selectedRequest.leaveId)
    handleCloseModal()
  }

  return (
    <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant='h5' gutterBottom>
        Leave Requests
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant='subtitle1'>Employee ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Employee Name</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Reason Subject</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Leave From</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Leave Till</Typography>
              </TableCell>
              <TableCell>
                <Typography variant='subtitle1'>Approval Status</Typography>
              </TableCell>
              {isPendingTab && (
                <TableCell>
                  <Typography variant='subtitle1'>Actions</Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map(request => (
              <TableRow key={request.leaveId}>
                <TableCell>{request.talentId}</TableCell>
                <TableCell>{request.talentName}</TableCell>
                <TableCell>{request.subject}</TableCell>
                <TableCell>{request.startDate}</TableCell>
                <TableCell>{request.endDate}</TableCell>
                <TableCell>{request.approvalStatus}</TableCell>
                {isPendingTab && (
                  <TableCell>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => handleRowClick(request)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <LeaveRequestDetailModal
        request={selectedRequest}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </Paper>
  )
}

const LeaveRequestDetailModal = ({ request, onClose, onApprove, onReject }) => {
  const [loading, setLoading] = useState(false)

  const handleApprove = async () => {
    setLoading(true)
    await onApprove()
    setLoading(false)
  }

  const handleReject = async () => {
    setLoading(true)
    await onReject()
    setLoading(false)
  }

  return (
    <Dialog open={!!request} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle>Leave Request Details</DialogTitle>
      <DialogContent>
        {request && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1'>
                Employee ID: {request.talentId}
              </Typography>
              <Typography variant='subtitle1'>
                Employee Name: {request.talentName}
              </Typography>
              <Typography variant='subtitle1'>
                Subject: {request.subject}
              </Typography>
              <Typography variant='subtitle1'>
                Leave From: {request.startDate}
              </Typography>
              <Typography variant='subtitle1'>
                Leave Till: {request.endDate}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant='subtitle1' style={{ marginBottom: '8px' }}>
                Detailed Reason:
              </Typography>
              <DialogContentText style={{ whiteSpace: 'pre-line' }}>
                {request.description}
              </DialogContentText>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleApprove} color='primary' disabled={loading}>
          Approve
        </Button>
        <Button onClick={handleReject} color='secondary' disabled={loading}>
          Reject
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const Leave = () => {
  const [leaveRequests, setLeaveRequests] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [tabValue, setTabValue] = useState(0) // State for managing active tab
  const API_URL = 'http://192.168.0.141:8080'
  const token = useSelector(state => state.user.token)
  useEffect(() => {
    fetchLeaveRequests()
  }, [])

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/cpm/leaves/getAll`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch leave requests: ${errorText}`)
      }
      const data = await response.json()
      setLeaveRequests(data)
    } catch (error) {
      console.error('Error fetching leave requests:', error)
    }
  }

  const handleApproveRequest = async leaveId => {
    try {
      const response = await fetch(`${API_URL}/cpm/leaves/approve/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ status: 'Approved' }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        throw new Error(
          `Failed to approve leave request: ${response.statusText}`,
        )
      }

      const updatedRequests = leaveRequests.map(request =>
        request.leaveId === leaveId
          ? { ...request, approvalStatus: 'Approved' }
          : request,
      )
      setLeaveRequests(updatedRequests)
      setSnackbarMessage('Leave request approved successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error approving leave request:', error)
    }
  }

  const handleRejectRequest = async leaveId => {
    try {
      const response = await fetch(`${API_URL}/cpm/leaves/decline/${leaveId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ status: 'Declined' }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        throw new Error(
          `Failed to reject leave request: ${response.statusText}`,
        )
      }

      const updatedRequests = leaveRequests.map(request =>
        request.leaveId === leaveId
          ? { ...request, approvalStatus: 'Declined' }
          : request,
      )
      setLeaveRequests(updatedRequests)
      setSnackbarMessage('Leave request rejected successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error rejecting leave request:', error)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Filter leave requests to show only those with approvalStatus 'Pending'
  //const pendingRequests = leaveRequests.filter(request => request.approvalStatus === 'Pending');

  // Filter leave requests based on tabValue
  const filteredRequests = leaveRequests.filter(request => {
    if (tabValue === 0) {
      return request.approvalStatus === 'Pending'
    } else if (tabValue === 1) {
      return request.approvalStatus === 'Approved'
    } else {
      return request.approvalStatus === 'Declined'
    }
  })

  return (
    <Grid container justifyContent='center' style={{ padding: '20px' }}>
      <Grid item xs={12} md={10}>
        {/* Tab View */}
        <Paper square>
          <Tabs
            value={tabValue}
            indicatorColor='primary'
            textColor='primary'
            onChange={handleTabChange}
            aria-label='leave-tabs'
          >
            <Tab label='Pending' />
            <Tab label='Approved' />
            <Tab label='Declined' />
          </Tabs>
        </Paper>

        {/* Tab Panels */}
        <Box mt={2}>
          <TabPanel value={tabValue} index={0}>
            <LeaveRequestTable
              requests={filteredRequests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              isPendingTab={true}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <LeaveRequestTable
              requests={filteredRequests}
              isPendingTab={false}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <LeaveRequestTable
              requests={filteredRequests}
              isPendingTab={false}
            />
          </TabPanel>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </Grid>
  )
}

// Function to render tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
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
  )
}

export default Leave
