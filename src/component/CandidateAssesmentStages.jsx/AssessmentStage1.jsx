import { useState, useEffect, useMemo } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import { useSelector } from 'react-redux'
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'
import CircularProgress from '@mui/material/CircularProgress'

import { Button, ButtonGroup, Snackbar, lighten } from '@mui/material'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

const canBaseUrl = process.env.BASE_URL2
const tanBaseUrl = process.env.BASE_URL2

const NameCell = ({ renderedCellValue }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <span>{renderedCellValue}</span>
    </Box>
  )
}
NameCell.propTypes = {
  renderedCellValue: PropTypes.node.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({}).isRequired,
  }).isRequired,
}

const SalaryCell = ({ cell }) => {
  return (
    <Box
      component='span'
      sx={theme => ({
        backgroundColor:
          cell.getValue() < 0
            ? theme.palette.error.dark
            : cell.getValue() >= 0 && cell.getValue() < 70
              ? theme.palette.warning.dark
              : theme.palette.success.dark,
        borderRadius: '0.25rem',
        color: '#fff',
        maxWidth: '9ch',
        p: '0.25rem',
      })}
    >
      {cell.getValue()?.toLocaleString?.('en-US', {})}
    </Box>
  )
}
SalaryCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
}

const DateHeader = ({ column }) => {
  return <em>{column.columnDef.header}</em>
}

DateHeader.propTypes = {
  column: PropTypes.shape({
    columnDef: PropTypes.shape({
      header: PropTypes.node.isRequired,
    }).isRequired,
  }).isRequired,
}

