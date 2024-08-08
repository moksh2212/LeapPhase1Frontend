import { useState, useEffect, useMemo } from 'react'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import {
  Box,
  Button,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import CreateCAForm from './CreateCAForm'
import CloseIcon from '@mui/icons-material/Close'

const AssessmentTable = () => {
  const [assessments, setAssessments] = useState([])
  const [year, setYear] = useState('2024')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  })
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    assessmentId: null,
  })

  const [openCreateForm, setOpenCreateForm] = useState(false)

  const token = useSelector(state => state.user.token)

  const navigate = useNavigate()

  const baseUrl = process.env.BASE_URL

  console.log(isLoading)

  const fetchAssessments = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/getAllAssessmentByEkYear?ekYear=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const data = await response.json()
      setAssessments(data)
    } catch (error) {
      console.error('Error fetching assessments:', error)
      setSnackbar({
        open: true,
        message: 'Error fetching assessments',
        severity: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAssessments()
  }, [year])

  const handleYearChange = event => {
    setYear(event.target.value)
  }

  const handleCreateAssessment = async collegeId => {
    setOpenCreateForm(false)

    try {
      setIsLoading(true)
      const res = await fetch(
        `${baseUrl}/cpm/assessment/createAssessment?collegeId=${collegeId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (res.ok) {
        setSnackbar({
          open: true,
          message: 'New assessment created',
          severity: 'success',
        })

        fetchAssessments()
        setIsLoading(false)
      } else {
        throw new Error('Failed to create assessment')
      }
    } catch (error) {
      console.error('Error creating assessment:', error)
      setSnackbar({
        open: true,
        message: 'Error creating assessment',
        severity: 'error',
      })
      setIsLoading(false)
    }
  }
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setSnackbar({ open: false, message: '', severity: '' })
  }

  const handleViewCollegeDetails = (assessmentId, collegeName) => {
    navigate(
      `/dashboard?tab=college-process&id=${assessmentId}&collegeName=${encodeURIComponent(
        collegeName,
      )}`,
    )
  }

  const handleDeleteCollege = async assessmentId => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/deleteAssessmentById?assessmentId=${assessmentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        setAssessments(prevAssessments =>
          prevAssessments.filter(
            assessment => assessment.assessmentId !== assessmentId,
          ),
        )
        setSnackbar({
          message: 'Assessment deleted successfully!',
          open: true,
          severity: 'success',
        })
        setIsLoading(false)
        setError(null)
      } else {
        setIsLoading(false)
        throw new Error('Failed to delete assessment')
      }
    } catch (error) {
      console.error('Error deleting assessment:', error)
      setError(error.message)
      setSnackbar({
        message: 'Error deleting assessment',
        open: true,
        severity: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteCollege = assessmentId => {
    setDeleteDialog({ open: true, assessmentId })
  }

  const StatusCell = ({ value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <FiberManualRecordIcon
        sx={{
          color: value ? 'green' : 'orange',
          fontSize: '12px',
        }}
      />
      {value ? 'Completed' : 'Pending'}
    </Box>
  )

  const columns = useMemo(
    () => [
      {
        accessorKey: 'assessmentId',
        header: 'Assessment ID',
      },

      {
        accessorKey: 'collegeName',
        header: 'College Name',
      },
      {
        accessorKey: 'isLevelOneCompleted',
        header: 'Online Assessment',
        Cell: ({ cell }) => <StatusCell value={cell.getValue()} />,
      },
      {
        accessorKey: 'isLevelTwoCompleted',
        header: 'Design Round',
        Cell: ({ cell }) => <StatusCell value={cell.getValue()} />,
      },
      {
        accessorKey: 'isLevelThreeCompleted',
        header: 'Interview Round',
        Cell: ({ cell }) => <StatusCell value={cell.getValue()} />,
      },
      {
        accessorKey: 'isLevelOptionalCompleted',
        header: 'Optional Round',
        Cell: ({ cell }) => <StatusCell value={cell.getValue()} />,
      },
      {
        id: 'actions',
        header: 'View Details',
        Cell: ({ row }) => (
          <Button
            variant='contained'
            onClick={() =>
              handleViewCollegeDetails(
                row.original.assessmentId,
                row.original.collegeName,
              )
            }
            startIcon={<VisibilityIcon />}
          >
            View
          </Button>
        ),
      },
      {
        id: 'delete',
        header: 'Actions',
        size: 100,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              color='error'
              onClick={() => confirmDeleteCollege(row.original.assessmentId)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ),
        enableColumnFilter: false,
        enableSorting: false,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: assessments,
    enableColumnFilterModes: true,
    enableColumnOrdering: false,
    enableGrouping: false,
    enableColumnPinning: false,
    enableFacetedValues: true,
    enableRowSelection: false,
    state: {
      isLoading,
    },

    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    positionToolbarAlertBanner: 'bottom',
    initialState: { columnVisibility: { assessmentId: false } },
    renderTopToolbar: ({ table }) => (
      <Box
        sx={{
          display: 'flex',
          gap: '1rem',
          p: '0.5rem',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <MRT_GlobalFilterTextField table={table} />
          <MRT_ToggleFiltersButton table={table} />
          <h2 className='text-lg'>Year</h2>
          <Select value={year} onChange={handleYearChange} size='small'>
            <MenuItem value='2023'>2023</MenuItem>
            <MenuItem value='2024'>2024</MenuItem>
            <MenuItem value='2025'>2025</MenuItem>
          </Select>
        </Box>
        <Button
          variant='contained'
          onClick={() => {
            setOpenCreateForm(true)
          }}
          startIcon={<AddIcon />}
        >
          Create New Process
        </Button>
      </Box>
    ),
  })

  return (
    <>
      <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
        <div className='flex justify-between mt-2'>
          <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
            Recruitment Process
          </h2>
        </div>
        <MaterialReactTable table={table} />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          action={
            <IconButton
              size='small'
              aria-label='close'
              color='inherit'
              onClick={handleClose}
            >
              <CloseIcon fontSize='small' />
            </IconButton>
          }
        >
          <Alert
            severity={snackbar.severity}
            variant='filled'
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, assessmentId: null })}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this assessment?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() =>
                setDeleteDialog({ open: false, assessmentId: null })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                handleDeleteCollege(deleteDialog.assessmentId)
                setDeleteDialog({ open: false, assessmentId: null })
              }}
              color='error'
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {openCreateForm && (
          <CreateCAForm
            open={openCreateForm}
            setOpen={setOpenCreateForm}
            onSubmit={handleCreateAssessment}
          />
        )}
      </div>
    </>
  )
}

export default AssessmentTable
