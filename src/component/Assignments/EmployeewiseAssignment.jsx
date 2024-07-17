import { useEffect, useMemo, useState } from 'react'
import { UpdateForm } from './EmployeewiseUpdateform'
//6709c6c9-0675-4495-802b-7687fc4badb7

//client secret value= 7bA8Q~yxVW4sreVp5qkT9ZF657W_Kw~Y94w4qcId
//client secret id = 348d9de9-2165-4eb6-bb21-8542ceeea2b0
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
  Snackbar,
  TextField,
  Tooltip,
  styled,
  Typography,
  linearProgressClasses,
  LinearProgress,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { CreateForm } from './CreateForm'
import { useSelector } from 'react-redux'


import { Link } from 'react-router-dom'

const EmployeewiseAssignment = () => {
  const [assnList, setAssnList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()

  const [assignmentIdToDelete, setAssignmentIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openCreateAssnForm, setOpenCreateAssnForm] = useState(false)
  const [openUpdateAssnForm, setOpenUpdateAssnForm] = useState(false)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const [rowToEdit, setRowToEdit] = useState(false)
const [feedbacksend, setfeedbacksend] = useState(true)
  const baseUrl =  process.env.BASE_URL2
  const token = useSelector(state => state.user.token)

console.log(feedbacksend)
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
    await deleteAssignment(assignmentIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete Assignment</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this assignment?</p>
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
      <DialogTitle>Delete Assignments</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected assignment(s)?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={handleDeleteSelectedRows} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  {console.log(rowToEdit)}
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/employee-assignments/getall`,{
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        const data = await response.json()
        setAssnList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

 

  const updateAssignment = async formData => {
    setOpenUpdateAssnForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/employee-assignments/update/${parseInt(
          rowToEdit.employeeAssignmentId,
        )}/${feedbacksend}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,

          },
          body: JSON.stringify(formData),
        },
      )

      if (response.ok) {
        const data = await response.json()

        setAssnList(prevAssignments =>
          prevAssignments.map(assignment =>
            assignment.employeeAssignmentId === data.employeeAssignmentId ? data : assignment,
          ),
        )
        setOpenSnackbar('Assignment updated successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error updating assignment:', error)
      setError(null)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteAssignment = async assignmentId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/employee-assignments/delete/${assignmentId}`,
        {
          method: 'DELETE',

          headers: {
            Authorization: `Basic ${token}`,
          },
        },
      )

      if (response.ok) {
        setAssnList(prevAssignments =>
          prevAssignments.filter(
            assignment => assignment.employeeAssignmentId !== assignmentId,
          ),
        )
        setOpenSnackbar('Assignment deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting assignment:', error)
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

    let count = 0
    try {
      for (const row of selectedRows) {
        await deleteAssignment(row.employeeAssignmentId)
        
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete assignments: ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} assignment(s) deleted successfully.`)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'employeeAssignmentId',
        header: 'Assignment ID',
        enableEditing: false,
        size: 150,
        hide: true,
      },
      {
        accessorKey: 'employeeEmail',
        header: 'Talent Email',
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
        size: 150,
      },
      {
        accessorKey: 'assignmentDuedate',
        header: 'Due Date',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'maxmarks',
        header: 'Max marks',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'assignmentFileName',
        header: 'Assignment File',
        enableEditing: true,
        size: 150,
        Cell: ({ row }) => (
          <Link
            to={row.original.assignmentFileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 font-medium underline hover:text-blue-700'
            style={{ cursor: 'pointer' }}
          >
            {row.original.assignmentFileName}
          </Link>
        ),
      },
      {
        accessorKey: 'assignmentStatus',
        header: 'Status',
        enableEditing: true,
        size: 150,
        Cell: ({ cell, row }) => {
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
              {/* Render an editable input */}
              {row.isEditMode ? (
                <input
                  type='text'
                  value={cell.getValue()}
                  onChange={e => cell.setValue(e.target.value)}
                />
              ) : (
                value
              )}
            </Box>
          )
        },
      },
      
      {
        accessorKey: 'employeeAssignmentScore',
        header: 'Score',
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
        accessorKey: 'employeeAssignmentFileUrl',
        header: 'Employee File',
        enableEditing: true,
        size: 150,
      }, 
      {
        accessorKey: 'employeeAssignmentFeedback',
        header: 'Feedback',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'evaluatorName',
        header: 'Evaluator Name',
        enableEditing: true,
        size: 150,
      },
    ],
    [],
  );
  

  const table = useMaterialReactTable({
    columns,
    data: assnList,
    enableRowSelection: true,
    initialState: { columnVisibility: { employeeAssignmentId: false } },
    isLoading,
    muiTableHeadCellProps:{
      align: 'center',
    },
    muiTableBodyCellProps:{
      align: 'center',
    },
    enableEditing: false,
    enableRowActions: true, // Enable the row action column
    onRowSelectionChange: setRowSelection,

    state: { rowSelection, isLoading },
    getRowId: row => row.collegeId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },

    renderRowActionMenuItems: ({ row, closeMenu}) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box className='flex items-center'>
          <Tooltip title='Edit' className='flex gap-1'>
            <Button
              onClick={() => {
                setOpenUpdateAssnForm(true)
                setRowToEdit(row.original)
                closeMenu()
              }}
            >
              <p className='text-[12px] font-semibold'>Edit</p>
            </Button>
          </Tooltip>
        </Box>
        <Box className='flex items-center'>
          <Tooltip title='Delete' className='flex gap-1'>
            <Button
              color='error'
              onClick={() => {
                setAssignmentIdToDelete(row.original.employeeAssignmentId)
                setOpenDeleteModal(true)
                closeMenu()
              }}
            >
              <p className='text-[12px] font-semibold'>Delete</p>
            </Button>
          </Tooltip>
        </Box>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map(row => row.original)
      return (
        <div className='flex gap-5'>
        

          <Button
            variant='contained'
            color='error'
            onClick={() => {
              setSelectedRows(selectedRows)
              setOpenDeleteRowsModal(true)
            }}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      )
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>Assignments</h2>

      <MaterialReactTable table={table} />
      {renderDeleteModal()}
      {renderDeleteRowsModal()}

      {openUpdateAssnForm && (
        
        <UpdateForm
          openModal={openUpdateAssnForm}
          setOpenModal={setOpenUpdateAssnForm}
          createAssignment={updateAssignment}
          sendFeedback={setfeedbacksend}
          assnForm={rowToEdit}
        />
      )}

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

export default EmployeewiseAssignment
