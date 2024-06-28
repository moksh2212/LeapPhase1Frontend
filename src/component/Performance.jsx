import { useMemo, useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
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
  Tooltip,
} from '@mui/material'
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import Rating from '@mui/material/Rating'
 
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
 
const Perfromancetable = () => {
  const [validationErrors, setValidationErrors] = useState({})
  const [datax, setDatax] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState(null)
  const [rowDelete, setRowDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const perBaseUrl = 'http://192.168.0.141:8080'
  // const perBaseUrl = process.env.BASE_URL
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(`${perBaseUrl}/cpm/performance/getAllPerformance`)
        const response = await fetch(
          `${perBaseUrl}/cpm/performance/getAllPerformance`,
        )
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
 
        const formattedData = data.map(item => ({
          talentId: item.talentId,
          fullName: item.talentName,
          ekBatch: item.ekYear,
          talentSkills: item.talentSkills,
          assignmentScore: item.assignmentScore,
          assessmentScore: item.assessmentScore,
          averageAttendance: item.averageAttendance,
          punctuality: item.punctuality,
          technicalProficiency: item.technicalProficiency,
          proactiveness: item.proactiveness,
          timeliness: item.timeliness,
        }))
        setError(null)
        setDatax(formattedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch users:', error)
        setIsLoading(true)
      }
    }
 
    fetchUsers()
  }, [])
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
 
    if (error) {
      setError(null)
    }
 
    setOpenSnackbar(false)
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
  const columns = useMemo(
    () => [
      {
        accessorKey: 'talentId',
        header: 'Employee Id',
        enableEditing: true,
        size: 80,
        headerProps: {
          style: {
            textAlign: 'center',
          },
        },
        Cell: ({ cell }) => (
          <div
            style={{
              textAlign: 'center',
            }}
          >
            {cell.getValue()}
          </div>
        ),
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        enableEditing: false,
      },
      {
        accessorKey: 'ekBatch',
        header: 'Ek Batch',
        enableEditing: false,
      },
      {
        accessorKey: 'talentSkills',
        header: 'Skills',
        enableEditing: false,
        size: 100,
        Cell: ({ cell }) => {
          const skillsString = cell.getValue() // String of skills separated by commas
          const skills = skillsString
            ? skillsString.split(',').map(skill => skill.trim())
            : [] // Convert string to array of skills if not null
          return (
            <div className='mr-3'>
              {skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    border: '1px solid #61DBFB', // Light blue border
                    padding: '0.25rem 0.5rem',
                    margin: '0.25rem',
                    borderRadius: '0.25rem',
                    backgroundColor: '#E3F2FD', // Light blue background
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          )
        },
      },
      {
        accessorKey: 'assignmentScore',
        header: 'Avg Assignment Score',
        enableEditing: true,
        size: 300,
        headerProps: {
          style: {
            textAlign: 'center', // Center align header value
          },
        },
        Cell: ({ cell }) => {
          let backgroundColor
          let textColor = '#fff' // Default text color
          const value = cell.getValue()
 
          if (value >= 8 && value <= 10) {
            backgroundColor = '#4CAF50' // Green
          } else if (value >= 4 && value <= 6) {
            backgroundColor = '#2196F3' // Blue
          } else if (value >= 2 && value <= 3) {
            backgroundColor = '#FFEB3B' // Yellow
            textColor = '#000' // Black text for yellow background
          } else {
            backgroundColor = '#F44336' // Red
          }
 
 
          return (
            <Box
              className='flex items-center justify-center'
              component='span'
              sx={{
                backgroundColor,
                color: textColor,
                borderRadius: '0.25rem',
                width: '100%',
                maxWidth: '9ch',
                p: '0.25rem',
                marginLeft: '50px',
              }}
            >
              {value}
            </Box>
          )
        },
      },
      {
        accessorKey: 'assessmentScore',
        header: 'Avg Assessment Score',
        enableEditing: true,
        size: 300,
        headerProps: {
          style: {
            textAlign: 'center', // Center align header value
          },
        },
        Cell: ({ cell }) => {
          let backgroundColor
          let textColor = '#fff' // Default text color
          const value = cell.getValue()
 
          // Assign colors based on ranges
          if (value >= 8 && value <= 10) {
            backgroundColor = '#4CAF50' // Green
          } else if (value >= 4 && value <= 6) {
            backgroundColor = '#2196F3' // Blue
          } else if (value >= 2 && value <= 3) {
            backgroundColor = '#FFEB3B' // Yellow
            textColor = '#000' // Black text for yellow background
          } else {
            backgroundColor = '#F44336' // Red
          }
 
          return (
            <Box
              className='flex items-center justify-center'
              component='span'
              sx={{
                backgroundColor,
                color: textColor,
                borderRadius: '0.25rem',
                width: '100%',
                maxWidth: '9ch',
                p: '0.25rem',
                marginLeft: '50px',
              }}
            >
              {value}
            </Box>
          )
        },
      },
      {
        accessorKey: 'averageAttendance',
        header: 'Average Attendance',
        enableEditing: true,
        size: 250,
        headerProps: {
          style: {
            textAlign: 'center', // Center align header value
          },
        },
        Cell: ({ cell }) => {
          let backgroundColor
          let textColor = '#fff' // Default text color
          const value = cell.getValue()
 
          // Assign colors based on ranges
          if (value >= 100 && value <= 90) {
            backgroundColor = '#4CAF50' // Green
          } else if (value >= 60 && value <= 89) {
            backgroundColor = '#2196F3' // Blue
          } else if (value >= 40 && value <= 59) {
            backgroundColor = '#FFEB3B' // Yellow
            textColor = '#000' // Black text for yellow background
          } else {
            backgroundColor = '#F44336' // Red
          }
 
          return (
            <Box
              className='flex items-center justify-center'
              component='span'
              sx={{
                backgroundColor,
                color: textColor,
                borderRadius: '0.25rem',
                width: '100%',
                maxWidth: '9ch',
                p: '0.25rem',
                marginLeft: '30px',
              }}
            >
              {value}
            </Box>
          )
        },
      },
      {
        accessorKey: 'punctuality',
        header: 'Punctuality',
        size: 200,
        muiEditTextFieldProps: {
          type: 'punctuality',
          required: true,
          error: !!validationErrors?.punctuality,
          helperText: validationErrors?.punctuality,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              punctuality: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (
            <div className='ml-10'>
              {cell.getValue()}
            </div>
          )
        },
      },
      {
        accessorKey: 'technicalProficiency',
        header: 'Technical Proficiency',
        size: 250,
        muiEditTextFieldProps: {
          type: 'technicalProficiency',
          required: true,
          error: !!validationErrors?.technicalProficiency,
          helperText: validationErrors?.technicalProficiency,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              technicalProficiency: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return (
            <div className='ml-10'>
              {cell.getValue()}
            </div>
          )
        },
      },
      {
        accessorKey: 'proactiveness',
        header: 'Proactiveness',
        size: 150,
        muiEditTextFieldProps: {
          type: 'proactiveness',
          required: true,
          error: !!validationErrors?.proactiveness,
          helperText: validationErrors?.proactiveness,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              proactiveness: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return  (
            <div className='ml-10'>
              {cell.getValue()}
            </div>
          )
        },
      },
      {
        accessorKey: 'timeliness',
        header: 'Timeliness',
        muiEditTextFieldProps: {
          type: 'timeliness',
          required: true,
          error: !!validationErrors?.timeliness,
          helperText: validationErrors?.timeliness,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              timeliness: undefined,
            }),
        },
        Cell: ({ cell }) => {
          return  (
            <div className='ml-10'>
              {cell.getValue()}
            </div>
          )
        },
      },
    ],
    [validationErrors],
  )
 
  const handleCreateUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values)
    if (Object.values(newValidationErrors).some(error => error)) {
      console.log('Validation errors found')
      setValidationErrors(newValidationErrors)
      return
    }
    setValidationErrors({})
 
    const transformedData = {
      talentId: values.talentId,
      assignmentScore: values.assignmentScore,
      averageAttendance: values.averageAttendance,
      assessmentScore: values.assessmentScore,
      punctuality: values.punctuality,
      technicalProficiency: values.technicalProficiency,
      proactiveness: values.proactiveness,
      timeliness: values.timeliness,
    }
 
    console.log('Transformed performanceData:', transformedData)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${perBaseUrl}/cpm/performance/addPerformance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Set the correct Content-Type header
          },
          body: JSON.stringify(transformedData),
        },
      )
 
      if (!response.ok) {
        throw new Error('Failed to create performance data')
      }
      setOpenSnackbar('Employee updated successfully!')
      setError(null)
 
      table.setCreatingRow(null)
    } catch (error) {
      setError(error.message)
    }
  }
 
  const handleSaveUser = async ({ values, table }) => {
    const newValidationErrors = validateUser(values)
 
    if (Object.values(newValidationErrors).some(error => error)) {
      setValidationErrors(newValidationErrors)
      return
    }
 
    setValidationErrors({})
    const transformedData = {
      talentId: values.talentId,
      assignmentScore: values.assignmentScore,
      averageAttendance: values.averageAttendance,
      assessmentScore: values.assessmentScore,
      punctuality: values.punctuality,
      technicalProficiency: values.technicalProficiency,
      proactiveness: values.proactiveness,
      timeliness: values.timeliness,
    }
 
    console.log('Transformed performanceData:', transformedData)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${perBaseUrl}/cpm/performance/updateFeedback`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify(transformedData),
        },
      )
 
      if (!response.ok) {
        throw new Error('Failed to create performance data')
      }
      setOpenSnackbar('Employee edited successfully!')
      setError(null)
 
      table.setEditingRow(null)
    } catch (error) {
      setError(error.message)
    }
  }
 
  const handleDelete = async () => {
    const performanceData = {
      talentId: rowDelete.original.talentId,
      assignmentScore: rowDelete.original.assignmentScore,
      averageAttendance: rowDelete.original.averageAttendance,
      assessmentScore: rowDelete.original.assessmentScore,
      attendance: rowDelete.original.attendance,
      punctuality: rowDelete.original.punctuality,
      technicalProficiency: rowDelete.original.technicalProficiency,
      proactiveness: rowDelete.original.proactiveness,
      timeliness: rowDelete.original.timeliness,
    }
    setError(null)
    setOpenSnackbar(null)
    // Make DELETE request to deletePerformance API
    try {
      const response = await fetch(
        `${perBaseUrl}/cpm/performance/deletePerformance`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(performanceData),
        },
      )
 
      if (response.ok) {
        setOpenDeleteModal(false)
        console.log('Performance deleted successfully')
 
        setDatax(prevData =>
          prevData.filter(row => row.talentId !== performanceData.talentId),
        )
        setOpenSnackbar('Employee deleted successfully!')
        setError(null)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
 
  const table = useMaterialReactTable({
    columns,
    data: datax,
    createDisplayMode: 'modal', //default ('row', and 'custom' are also available)
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: row => row.id,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
 
    // Custom renderEditRowDialogContent
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          className='font-bold text-2xl text-blue-500 mb-4'
          variant='h3'
        >
          Edit User
        </DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <Typography variant='subtitle1'>Update user details:</Typography>
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
              setOpenDeleteModal(true)
              setRowDelete(row)
              console.log(row)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  })
 
  return (
    <div className='flex flex-col gap-5 w-full m-6 overflow-x-auto'>
      <h2 className={`text-3xl text-[#0087D5] font-bold`}>PERFORMANCE</h2>
      <MaterialReactTable table={table} />
      {renderDeleteModal()}
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
 
//CREATE hook (post new user to api)
 
const Performance = () => <Perfromancetable />
 
export default Performance
 
const validateRequired = value => {
  if (value === undefined || value === null) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (typeof value === 'object') {
    return Object.keys(value).length > 0
  }
  return true
}
 
function validateUser(user) {
  if (!user) return { error: 'User object is undefined or null' }
 
  const errors = {}
 
  if (!validateRequired(user.punctuality)) {
    errors.punctuality = 'Punctuality is Required'
  } else if (user.punctuality < 1 || user.punctuality > 5) {
    errors.punctuality = 'Punctuality must be between 1 and 5'
  }
 
  if (!validateRequired(user.technicalProficiency)) {
    errors.technicalProficiency = 'Technical Proficiency is Required'
  } else if (user.technicalProficiency < 1 || user.technicalProficiency > 5) {
    errors.technicalProficiency =
      'Technical Proficiency must be between 1 and 5'
  }
 
  if (!validateRequired(user.proactiveness)) {
    errors.proactiveness = 'Proactiveness is Required'
  } else if (user.proactiveness < 1 || user.proactiveness > 5) {
    errors.proactiveness = 'Proactiveness must be between 1 and 5'
  }
 
  if (!validateRequired(user.timeliness)) {
    errors.timeliness = 'Timeliness is Required'
  } else if (user.timeliness < 1 || user.timeliness > 5) {
    errors.timeliness = 'Timeliness must be between 1 and 5'
  }
 
  return errors
}