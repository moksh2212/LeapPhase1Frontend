import { useEffect, useMemo, useState } from 'react'

import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Snackbar,
  Tooltip,
  Typography,
  linearProgressClasses,
  styled,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { Pending } from '@mui/icons-material'

const CandidateTable = () => {
  const [collegeList, setCollegeList] = useState([])
  const [assnList, setAssnList] = useState([
    {
      assignmentId: 1,
      assignmentWeek: 1,
      assignmentName: 'Introduction to JavaScript',
      assignmentTechnology: 'Java',
      assignmentDuedate: '2024-05-15',
      assignmenSubmissiondate: '2024-05-14',
      assignmentStatus: 'Turned in',
      assignmentScore: 90,
      assignmentFile: 'javascript_assignment.js',
    },
    {
      assignmentId: 2,
      assignmentWeek: 1,
      assignmentName: 'HTML Basics',
      assignmentTechnology: 'React',
      assignmentDuedate: '2024-05-17',
      assignmenSubmissiondate: '2024-05-16',
      assignmentStatus: 'Pending',
      assignmentScore: 85,
      assignmentFile: 'html_assignment.html',
    },
    {
      assignmentId: 3,
      assignmentWeek: 2,
      assignmentName: 'CSS Styling',
      assignmentTechnology: 'UI5',
      assignmentDuedate: '2024-05-22',
      assignmenSubmissiondate: '2024-05-23',
      assignmentStatus: 'Turned in late',
      assignmentScore: 88,
      assignmentFile: 'css_assignment.css',
    },
    {
      assignmentId: 4,
      assignmentWeek: 2,
      assignmentName: 'React Component Basics',
      assignmentTechnology: 'Integration',
      assignmentDuedate: '2024-05-24',
      assignmenSubmissiondate: '2024-05-23',
      assignmentStatus: 'Pending',
      assignmentScore: 32,
      assignmentFile: 'react_assignment.js',
    },
    {
      assignmentId: 5,
      assignmentWeek: 3,
      assignmentName: 'Node.js Basics',
      assignmentTechnology: 'Java',
      assignmentDuedate: '2024-05-29',
      assignmenSubmissiondate: '2024-05-28',
      assignmentStatus: 'Turned in',
      assignmentScore: 65,
      assignmentFile: 'nodejs_assignment.js',
    },
    {
      assignmentId: 6,
      assignmentWeek: 3,
      assignmentName: 'Express Routing',
      assignmentTechnology: 'React',
      assignmentDuedate: '2024-05-31',
      assignmenSubmissiondate: '2024-05-30',
      assignmentStatus: 'Pending',
      assignmentScore: 89,
      assignmentFile: 'express_assignment.js',
    },
    {
      assignmentId: 7,
      assignmentWeek: 4,
      assignmentName: 'MongoDB Basics',
      assignmentTechnology: 'UI5',
      assignmentDuedate: '2024-06-05',
      assignmenSubmissiondate: '2024-06-04',
      assignmentStatus: 'Pending',
      assignmentScore: 91,
      assignmentFile: 'mongodb_assignment.js',
    },
    {
      assignmentId: 8,
      assignmentWeek: 4,
      assignmentName: 'Authentication with Passport.js',
      assignmentTechnology: 'Java',
      assignmentDuedate: '2024-06-07',
      assignmenSubmissiondate: '2024-06-06',
      assignmentStatus: 'Turned in',
      assignmentScore: 90,
      assignmentFile: 'passport_assignment.js',
    },
    {
      assignmentId: 9,
      assignmentWeek: 5,
      assignmentName: 'GraphQL Basics',
      assignmentTechnology: 'Integration',
      assignmentDuedate: '2024-06-12',
      assignmenSubmissiondate: '2024-06-13',
      assignmentStatus: 'Pending',
      assignmentScore: 88,
      assignmentFile: 'graphql_assignment.js',
    },
    {
      assignmentId: 10,
      assignmentWeek: 5,
      assignmentName: 'Apollo Client Setup',
      assignmentTechnology: 'React',
      assignmentDuedate: '2024-06-14',
      assignmenSubmissiondate: '2024-06-13',
      assignmentStatus: 'Turned in late',
      assignmentScore: 86,
      assignmentFile: 'apollo_client_assignment.js',
    },
  ])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()

  const [collegeIdToDelete, setCollegeIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const selectStatus = ['Pending', 'Turned in', 'Turned in Late']
  const selectTechnology = ['Java', 'React', 'UI5', 'Integration']

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }

  const handleDelete = async () => {
    await deleteCollege(collegeIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete College</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this college?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        <Button onClick={handleDelete} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const renderDeleteRowsModal = () => (
    <Dialog
      open={openDeleteRowsModal}
      onClose={() => setOpenDeleteRowsModal(false)}
    >
      <DialogTitle>Delete Colleges</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected colleges?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={handleDeleteSelectedRows} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('http://localhost:3057/admin/viewData')
        const data = await response.json()
        setCollegeList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const createCollege = async newCollege => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(
        'http://localhost:3057/admin/insertCollegeData',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCollege),
        },
      )
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setCollegeList(prevColleges => [...prevColleges, data])
        setOpenSnackbar('College added successfully!')
      }
    } catch (error) {
      console.error('Error creating college:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCollege = async collegeToUpdate => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `http://localhost:3057/admin/updateData/${parseInt(
          collegeToUpdate.collegeId,
        )}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(collegeToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()

        setCollegeList(prevColleges =>
          prevColleges.map(college =>
            college.collegeId === data.collegeId ? data : college,
          ),
        )
        setOpenSnackbar('College updated successfully!')
        console.log('khul gayaa sncakbar??')
        setError(null)
      }
    } catch (error) {
      console.error('Error updating college:', error)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCollege = async collegeId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `http://localhost:3057/admin/deleteData/${collegeId}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        setCollegeList(prevColleges =>
          prevColleges.filter(college => college.collegeId !== collegeId),
        )
        setOpenSnackbar('College deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting college:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSelectedRows = async () => {
    setOpenSnackbar(null)
    setError(null)
    setIsLoading(true)
    setOpenDeleteRowsModal(false)

    try {
      for (const row of selectedRows) {
        console.log(row)
        await deleteCollege(row.collegeId)
      }
    } catch (error) {
      setError()
      setError(`Failed to delete colleges: ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`Successfully deleted colleges`)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'assignmentId',
        header: 'Assignment ID',
        enableEditing: false,
        size: 150,
        hide: true,
      },
      {
        accessorKey: 'assignmentWeek',
        header: 'Week',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'assignmentName',
        header: 'Assignment Name',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'assignmentTechnology',
        header: 'Assignment Technology',
        enableEditing: true,
        editVariant: 'select',
        editSelectOptions: selectTechnology,
        size: 150,
      },
      {
        accessorKey: 'assignmentDuedate',
        header: 'Due Date',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'assignmenSubmissiondate',
        header: 'Submission Date',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'assignmentStatus',
        header: 'Assignment Status',
        editVariant: 'select',
        editSelectOptions: selectStatus,
        enableEditing: true,
        size: 150,

        Cell: ({ cell }) => {
          let cellStyle = {}
          let value = cell.getValue()

          switch (value) {
            case 'Pending':
              cellStyle = { backgroundColor: 'lightgray', padding: '8px' }
              break
            case 'Turned in late':
              cellStyle = {
                backgroundColor: 'red',
                color: 'white',
                padding: '8px',
              }
              break
            case 'Turned in':
              cellStyle = {
                backgroundColor: 'green',
                color: 'white',
                padding: '8px',
              }
              break
            default:
              cellStyle = {
                backgroundColor: 'red',
                color: 'white',
                padding: '8px',
              }
          }

          return (
            <Box
              className='flex items-center justify-center'
              component='span'
              style={cellStyle}
              sx={{
                borderRadius: '10rem',
                width: '100%',
                maxWidth: '16ch',
                p: '0.25rem',
                alignContent: 'center',
                alignItems: 'center',
              }}
            >
              {value}
            </Box>
          )
        },
      },
      {
        accessorKey: 'assignmentScore',
        header: 'Assignment Score',
        enableEditing: true,
        size: 150,

        Cell: ({ cell }) => {
          let cellStyle = {}
          let value = parseInt(cell.getValue())

          const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
            height: 10,
            borderRadius: 5,
            [`&.${linearProgressClasses.colorPrimary}`]: {
              backgroundColor:
                theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
            },
            [`& .${linearProgressClasses.bar}`]: {
              borderRadius: 5,
              backgroundColor: cellStyle.backgroundColor,
            },
          }))

          if (value < 40) {
            cellStyle = {
              backgroundColor: 'red',
              color: 'white',
            }
          } else if (value < 70) {
            cellStyle = {
              backgroundColor: 'orange',
              color: 'white',
            }
          } else {
            cellStyle = {
              backgroundColor: 'green',
              color: 'white',
            }
          }

          return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: '100%', mr: 1 }}>
                <BorderLinearProgress variant='determinate' value={value} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant='body2' color='text.secondary'>
                  {value}
                </Typography>
              </Box>
            </Box>
          )
        },
      },
      {
        accessorKey: 'assignmentFile',
        header: 'Assignment File',
        enableEditing: true,
        size: 150,
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: assnList,
    enableRowSelection: true,
    initialState: { columnVisibility: { assignmentId: false } },
    isLoading,
    createDisplayMode: 'row',
    editDisplayMode: 'row',
    enableEditing: true,
    onRowSelectionChange: setRowSelection,

    state: { rowSelection },
    getRowId: row => row.collegeId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),

    onCreatingRowSave: async ({ values, table }) => {
      setValidationErrors({})
      await createCollege(values)
      table.setCreatingRow(null)
    },

    onEditingRowCancel: () => setValidationErrors({}),

    onEditingRowSave: async ({ values, table }) => {
      setValidationErrors({})

      await updateCollege(values)
      table.setEditingRow(null)
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
          Create New College
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant='text' table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
          Edit Assignment Details
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant='text' table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title='Edit'>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton
            color='error'
            onClick={() => {
              setCollegeIdToDelete(row.original.collegeId)
              setOpenDeleteModal(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {},
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>Assignments</h2>

      <MaterialReactTable
        table={table}
        updateCollege={updateCollege}
        createCollege={createCollege}
      />
      {renderDeleteModal()}
      {renderDeleteRowsModal()}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity='success'
          variant='filled'
          sx={{ width: '100%' }}
        >
          {openSnackbar}
        </Alert>
      </Snackbar>

      <Snackbar
        open={error}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity='error'
          variant='filled'
          color='error'
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default CandidateTable
