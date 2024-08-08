import React, { useState, useEffect } from 'react'
import {
  Tabs,
  Tab,
  Paper,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import Box from '@mui/material/Box'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import { Spinner } from 'flowbite-react'
import HistoryIcon from '@mui/icons-material/History'
import moment from 'moment'

const HistoryDialog = ({ open, onClose, history }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle>History</DialogTitle>
      <DialogContent>
        {history.length === 0 && (
          <Typography gutterBottom>No History</Typography>
        )}
        {history.map((entry, index) => (
          <Typography key={index} gutterBottom>
            {entry.logEntry}
          </Typography>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

const UserApprovalTable = ({ requests, onApprove, onReject, isPendingTab }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [selectedHistory, setSelectedHistory] = useState([])

  const handleHistoryClick = history => {
    setSelectedHistory(history)
    setHistoryDialogOpen(true)
  }

  const columns = [
    { field: 'inctureId', headerName: 'Incture ID', flex: 1, minWidth: 120 },
    { field: 'email', headerName: 'Email', flex: 1, minWidth: 180 },
    { field: 'talentName', headerName: 'Name', flex: 1, minWidth: 120 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,

      renderCell: params => (
        <Typography
          variant='body2'
          sx={{
            color:
              params.value === 'Approved'
                ? 'success.main'
                : params.value === 'Declined'
                ? 'error.main'
                : 'warning.main',
            fontWeight: 'medium',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'roles',
      headerName: 'Role(s)',
      flex: 1,
      minWidth: 150,
      renderCell: params => params.value.join(', '),
    },
    {
      field: 'latestLogEntry',
      headerName: 'History',
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Box display='flex' align='center'>
          <HistoryIcon
            style={{ cursor: 'pointer' }}
            onClick={() => handleHistoryClick(params.row.history)}
          />
        </Box>
      ),
    },
    isPendingTab && {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      minWidth: 200,
      renderCell: params => (
        <Box display='flex' flexDirection={isMobile ? 'column' : 'row'} gap={1}>
          <Button
            variant='contained'
            color='success'
            onClick={() => onApprove(params.row.id)}
            size='small'
            fullWidth={isMobile}
          >
            Approve
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={() => onReject(params.row.id)}
            size='small'
            fullWidth={isMobile}
          >
            Reject
          </Button>
        </Box>
      ),
    },
  ].filter(Boolean)

  return (
    <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
      <Box sx={{ height: 400, width: '100%', overflowX: 'auto' }}>
        <DataGrid
          rows={requests}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 25]}
          disableSelectionOnClick
          disableRowSelectionOnClick
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              lineHeight: 'normal',
              display: 'flex',
              alignItems: 'center',
              paddingTop: '8px',
              paddingBottom: '8px',
            },
          }}
        />
      </Box>
      <HistoryDialog
        open={historyDialogOpen}
        onClose={() => setHistoryDialogOpen(false)}
        history={selectedHistory}
      />
    </Paper>
  )
}

const Authorize = () => {
  const [requests, setRequests] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const API_URL = process.env.BASE_URL2
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/super/security/getAllRequests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        setLoading(false)
        throw new Error('Failed to fetch requests')
      }
      const data = await response.json()
      // Transform the data to match the expected format
      const transformedData = data.map(item => ({
        id: item.id,
        inctureId: item.inctureId,
        email: item.email,
        talentName: item.talentName,
        status: item.status,
        roles: item.roles,
        history: item.authenticationHistory,
      }))
      setRequests(transformedData)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching requests:', error)
    }
  }

  const handleApproveRequest = async authorizationId => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_URL}/super/security/approve?id=${authorizationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        setLoading(false)
        throw new Error('Failed to approve request')
      }

      const updatedUsers = requests.map(request =>
        request.id === authorizationId
          ? { ...request, status: 'Approved' }
          : request,
      )
      setRequests(updatedUsers)
      setLoading(false)
      setSnackbarMessage('User request approved successfully')
      setSnackbarOpen(true)
    } catch (error) {
      console.error('Error approving request:', error)
    }
  }

  const handleDeclineRequest = async authorizationId => {
    setLoading(true)
    try {
      const response = await fetch(
        `${API_URL}/super/security/decline?id=${authorizationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!response.ok) {
        setLoading(false)
        throw new Error('Failed to decline request')
      }

      const updatedUsers = requests.map(request =>
        request.id === authorizationId
          ? { ...request, status: 'Declined' }
          : request,
      )
      setRequests(updatedUsers)
      setSnackbarMessage('User request declined successfully')
      setSnackbarOpen(true)
      setLoading(false)
    } catch (error) {
      console.error('Error declining request:', error)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const filteredRequests = requests.filter(request => {
    if (tabValue === 0) return request.status === 'Pending'
    if (tabValue === 1) return request.status === 'Approved'
    return request.status === 'Declined'
  })

  return (
    <Box sx={{ p: 2 }}>
      <Grid container justifyContent='center'>
        <Grid item xs={12} md={10}>
          <Paper square>
            <Tabs
              value={tabValue}
              indicatorColor='primary'
              textColor='primary'
              onChange={handleTabChange}
              aria-label='request-approval-tabs'
              variant='fullWidth'
            >
              <Tab label='Pending' />
              <Tab label='Approved' />
              <Tab label='Declined' />
            </Tabs>
          </Paper>

          {!loading && (
            <Box mt={2}>
              <UserApprovalTable
                requests={filteredRequests}
                onApprove={handleApproveRequest}
                onReject={handleDeclineRequest}
                isPendingTab={tabValue === 0}
              />
            </Box>
          )}

          {loading && (
            <div className='w-full h-[400px] flex justify-center items-center'>
              <Spinner />
            </div>
          )}

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
    </Box>
  )
}

export default Authorize
