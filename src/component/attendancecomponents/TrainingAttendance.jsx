import React, { useState, useMemo, useEffect } from 'react'
import { AccountCircle } from '@mui/icons-material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import moment from 'moment'

// MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_EditActionButtons,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'

// Material UI Imports
import {
  Box,
  Button,
  ButtonGroup,
  DialogActions,
  DialogContent,
  DialogTitle,
  lighten,
  Snackbar,
  Alert,
} from '@mui/material'
import { useSelector } from 'react-redux'

const baseUrl = 'http://192.168.0.141:8080'

const TrainingAttendance = () => {
  const [data, setData] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [snackbarSeverity, setSnackbarSeverity] = useState('success')
  const token = useSelector(state => state.user.token)

  const currentDate = new Date()
    .toLocaleDateString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-')

  const [value, setValue] = useState(dayjs(currentDate))

  useEffect(() => {
    // Make API call to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/cpm/api/attendance/getAttendanceByDate?date=${value.format(
            'MM/DD/YYYY',
          )}`, // Place the URL here
          {
            headers: {
              Authorization: `Basic ${token}`, // Assuming 'Bearer' token type; change if necessary
              'Content-Type': 'application/json',
            },
          },
        )
        let jsonData = await response.json()
        setData(jsonData)
        console.log(jsonData) // Log the fetched dataA
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [value])

  const columns = useMemo(
    () => [
      {
        id: 'attendance',
        header: 'Attendance',
        columns: [
          {
            accessorKey: 'id',
            id: 'id',
            header: 'ID',
            enableEditing: false,
            enableColumnFilter: false,
            size: 100,
          },
          {
            accessorKey: 'fullName',
            header: 'Name',
            enableEditing: true,
            enableColumnFilter: false,
            size: 100,
          },
          {
            accessorKey: 'email',
            filterVariant: 'autocomplete',
            enableColumnFilter: false,
            enableEditing: true,
            header: 'Email',
            size: 100,
          },

          {
            accessorKey: 'date',
            enableClickToCopy: true,
            enableColumnFilter: false,
            enableEditing: true,
            filterVariant: 'autocomplete',
            header: 'Date',
            size: 100,
          },
          {
            accessorKey: 'meetingDuration',
            enableEditing: true,
            header: 'Meeting Duration',
            size: 150,
          },
          {
            accessorKey: 'inMeetingDuration',
            enableEditing: true,
            header: 'Attended Time',
            size: 150,
          },
          {
            accessorKey: 'meetingTitle',
            enableEditing: true,
            header: 'Skill',
            size: 150,
          },
          {
            accessorKey: 'role',
            enableEditing: true,
            header: 'Role',
            size: 150,
          },
          {
            accessorKey: 'status',
            filterVariant: 'autocomplete',
            enableColumnFilter: false,
            header: 'Status',
            editVariant: 'select',
            editSelectOptions: ['Present', 'Absent'],
            size: 100,
          },
        ],
      },
    ],
    [],
  )

  const handleFileChange = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setSnackbarMessage('Please select a file.')
      setSnackbarSeverity('warning')
      setSnackbarOpen(true)
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const response = await fetch(`${baseUrl}/cpm/api/attendance/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Basic ${token}`,
        },
      })

      if (response.ok) {
        setSnackbarMessage('File uploaded successfully.')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        window.location.reload()
      } else {
        setSnackbarMessage('Failed to upload file.')
        setSnackbarSeverity('error')
        setSnackbarOpen(true)
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setSnackbarMessage('Error uploading file.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }
  const createAttendance = async newAttendance => {
    try {
      const response = await fetch(
        `${baseUrl}/cpm/api/attendance/addInternAttendance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(newAttendance),
        },
      )
      if (response.ok) {
        const data = await response.json()
        setSnackbarMessage('Attendance added successfully.')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        window.location.reload()
      }
    } catch (error) {
      console.error('Error creating new attendance:', error)
      setSnackbarMessage('Error creating new attendance.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    try {
      const response = await fetch(
        `${baseUrl}/cpm/api/attendance/updateAttendanceById/${values.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(values),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to update')
      } else {
        setSnackbarMessage('Edited successfully.')
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
      }
      exitEditingMode() // required to exit editing mode and close modal
    } catch (error) {
      console.error('Error updating data:', error)
      setSnackbarMessage('Error updating data.')
      setSnackbarSeverity('error')
      setSnackbarOpen(true)
    }
  }

  const table = useMaterialReactTable({
    columns,
    data,
    enableColumnFilterModes: true,
    enableEditing: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableCellActions: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      columnPinning: {
        left: ['mrt-row-expand', 'mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    muiSearchTextFieldProps: {
      size: 'small',
      variant: 'outlined',
    },
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [10, 20, 30],
      shape: 'rounded',
      variant: 'outlined',
    },
    onEditingRowSave: handleSaveRow,
    onCreatingRowSave: async ({ values }) => {
      await createAttendance(values)
    },
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      return (
        <>
          <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
            Create Attendance
          </DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {internalEditComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons variant='text' table={table} row={row} />
          </DialogActions>
        </>
      )
    },
    renderTopToolbar: ({ table }) => {
      return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300'>
          <div className='flex justify-between mb-2 bg-[#F9FAFB] rounded-md'>
            <h2 className={`text-3xl text-[#0087D5] font-bold my-auto p-2`}>
              Training Attendance
            </h2>

            <div className='my-auto mr-2'>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <ButtonGroup>
                  <Button variant='contained' component='label'>
                    <label htmlFor='csvFile' className='csv-file-label'>
                      {selectedFile
                        ? `File Selected: ${selectedFile.name}`
                        : 'Add via Csv'}
                      <input
                        type='file'
                        id='csvFile'
                        accept='.csv'
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </label>
                  </Button>
                  <Button
                    style={{ marginLeft: '10px' }}
                    onClick={handleUpload}
                    color='success'
                    variant='contained'
                    disabled={!selectedFile}
                  >
                    Upload File
                  </Button>
                </ButtonGroup>
              </Box>
            </div>
          </div>
          <Button
            variant='contained'
            onClick={() => {
              table.setCreatingRow(true)
            }}
          >
            Create New Attendance
          </Button>
          <Box
            sx={theme => ({
              backgroundColor: lighten(theme.palette.background.default, 0.05),
              display: 'flex',
              gap: '0.5rem',
              p: '8px',
              justifyContent: 'space-between',
            })}
          >
            <div className='my-auto mr-2'>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker', 'DatePicker']}>
                  <DatePicker
                    label='Select Date'
                    value={value}
                    onChange={newValue => setValue(newValue)}
                    format='MM/DD/YYYY'
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <MRT_GlobalFilterTextField table={table} />
              <MRT_ToggleFiltersButton table={table} />
            </Box>
          </Box>
        </div>
      )
    },
  })

  return (
    <>
      <MaterialReactTable table={table} />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default TrainingAttendance
