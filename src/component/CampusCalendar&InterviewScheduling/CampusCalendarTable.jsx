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
  // const [scheduleList, setScheduleList] = useState([
  //   {
  //     scheduleId: 'SCH001',
  //     collegeName: 'Harvard University',
  //     location: 'Cambridge, MA',
  //     region: 'Northeast',
  //     pptDate: '2024-07-10',
  //     assessmentDate: '2024-07-15',
  //     designDate: '2024-07-20',
  //     interviewDate: '2024-07-25',
  //     interviewerName: 'John Smith',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH002',
  //     collegeName: 'Stanford University',
  //     location: 'Stanford, CA',
  //     region: 'West',
  //     pptDate: '2024-07-11',
  //     assessmentDate: '2024-07-16',
  //     designDate: '2024-07-21',
  //     interviewDate: '2024-07-26',
  //     interviewerName: 'Jane Doe',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH003',
  //     collegeName: 'Massachusetts Institute of Technology',
  //     location: 'Cambridge, MA',
  //     region: 'Northeast',
  //     pptDate: '2024-07-12',
  //     assessmentDate: '2024-07-17',
  //     designDate: '2024-07-22',
  //     interviewDate: '2024-07-27',
  //     interviewerName: 'Alice Johnson',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH004',
  //     collegeName: 'University of California, Berkeley',
  //     location: 'Berkeley, CA',
  //     region: 'West',
  //     pptDate: '2024-07-13',
  //     assessmentDate: '2024-07-18',
  //     designDate: '2024-07-23',
  //     interviewDate: '2024-07-28',
  //     interviewerName: 'Bob Brown',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH005',
  //     collegeName: 'University of Chicago',
  //     location: 'Chicago, IL',
  //     region: 'Midwest',
  //     pptDate: '2024-07-14',
  //     assessmentDate: '2024-07-19',
  //     designDate: '2024-07-24',
  //     interviewDate: '2024-07-29',
  //     interviewerName: 'Carol Davis',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH006',
  //     collegeName: 'California Institute of Technology',
  //     location: 'Pasadena, CA',
  //     region: 'West',
  //     pptDate: '2024-07-15',
  //     assessmentDate: '2024-07-20',
  //     designDate: '2024-07-25',
  //     interviewDate: '2024-07-30',
  //     interviewerName: 'David Wilson',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH007',
  //     collegeName: 'Princeton University',
  //     location: 'Princeton, NJ',
  //     region: 'Northeast',
  //     pptDate: '2024-07-16',
  //     assessmentDate: '2024-07-21',
  //     designDate: '2024-07-26',
  //     interviewDate: '2024-07-31',
  //     interviewerName: 'Eve Clark',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH008',
  //     collegeName: 'Yale University',
  //     location: 'New Haven, CT',
  //     region: 'Northeast',
  //     pptDate: '2024-07-17',
  //     assessmentDate: '2024-07-22',
  //     designDate: '2024-07-27',
  //     interviewDate: '2024-08-01',
  //     interviewerName: 'Frank Lewis',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH009',
  //     collegeName: 'Columbia University',
  //     location: 'New York, NY',
  //     region: 'Northeast',
  //     pptDate: '2024-07-18',
  //     assessmentDate: '2024-07-23',
  //     designDate: '2024-07-28',
  //     interviewDate: '2024-08-02',
  //     interviewerName: 'Grace Walker',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH010',
  //     collegeName: 'University of Pennsylvania',
  //     location: 'Philadelphia, PA',
  //     region: 'Northeast',
  //     pptDate: '2024-07-19',
  //     assessmentDate: '2024-07-24',
  //     designDate: '2024-07-29',
  //     interviewDate: '2024-08-03',
  //     interviewerName: 'Hank Hall',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH011',
  //     collegeName: 'University of Michigan',
  //     location: 'Ann Arbor, MI',
  //     region: 'Midwest',
  //     pptDate: '2024-07-20',
  //     assessmentDate: '2024-07-25',
  //     designDate: '2024-07-30',
  //     interviewDate: '2024-08-04',
  //     interviewerName: 'Ivy Young',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH012',
  //     collegeName: 'Duke University',
  //     location: 'Durham, NC',
  //     region: 'South',
  //     pptDate: '2024-07-21',
  //     assessmentDate: '2024-07-26',
  //     designDate: '2024-07-31',
  //     interviewDate: '2024-08-05',
  //     interviewerName: 'Jack Allen',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH013',
  //     collegeName: 'Northwestern University',
  //     location: 'Evanston, IL',
  //     region: 'Midwest',
  //     pptDate: '2024-07-22',
  //     assessmentDate: '2024-07-27',
  //     designDate: '2024-08-01',
  //     interviewDate: '2024-08-06',
  //     interviewerName: 'Kelly Wright',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH014',
  //     collegeName: 'Cornell University',
  //     location: 'Ithaca, NY',
  //     region: 'Northeast',
  //     pptDate: '2024-07-23',
  //     assessmentDate: '2024-07-28',
  //     designDate: '2024-08-02',
  //     interviewDate: '2024-08-07',
  //     interviewerName: 'Liam Green',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH015',
  //     collegeName: 'University of Texas at Austin',
  //     location: 'Austin, TX',
  //     region: 'South',
  //     pptDate: '2024-07-24',
  //     assessmentDate: '2024-07-29',
  //     designDate: '2024-08-03',
  //     interviewDate: '2024-08-08',
  //     interviewerName: 'Mia Harris',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH016',
  //     collegeName: 'University of Washington',
  //     location: 'Seattle, WA',
  //     region: 'West',
  //     pptDate: '2024-07-25',
  //     assessmentDate: '2024-07-30',
  //     designDate: '2024-08-04',
  //     interviewDate: '2024-08-09',
  //     interviewerName: 'Noah Martinez',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH017',
  //     collegeName: 'University of Southern California',
  //     location: 'Los Angeles, CA',
  //     region: 'West',
  //     pptDate: '2024-07-26',
  //     assessmentDate: '2024-07-31',
  //     designDate: '2024-08-05',
  //     interviewDate: '2024-08-10',
  //     interviewerName: 'Olivia Lee',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH018',
  //     collegeName: 'University of North Carolina at Chapel Hill',
  //     location: 'Chapel Hill, NC',
  //     region: 'South',
  //     pptDate: '2024-07-27',
  //     assessmentDate: '2024-08-01',
  //     designDate: '2024-08-06',
  //     interviewDate: '2024-08-11',
  //     interviewerName: 'Paul King',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH019',
  //     collegeName: 'University of Florida',
  //     location: 'Gainesville, FL',
  //     region: 'South',
  //     pptDate: '2024-07-28',
  //     assessmentDate: '2024-08-02',
  //     designDate: '2024-08-07',
  //     interviewDate: '2024-08-12',
  //     interviewerName: 'Quinn Baker',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH020',
  //     collegeName: 'University of Illinois at Urbana-Champaign',
  //     location: 'Champaign, IL',
  //     region: 'Midwest',
  //     pptDate: '2024-07-29',
  //     assessmentDate: '2024-08-03',
  //     designDate: '2024-08-08',
  //     interviewDate: '2024-08-13',
  //     interviewerName: 'Ryan Scott',
  //     grade: 'B',
  //   },
  // ])
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
          const response = await fetch(`${baseUrl}/api/interviewschedule/read`,{
            headers:
            {
              Authorization: `Basic ${token}`,
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
      
      const response = await fetch(`${baseUrl}/api/interviewschedule/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
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
        `${baseUrl}/api/interviewschedule/updateScheduling/${scheduleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
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
        `${baseUrl}/api/interviewschedule/delete/${scheduleId}`,
        {
          method: 'DELETE',
          headers:{
            Authorization: `Basic ${token}`,
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
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),

    onCreatingRowSave: async ({ values, table }) => {
      const errors = {}

      Object.entries(values).forEach(([key, value]) => {
        const rule = validationRules[key]
        if (rule) {
          if (rule.required && !value.trim()) {
            errors[key] = `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } field cannot be empty`
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errors[key] = rule.message
          }
        }
      })

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({}) // Clear any previous errors
      await createSchedule(values)
      table.setCreatingRow(null)
    },

    onEditingRowSave: async ({ values, table }) => {
      const errors = {}

      Object.entries(values).forEach(([key, value]) => {
        const temp = value.toString().trim() // Convert value to string and remove leading/trailing whitespaces
        const rule = validationRules[key]

        if (rule) {
          if (rule.required && temp.length === 0) {
            errors[key] = `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } field cannot be empty`
          } else if (rule.pattern && !rule.pattern.test(value)) {
            errors[key] = rule.message
          }
        }
      })

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({})
      await updateSchedule(values)
      table.setEditingRow(null)
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