const AssesTable = () => {
  const [data, setData] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [open, setOpen] = useState(false)
  const [x, setx] = useState(0)
  const [count, setCount] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  const navigate = useNavigate()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  const handleSnackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  const handleErrorSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setErrorSnackbarOpen(false)
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const urlParams = new URLSearchParams(window.location.search)
        const collegeId = urlParams.get('collegeId')
        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment/getAssessmentByCollegeId?collegeId=${collegeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        let jsonData = await response.json()
        console.log('Raw API response:', jsonData)

        if (Array.isArray(jsonData)) {
          let arr = jsonData
            .filter(asses => asses && asses.assessmentLevelOne)
            .map(asses => asses.assessmentLevelOne)
            .filter(item => item && item.candidateName) // Ensure each item has a candidateName

          console.log('Filtered and transformed data:', arr)
          setData(arr)

          setLoading(false)

        } else {
          console.error('Received data is not an array:', jsonData)
          setData([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('Error fetching data')
        setErrorSnackbarOpen(true)
        setData([])
      }
    }

    fetchData()
  }, [x])

  const urlParams = new URLSearchParams(window.location.search)
  const collegeName = urlParams.get('collegeName')

  const columns = useMemo(
    () => [
      {
        id: 'candidateName',
        header: collegeName,
        columns: [
          {
            accessorKey: 'candidateName',
            header: 'Candidate Name',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => <div className='ml-8'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'email', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableClickToCopy: true,
            enableSorting: false,
            filterVariant: 'autocomplete',
            header: 'Email',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!emailRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid email',
                  }))
                } else {
                  setValidationErrors(prev => {
                    const updatedErrors = { ...prev }
                    delete updatedErrors[cell.id]
                    return updatedErrors
                  })
                }
              },
            }),
          },
          {
            accessorKey: 'quantitativeScore',
            header: 'Quantitative Score',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'logicalScore',
            header: 'Logical Score',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'verbalScore',
            header: 'Verbal Score',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },

          {
            accessorKey: 'codingScore',
            header: 'Coding Score',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },

          {
            accessorKey: 'totalScore',
            header: 'Total Score',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
        ],
      },
    ],
    [validationErrors],
  )

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: true,
    enableEditing: false,
    initialState: {
      showColumnFilters: false,
      showGlobalFilter: false,
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
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        '&:hover': {
          backgroundColor: row.original.selectedForNextStage
            ? 'rgba(0, 135, 213, 0.4)'
            : undefined,
        },
      },
    }),
    renderTopToolbar: ({ table }) => {
      const [hasSelectedRows, setHasSelectedRows] = useState(false)

      const handleActivate = async () => {
        let arr = []
        table.getSelectedRowModel().flatRows.map(row => {
          arr.push(row.original)
        })
        const response = await fetch(
          `${tanBaseUrl}/cpm2/assessment/selectLevelOne`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(arr),
          },
        )
        setData(prevData =>
          prevData.map(row => ({
            ...row,
            selectedForNextStage: arr.some(
              selectedRow => selectedRow.id === row.id,
            ),
          })),
        )
        setCount(table.getSelectedRowModel().rows.length)
        setOpen(true)
        setHasSelectedRows(false)
        table.toggleAllRowsSelected(false)
      }

      const [selectedFile, setSelectedFile] = useState(null)
      const handleFileChange = event => {
        setSelectedFile(event.target.files[0])
      }
      const handleFileDeselect = () => {
        setSelectedFile(null)
        // Reset the file input
        const fileInput = document.getElementById('excelFile')
        if (fileInput) {
          fileInput.value = ''
        }
      }

      const handleUpload = async () => {
        try {
          if (!selectedFile) {
            alert('Please select a file.')
            return
          }

          const formData = new FormData()
          const urlParams = new URLSearchParams(window.location.search)
          const collegeId = urlParams.get('collegeId')
          formData.append('file', selectedFile)
          formData.append('collegeId', collegeId)

          const response = await fetch(`${canBaseUrl}/cpm2/assessment/uploadLevelOne`, {
            method: 'POST',
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          console.log(response)
          if (response.ok) {
            setx(!x);
            setSnackbarOpen(true)
          } else {
            setErrorMessage('Failed to upload file')
            setErrorSnackbarOpen(true)
          }
        } catch (error) {
          console.error('Error uploading file:', error)
          setErrorMessage('Error uploading file')
          setErrorSnackbarOpen(true)
        }
      }

      const selectedRowCount = table.getSelectedRowModel().flatRows.length
      useEffect(() => {
        setHasSelectedRows(selectedRowCount > 0)
      }, [selectedRowCount])

      return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300'>
          <h2
            className={`text-2xl text-[#0087D5] font-bold mb-3 flex items-center`}
          >
            {' '}
            <Button
              color='primary'
              onClick={() => navigate(-1)} // Navigate to the previous page
              style={{ width: '50px' }}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            Online Assessment
          </h2>
          <Box
            sx={theme => ({
              backgroundColor: lighten(theme.palette.background.default, 0.05),
              display: 'flex',
              gap: '0.5rem',
              p: '8px',
              justifyContent: 'space-between',
            })}
          >
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <MRT_GlobalFilterTextField table={table} />
              <MRT_ToggleFiltersButton table={table} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  color='success'
                  disabled={table.getSelectedRowModel().rows.length === 0}
                  onClick={handleActivate}
                  variant='contained'
                >
                  Select for Stage 2
                </Button>
                <div>
                  <ButtonGroup>
                    <Button variant='contained' component='label'>
                      <label htmlFor='excelFile' className='excel-file-label'>
                        {selectedFile
                          ? ` ${selectedFile.name}`
                          : 'Add via Excel'}
                        <input
                          type='file'
                          id='excelFile'
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </label>
                    </Button>
                    {selectedFile && (
                      <Button
                        onClick={handleFileDeselect}

                        variant='contained'
                        sx={{
                          backgroundColor: 'red',
                          '&:hover': {
                            backgroundColor: 'darkred',
                          },
                        }}
                      >
                        <CloseSharpIcon />
                      </Button>
                    )}
                    <Button
                      style={{ marginLeft: '10px' }}
                      onClick={handleUpload}
                      color='success'
                      variant='contained'
                      disabled={!selectedFile}
                      sx={{ ml: 2 }}
                    >
                      Upload File
                    </Button>
                  </ButtonGroup>
                </div>
              </Box>
            </Box>
          </Box>
          {hasSelectedRows && (
            <Snackbar
              open={hasSelectedRows}
              message='Rows are selected'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
          )}
          {
            snackbarOpen && (
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleErrorSnackbarClose}

                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              >
                   <Alert
                onClose={handleErrorSnackbarClose}
                severity='success'
                variant='filled'
                sx={{ width: '100%' }}
              >
                File uploaded Successfully
              </Alert>
              </Snackbar>
            )
          }
          {open && (
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={handleClose}
                severity='success'
                variant='filled'
                sx={{ width: '100%' }}
              >
                {count === 1
                  ? `${count} candidate selected successfully for stage 2 `
                  : `${count} candidates selected successfully for stage  2`}
              </Alert>
            </Snackbar>
          )}
          {errorSnackbarOpen && (
            <Snackbar
              open={errorSnackbarOpen}
              autoHideDuration={6000}
              onClose={handleErrorSnackbarClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
              <Alert
                onClose={handleErrorSnackbarClose}
                severity='error'
                variant='filled'
                sx={{ width: '100%' }}
              >
                {errorMessage}
              </Alert>
            </Snackbar>
          )}
                   <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant='filled'
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </div>
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
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <MaterialReactTable table={table} />
      )}
    </>
  );}

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom'

const CandidatesAssesmentsStage1 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
)

export default CandidatesAssesmentsStage1
