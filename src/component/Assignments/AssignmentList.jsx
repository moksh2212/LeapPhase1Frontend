import { useEffect, useMemo, useState } from 'react'

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
} from '@mui/material'
import { useSelector } from 'react-redux'
import { CreateForm } from './CreateForm'

import { UpdateForm } from './UpdateForm'
import { Link } from 'react-router-dom'

const Assignment = () => {
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
  const token = useSelector(state => state.user.token)

  const baseUrl =  process.env.BASE_URL2

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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/assignments/ReadAll`, {
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

  const createAssignment = async formData => {
    setOpenCreateAssnForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${baseUrl}/assignments/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setAssnList(prevAssignments => [...prevAssignments, data])
        setOpenSnackbar('Assignment created successfully!')
      }
    } catch (error) {
      console.error('Error creating Assignment:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateAssignment = async formData => {
    setOpenUpdateAssnForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/assignments/update/${parseInt(
          rowToEdit.assignmentId,
        )}`,
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
            assignment.assignmentId === data.assignmentId ? data : assignment,
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
        `${baseUrl}/assignments/Delete/${assignmentId}`,
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
            assignment => assignment.assignmentId !== assignmentId,
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
        await deleteAssignment(row.assignmentId)
        
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
        size: 150,
      },
      {
        accessorKey: 'assignmentDuedate',
        header: 'Due Date',
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
          to={ row.original.assignmentFileUrl}
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
        accessorKey: 'assignedTo',
        header: 'Assigned To',
        enableEditing: true,
        size: 150,
      },
      // {
      //   accessorKey: 'assignedTo',
      //   header: 'Assigned To',
      //   enableEditing: true,
      //   size: 150,
      // },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data: assnList,
    enableRowSelection: true,
    initialState: { columnVisibility: { assignmentId: false } },
    isLoading,
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
                setAssignmentIdToDelete(row.original.assignmentId)
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
            onClick={() => {
              setOpenCreateAssnForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            Create New Assignment
          </Button>

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

      {openCreateAssnForm && (
        <CreateForm
          openModal={openCreateAssnForm}
          setOpenModal={setOpenCreateAssnForm}
          createAssignment={createAssignment}
        />
      )}
      {openUpdateAssnForm && (
        <UpdateForm
          openModal={openUpdateAssnForm}
          setOpenModal={setOpenUpdateAssnForm}
          createAssignment={updateAssignment}
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

export default Assignment
