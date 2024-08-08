import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import {
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  ButtonGroup,
  Tooltip,
  styled,
} from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import LockIcon from '@mui/icons-material/Lock'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

const baseUrl = process.env.BASE_URL2

const CustomButton = styled(Button)(({ theme }) => ({
  height: '40px',
}))

const FileUploadButton = styled(Button)(({ theme }) => ({
  height: '40px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}))

const UploadButton = styled(Button)(({ theme }) => ({
  height: '40px',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.secondary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}))

const Stage3Component = () => {
  const [data, setData] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [locked, setLocked] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [lockSnackbar, setLockSnackbar] = useState(false)
  const navigate = useNavigate()
  const token = useSelector(state => state.user.token)
  const urlParams = new URLSearchParams(window.location.search)
  const assessmentId = urlParams.get('id')
  const fileInputRef = useRef(null);

  console.log('====================================')
  console.log(selectedFile)
  console.log('====================================')
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleClick = event => {
      if (locked) {
        event.stopPropagation()
        setLockSnackbar(true)
      }
    }

    const tableBody = document.querySelector('.MuiTableBody-root')
    if (tableBody) {
      tableBody.addEventListener('click', handleClick)
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener('click', handleClick)
      }
    }
  }, [locked])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/getAssessmentLevel?assessmentId=${assessmentId}&level=levelThree`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const jsonData = await response.json()

      setLocked(jsonData.isLevelThreeCompleted)

      const dataList = jsonData.levelThreeList

      setData(dataList)
    } catch (error) {
      console.error('Error fetching data:', error)
      setSnackbar({
        open: true,
        message: 'Error fetching data',
        severity: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = event => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setSnackbar({
      open: true,
      message: `File "${file.name}" selected`,
      severity: 'info',
    })
  }

  const handleDialogOpen = () => {
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const handleConfirmLock = () => {
    handleLockTable()
    setDialogOpen(false)
  }

  const handleSaveRow = async ({ exitEditingMode, row, values }) => {
    if (!Object.keys(validationErrors).length) {
      const formData = new FormData()
      formData.append('assessmentId', assessmentId)
      formData.append('level', 'levelThree')

      const updatedValues = {
        ...values,
        levelThreeId: row.original.levelThreeId,
        selected: row.original.selected,
      }

      const levelDataBlob = new Blob([JSON.stringify(updatedValues)], {
        type: 'application/json',
      })

      formData.append('levelData', levelDataBlob, 'levelData.json')

      try {
        const response = await fetch(
          `${baseUrl}/cpm/assessment/updateAssessment`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        )
        if (response.ok) {
          setData(prev =>
            prev.map(item =>
              item.levelThreeId === row.original.levelThreeId
                ? updatedValues
                : item,
            ),
          )
          setSnackbar({
            open: true,
            message: 'Data updated successfully',
            severity: 'success',
          })
        } else {
          throw new Error('Failed to update data')
        }
      } catch (error) {
        console.error('Error updating data:', error)
        setSnackbar({
          open: true,
          message: 'Error updating data',
          severity: 'error',
        })
      }
    }
    exitEditingMode()
  }

  const handleSelectForNextStage = async () => {
    const selectedRows = table
      .getSelectedRowModel()
      .flatRows.map(row => row.original)

    const formData = new FormData()
    formData.append('assessmentId', assessmentId)
    formData.append('level', 'levelThree')

    const selectionListBlob = new Blob([JSON.stringify(selectedRows)], {
      type: 'application/json',
    })
    formData.append('selectionList', selectionListBlob, 'selectionList.json')
    table.resetRowSelection()
    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/selectCandidates`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
      if (response.ok) {
        setData(prev =>
          prev.map(row => ({
            ...row,
            selectedForNextStage: selectedRows.some(
              selectedRow => selectedRow.id === row.id,
            ),
          })),
        )

        fetchData()

        setSnackbar({
          open: true,
          message: `${selectedRows.length} candidate(s) selected for next stage`,
          severity: 'success',
        })
      } else {
        throw new Error('Failed to select for next stage')
      }
    } catch (error) {
      console.error('Error selecting for next stage:', error)
      setSnackbar({
        open: true,
        message: 'Error selecting for next stage',
        severity: 'error',
      })
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) {
      setSnackbar({
        open: true,
        message: 'Please select a file',
        severity: 'warning',
      })
      return
    }
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('assessmentId', assessmentId)
    formData.append('level', 'levelThree')

    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/uploadLevelExcel`,
        {
          method: 'PUT',
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'File uploaded successfully',
          severity: 'success',
        })
        fetchData() // Refresh data after successful upload
      } else {
        throw new Error('Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      setSnackbar({
        open: true,
        message: 'Error uploading file',
        severity: 'error',
      })
    } finally {
      setSelectedFile(null)
    }
  }

  const handleLockTable = async () => {
    const formData = new FormData()
    formData.append('assessmentId', assessmentId)
    formData.append('level', 'levelthree')

    try {
      const response = await fetch(
        `${baseUrl}/cpm/assessment/markLevelAsComplete`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
      if (response.ok) {
        setLocked(true)
        setSnackbar({
          open: true,
          message: 'Assessment locked successfully',
          severity: 'success',
        })
      } else {
        throw new Error('Failed to lock assessment')
      }
    } catch (error) {
      console.error('Error locking assessment:', error)
      setSnackbar({
        open: true,
        message: 'Error locking assessment',
        severity: 'error',
      })
    }
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'levelThreeId',
        header: 'ID',
        size: 100,
        enableEditing: false,
      },
      {
        accessorKey: 'selected',
        header: 'Status',
        size: 100,
        enableEditing: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {row.original.selected ? (
              <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
            ) : (
              <Typography>Pending</Typography>
            )}
          </Box>
        ),
      },
      {
        accessorKey: 'candidateName',
        header: 'Candidate Name',
        size: 200,
        enableEditing: false,
        Cell: ({ row }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {row.original.selected && (
              <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
            )}
            <Typography>{row.original.candidateName}</Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        size: 250,
        enableEditing: false,
      },
      {
        accessorKey: 'problemSolving',
        header: 'Problem Solving',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'analyticalSkills',
        header: 'Analytical Skills',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'logicalFlow',
        header: 'Logical Flow',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'involved',
        header: 'Involved',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'teamPlayer',
        header: 'Team Player',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'willingToCreate',
        header: 'Willing to Create',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'tenacity',
        header: 'Tenacity',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'valueSystem',
        header: 'Value System',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'totalScore',
        header: 'Total Score',
        size: 150,
        enableEditing: false,
        Cell: ({ row }) => {
          const total = [
            'problemSolving',
            'analyticalSkills',
            'logicalFlow',
            'involved',
            'teamPlayer',
            'willingToCreate',
            'tenacity',
            'valueSystem',
          ].reduce((sum, key) => sum + (parseFloat(row.original[key]) || 0), 0)
          const percentage = (total / 800) * 100 // Assuming max score is 100 for each of the 8 categories
          return `${percentage.toFixed(2)}%`
        },
      },
    ],
    [],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: !locked,
    enableRowSelection: !locked,
    editDisplayMode: 'row',
    initialState: {
      columnVisibility: { levelThreeId: false, selected: false },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.original.selected
          ? 'rgba(0, 255, 0, 0.1)'
          : 'inherit',
        '&:hover': {
          backgroundColor: row.original.selected
            ? 'rgba(0, 255, 0, 0.2)'
            : 'inherit',
        },
      },
    }),
    onEditingRowSave: handleSaveRow,
    renderTopToolbar: ({ table }) => {
      const selectedRowCount = table.getSelectedRowModel().rows.length
      return (
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            p: '0.5rem',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Button
              color='primary'
              onClick={() => navigate(-1)}
              startIcon={<KeyboardArrowLeftIcon />}
            >
              Back
            </Button>

            <MRT_GlobalFilterTextField table={table} />
            <MRT_ToggleFiltersButton table={table} />
            <h2 className='text-xl my-auto text-blue-500 font-semibold'>
              Round 3 : Technical & Behavioural Round
            </h2>
          </Box>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color='success'
              disabled={selectedRowCount === 0}
              onClick={handleSelectForNextStage}
              variant='contained'
            >
              Select for Optional Round
            </Button>
            <ButtonGroup
              variant='contained'
              disabled={selectedRowCount > 0 || locked}
            >
              <Tooltip
                title={
                  selectedFile
                    ? `Selected: ${selectedFile.name}`
                    : 'Select Excel File'
                }
              >
                <Button
                  component='span'
                  startIcon={<FileUploadIcon />}
                  onClick={() => fileInputRef.current.click()}
                >
                  {selectedFile
                    ? selectedFile.name.length > 10
                      ? selectedFile.name.slice(0, 10) + '...'
                      : selectedFile.name
                    : 'Select Excel File'}
                </Button>
              </Tooltip>
              <UploadButton onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
              </UploadButton>
            </ButtonGroup>
            <input
              ref={fileInputRef}
              accept='.xlsx,.xls'
              type='file'
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            <Button
              color='warning'
              onClick={handleDialogOpen}
              variant='contained'
              disabled={locked}
              startIcon={<LockIcon />}
            >
              Mark as Complete
            </Button>
          </Box>
        </Box>
      )
    },
  })

  return (
    <>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable table={table} />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Snackbar
        open={lockSnackbar}
        autoHideDuration={2000}
        onClose={() => setLockSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setLockSnackbar(false)}
          severity='warning'
          sx={{ width: '100%' }}
          variant='filled'
        >
          The table is locked. You cannot make changes.
        </Alert>
      </Snackbar>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{'Confirm Lock'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to lock the table? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmLock} color='primary' autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Stage3Component
