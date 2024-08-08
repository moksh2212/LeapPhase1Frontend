import React, { useState, useEffect, useMemo } from 'react'
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

const Stage1Component = () => {
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

  

  useEffect(() => {
    fetchData()
    setLockSnackbar(false)
  }, [])

  useEffect(() => {
    const handleClick = event => {
      if (locked) {
        event.stopPropagation()
        setLockSnackbar(true)
      }
    }

    const tableBody = document.querySelector('.MuiTable-root')
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
        `${baseUrl}/cpm/assessment/getAssessmentLevel?assessmentId=${assessmentId}&level=levelOne`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      const jsonData = await response.json()

      setLocked(jsonData.isLevelOneCompleted)

      const dataList = jsonData.levelOneList

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
      formData.append('level', 'levelOne')

      const updatedValues = {
        ...values,
        levelOneId: row.original.levelOneId,
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
              item.levelOneId === row.original.levelOneId
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
    formData.append('level', 'levelOne')

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

  const handleFileSelect = event => {
    const file = event.target.files[0]
    setSelectedFile(file)
    setSnackbar({
      open: true,
      message: `File "${file.name}" selected`,
      severity: 'info',
    })
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
    formData.append('level', 'levelOne')

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
    formData.append('level', 'levelone')

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
        accessorKey: 'levelOneId',
        header: 'ID',
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: 'selected',
        header: 'Status',
        size: 150,
        enableEditing: false,
      },
      {
        accessorKey: 'candidateName',
        header: 'Candidate Name',
        size: 150,
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
        size: 200,
        muiTableBodyCellEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
        },
        enableEditing: false,
      },
      {
        accessorKey: 'quantitativeScore',
        header: 'Quantitative Score',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'logicalScore',
        header: 'Logical Score',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'verbalScore',
        header: 'Verbal Score',
        size: 150,
        muiTableBodyCellEditTextFieldProps: {
          type: 'number',
        },
      },
      {
        accessorKey: 'codingScore',
        header: 'Coding Score',
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
            'quantitativeScore',
            'logicalScore',
            'verbalScore',
            'codingScore',
          ].reduce((sum, key) => sum + (parseFloat(row.original[key]) || 0), 0)
          const percentage = (total / 400) * 100
          return `${percentage.toFixed(2)}%`
        },
      },
    ],
    [validationErrors],
  )

  const table = useMaterialReactTable({
    columns,
    data,
    enableEditing: !locked,
    enableRowSelection: !locked,
    editDisplayMode: 'row',
    initialState: {
      columnVisibility: { levelOneId: false, selected: false },
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
              Round 1 : Online Assessment
            </h2>
          </Box>
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              color='success'
              disabled={selectedRowCount === 0}
              onClick={handleSelectForNextStage}
              variant='contained'
            >
              Select for Design Round
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
                <label htmlFor='file-upload'>
                  <FileUploadButton
                    component='span'
                    startIcon={<FileUploadIcon />}
                  >
                    {selectedFile
                      ? selectedFile.name.length > 10
                        ? selectedFile.name.slice(0, 10) + '...'
                        : selectedFile.name
                      : 'Select Excel File'}
                  </FileUploadButton>
                </label>
              </Tooltip>
              <UploadButton onClick={handleFileUpload} disabled={!selectedFile}>
                Upload
              </UploadButton>
            </ButtonGroup>
            <input
              accept='.xlsx,.xls'
              id='file-upload'
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
        <DialogTitle id='alert-dialog-title'>{'Confirm Marking as Complete'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Are you sure you want to complete this stage? This action cannot be
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

export default Stage1Component
