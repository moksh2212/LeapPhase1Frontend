import React, { useState, useEffect } from 'react'
import { Tabs, Tab } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'

import { Button, Grid, Typography, Paper, Snackbar, Alert } from '@mui/material'
import { useSelector } from 'react-redux'

const RegularizeRequestTable = ({
  requests,
  onApprove,
  onReject,
  isPendingTab,
}) => {
  const [selectedRequest] = useState(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleApprove = params => {
    const request = params.row
    console.log('handleApprove called with request:', request)
    if (request) {
      onApprove(request.regularizeId)
    }
  }

  const handleReject = params => {
    const request = params.row
    console.log('handleReject called with request:', request)
    if (request) {
      onReject(request.regularizeId)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Calculate the start and end indices for the current page
  const columns = [
    { field: 'talentId', headerName: 'Employee ID', flex: 1, sortable: false },
    {
      field: 'talentName',
      headerName: 'Employee Name',
      flex: 1,
      sortable: false,
    },
    { field: 'attendanceDate', headerName: 'Date', flex: 1, sortable: true },
    { field: 'checkin', headerName: 'Check-in', flex: 1, sortable: false },
    { field: 'checkout', headerName: 'Check-out', flex: 1, sortable: false },
    {
      field: 'approvalManager',
      headerName: 'Approval Manager',
      flex: 1,
      sortable: false,
    },
    isPendingTab && {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: params => {
        if (isPendingTab) {
          return (
            <div>
              <Button
                variant='contained'
                color='success'
                onClick={() => handleApprove(params)}
              >
                Approval
              </Button>{' '}
              <Button
                variant='contained'
                color='error'
                onClick={() => handleReject(params)}
              >
                Decline
              </Button>
            </div>
          )
        }
        return null
      },
    },
  ]

  const getRowId = row => row.regularizeId

  return (
    <Paper elevation={3} style={{ marginTop: '20px', padding: '20px' }}>
      <Typography variant='h5' gutterBottom>
        Regularization Requests
      </Typography>
      <div
        style={{ maxHeight: '1000px', overflowY: 'auto', overflowX: 'auto' }}
      >
        <DataGrid
          rows={requests}
          columns={columns}
          getRowId={getRowId}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </Paper>
  )
}

const Regularize = () => {
  const [regularizeRequests, setRegularizeRequests] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [tabValue, setTabValue] = useState(0) // State for managing active tab
  const API_URL = 'http://192.168.0.141:8080'
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    fetchRegularizeRequests()
  }, [])

  const fetchRegularizeRequests = async () => {
    try {
      const response = await fetch(`${API_URL}/cpm/regularize/getAll`, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to fetch regularize requests: ${errorText}`)
      }
      const data = await response.json()
      setRegularizeRequests(data)
    } catch (error) {
      console.error('Error fetching regularize requests:', error)
    }
  }

  const handleApproveRequest = async regularizeId => {
    console.log('hello')
    try {
      const response = await fetch(
        `${API_URL}/cpm/regularize/approveRegularize/${regularizeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        throw new Error(
          `Failed to approve regularize request: ${response.statusText}`,
        )
      }

      const updatedRequests = regularizeRequests.map(request =>
        request.regularizeId === regularizeId
          ? { ...request, approvalStatus: 'Approved' }
          : request,
      )
      setRegularizeRequests(updatedRequests)
      setSnackbarMessage('Regularization request approved successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error approving Regularization request:', error)
    }
  }

  const handleRejectRequest = async regularizeId => {
    try {
      const response = await fetch(
        `${API_URL}/cpm/regularize/declineRegularize/${regularizeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
        },
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response text:', errorText)
        throw new Error(
          `Failed to reject regularize request: ${response.statusText}`,
        )
      }

      const updatedRequests = regularizeRequests.map(request =>
        request.regularizeId === regularizeId
          ? { ...request, approvalStatus: 'Declined' }
          : request,
      )
      setRegularizeRequests(updatedRequests)
      setSnackbarMessage('regularize request rejected successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error rejecting regularize request:', error)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Filter regularize requests to show only those with approvalStatus 'Pending'
  //const pendingRequests = regularizeRequests.filter(request => request.approvalStatus === 'Pending');

  // Filter regularize requests based on tabValue
  const filteredRequests = regularizeRequests.filter(request => {
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
            aria-label='regularize-tabs'
          >
            <Tab label='Pending' />
            <Tab label='Approved' />
            <Tab label='Declined' />
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

export default Regularize
