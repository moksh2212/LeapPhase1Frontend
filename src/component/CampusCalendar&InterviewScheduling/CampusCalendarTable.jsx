import { useEffect, useMemo, useState } from 'react'

import { MaterialReactTable, useMaterialReactTable } from 'material-react-table'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Tooltip,
} from '@mui/material'
import { CreateScheduleForm } from './CreateScheduleForm'
import { UpdateScheduleForm } from './UpdateScheduleForm'
import { useSelector } from 'react-redux'

//Module completed testing done

const CampusCalendarTable = () => {
 
  const [scheduleList, setScheduleList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()
  const [scheduleIdToDelete, setScheduleIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const [openCreateForm, setOpenCreateForm] = useState(false)
  const [openUpdateForm, setOpenUpdateForm] = useState(false)
  const [scheduleToUpdate, setScheduleToUpdate] = useState({})

  const token = useSelector(state=>state.user.token)

  const baseUrl = process.env.BASE_URL
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
    await deleteSchedule(scheduleIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete Schedule</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Schedule?</p>
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
      <DialogTitle>Delete Schedules</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected schedule(s)?</p>
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
    setTimeout(() => {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`${baseUrl}/api/admin/interviewschedule/read`,{
            headers:
            {
              Authorization: `Bearer ${token}`,
            }
          })
          if (response.ok) {
            const data = await response.json()
            setScheduleList(data)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }, 1000)
  }, [])

  const handleCreate = async newSchedule => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    setOpenCreateForm(false)
   
    try {
      const existingSchedule = scheduleList.find(
        schedule => schedule.collegeName.toLowerCase() === newSchedule.collegeTPO.collegeName.toLowerCase()
      );
    
      if (existingSchedule) {
        setError(`Schedule for ${newSchedule.collegeTPO.collegeName} already exists.`);
        setIsLoading(false);
        return;
      }
      
      const response = await fetch(`${baseUrl}/api/admin/interviewschedule/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSchedule),
      })
      if (response.ok) {
        window.location.reload()
        setError(null)
        const data = await response.json()
        setValidationErrors({})
        setScheduleList(prevSchedules => [...prevSchedules, data])
        setOpenSnackbar('Schedule added successfully!')
      }
    } catch (error) {
      console.error('Error creating schedule:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateSchedule = async (scheduleToUpdate, scheduleId) => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    setOpenUpdateForm(false)
    console.log(scheduleToUpdate)
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/interviewschedule/updateScheduling/${scheduleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(scheduleToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setValidationErrors({})
        setScheduleList(prevSchedules =>
          prevSchedules.map(schedule =>
            schedule.scheduleId === data.scheduleId ? data : schedule,
          ),
        )

        setOpenSnackbar('Schedule updated successfully!')
        setError(null)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating schedule:', error)
      console.error('Error updating schedulellllll')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteSchedule = async scheduleId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/interviewschedule/delete/${scheduleId}`,
        {
          method: 'DELETE',
          headers:{
            Authorization: `Bearer ${token}`,
          }
        },
      )

      if (response.ok) {
        setScheduleList(prevSchedules =>
          prevSchedules.filter(schedule => schedule.scheduleId !== scheduleId),
        )
        setOpenSnackbar('Schedule deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting schedule:', error)
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
        await deleteSchedule(row.scheduleId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete schedule(s): ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} schedule(s) deleted successfully.`)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'scheduleId',
        header: 'Schedule Id',
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: 'collegeName',
        header: 'College Name',
        enableEditing: false,
      },

      {
        accessorKey: 'location',
        header: 'Location',
        enableEditing: false,
      },

      {
        accessorKey: 'region',
        header: 'Region',
        enableEditing: false,
      },

      {
        accessorKey: 'pptDate',
        header: 'Pre Placement Talk',
        enableEditing: false,
      },

      {
        accessorKey: 'assessmentDate',
        header: 'Assessment Date',
        enableEditing: false,
      },
      {
        accessorKey: 'designDate',
        header: 'Design Exercise Date',
        enableEditing: false,
      },
      {
        accessorKey: 'interviewDate',
        header: 'Interview Date',
        enableEditing: false,
      },
      {
        accessorKey: 'interviewerName',
        header: 'Interviewer Name',
        enableEditing: false,
      },
      {
        accessorKey: 'grade',
        header: 'Interviewer Grade',
        enableEditing: false,
      },
    ],
    [validationErrors],
  )

  const table = useMaterialReactTable({
    columns,
    data: scheduleList,
    enableRowSelection: true,
    initialState: { columnVisibility: { scheduleId: false } },
    isLoading,
    enableEditing: false,
    muiTableHeadCellProps:{
      align: 'center',
    },
    muiTableBodyCellProps:{
      align: 'center',
    },
    enableRowActions: true,
    onRowSelectionChange: setRowSelection,

    state: { rowSelection, isLoading },
    getRowId: row => row.scheduleId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
  

    renderRowActionMenuItems: ({ row, table, closeMenu }) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box className='flex items-center'>
          <Tooltip title='Edit' className='flex gap-1'>
            <Button
              onClick={() => {
                setOpenUpdateForm(true)
                setScheduleToUpdate(row.original)
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
                setScheduleIdToDelete(row.original.scheduleId)
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
              setOpenCreateForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            Create New Schedule
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
    <div className='flex flex-col  mt-2 overflow-x-auto max-w-100%'>
      <MaterialReactTable table={table} updateSchedule={updateSchedule} />

      {renderDeleteModal()}
      {renderDeleteRowsModal()}

      {openCreateForm && (
        <CreateScheduleForm
          openModal={openCreateForm}
          setOpenModal={setOpenCreateForm}
          createSchedule={handleCreate}
        />
      )}

      {openUpdateForm && (
        <UpdateScheduleForm
          openModal={openUpdateForm}
          setOpenModal={setOpenUpdateForm}
          updateSchedule={updateSchedule}
          currentSchedule={scheduleToUpdate}
        />
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
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
        autoHideDuration={5000}
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

export default CampusCalendarTable
