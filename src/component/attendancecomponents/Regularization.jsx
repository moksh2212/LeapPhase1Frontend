import React, { useState, useEffect } from 'react'
import { Tabs, Tab, Button, Grid, Typography, Paper, Snackbar, Alert, IconButton, Menu, MenuItem } from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useSelector } from 'react-redux'

const ActionsCell = ({ params, handleApprove, handleReject, isPendingTab }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleApproveClick = () => {
    handleApprove(params)
    handleClose()
  }

  const handleRejectClick = () => {
    handleReject(params)
    handleClose()
  }

  if (isPendingTab) {
    return (
      <div>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleApproveClick}>Approve</MenuItem>
          <MenuItem onClick={handleRejectClick}>Decline</MenuItem>
        </Menu>
      </div>
    )
  }
  return null
}

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

  const columns = [
    { field: 'talentId', headerName: 'Employee ID', flex: 1, sortable: false },
    {
      field: 'talentName',
      headerName: 'Employee Name',
      flex: 1,
      sortable: false,
    },
    { field: 'attendanceDate', headerName: 'Date', flex: 1, sortable: true },
    { field: 'reason', headerName: 'Reason', flex: 1, sortable: true },
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
      renderCell: params => (
        <ActionsCell
          params={params}
          handleApprove={handleApprove}
          handleReject={handleReject}
          isPendingTab={isPendingTab}
        />
      ),
    },
  ].filter(Boolean)

  const getRowId = row => row.regularizeId

  return (
    <div style={{ marginTop: '10px', padding: '10px' }}>
      <Typography variant='h5' gutterBottom>
        Regularization Requests
      </Typography>
      <div style={{ overflow: 'auto' }}>
        <DataGrid
          rows={requests}
          columns={columns}
          getRowId={getRowId}
          style={{ maxHeight: '100%', maxWidth: '100%', overflow: 'auto' }}
          pageSize={1}
          rowsPerPageOptions={[5, 10, 25]}
          pagination
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </div>
    </div>
  )
}

const Regularize = () => {
  const [regularizeRequests, setRegularizeRequests] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const API_URL = 'http://192.168.0.147:8080'
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
      console.error('Error approving regularization request:', error)
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
      setSnackbarMessage('Regularize request rejected successfully')
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
    <Grid container style={{ padding: '5px', width: '100%' }}>
      <Grid item xs={12} md={10}>
        {/* Tab View */}
        <div style={{ width: '100%', margin: 'auto', paddingLeft: '20px' }}>
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
        </div>

        {/* Tab Panels */}
        <Box mt={2}>
          <TabPanel value={tabValue} index={0}>
            <div style={{ height: '400px', width: '1200px', overflow: 'auto' }}>
              <RegularizeRequestTable
                requests={filteredRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
                isPendingTab={true}
              />
            </div>
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
