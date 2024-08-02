import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { Button, Snackbar, lighten } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import CircularProgress from '@mui/material/CircularProgress'
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
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const token = useSelector(state => state.user.token)
  const [count, setCount] = useState(0)
  const [x, setx] = useState(0)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

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

        jsonData = jsonData.filter(
          assessment => assessment && assessment.assessmentLevelTwo,
        )

        const arr = jsonData.map(assessment => assessment.assessmentLevelTwo)

        setData(arr)
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setSnackbar({ open: true, message: 'Error fetching data', severity: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [x])

  const validate = values => {
    const errors = {}
    const requiredFields = [
      'contentTotal',
      'presentationTotal',
      'problemStatement',
      'processWorkflow',
      'techStacks',
      'recommendedSolution',
      'languageAndGrammar',
      'logicalFlow',
    ]

    requiredFields.forEach(key => {
      if (
        values[key] === undefined ||
        values[key] === null ||
        values[key] === ''
      ) {
        errors[key] = `${key} is required`
      } else {
        const numValue = Number(values[key])
        if (isNaN(numValue)) {
          errors[key] = `${key} must be a number`
        } else if (numValue > 10) {
          errors[key] = `${key} should not be greater than 10`
        } else if (numValue < 0) {
          errors[key] = `${key} should not be less than 0`
        }
      }
    })

    return errors
  }
  const urlParams = new URLSearchParams(window.location.search)
  const collegeName = urlParams.get('collegeName')

  const columns = useMemo(
    () => [
      {
        id: 'candidate',
        header: collegeName,
        columns: [
          {
            accessorKey: 'levelTwoId',
            header: 'level',
            size: 100,
            enableEditing: false,
            isVisible: false,
          },
          {
            accessorKey: 'candidateName',
            header: 'Candiate Name',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => <div className='mr-3'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => (
              <div className='mr-4'>
                {cell.getValue()}
              </div>
            ),
            Header: ({ column }) => (
              <div className='ml-8'>
                {column.columnDef.header}
              </div>
            ),
          },
          
          {
            accessorKey: 'problemStatement',
            header: 'Problem Statement',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-14'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'processWorkflow',
            header: 'Process Workflow',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'contentTotal',
            header: 'Content Total',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'techStacks',
            header: 'Tech Stacks',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'recommendedSolution',
            header: 'Recommended Solution',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'languageAndGrammar',
            header: 'Language & Grammar',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-16'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'logicalFlow',
            header: 'Logical Flow',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'presentationTotal',
            header: 'Presentation Total',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors }
                  delete newValidationErrors[cell.column.id]
                  setValidationErrors(newValidationErrors)
                }
              },
            }),
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'totalScore',
            header: 'Total Score',
            enableSorting: true,
            enableColumnFilter: true,
            enableEditing: false,

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
    data,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: true,
    enableRowSelection: true,
    enableEditing: true,
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        '&:hover': {
          backgroundColor: row.original.selectedForNextStage
            ? 'rgba(0, 135, 213, 0.2)'
            : undefined,
        },
      },
    }),
    onEditingRowSave: async ({ table, values, row }) => {
      const errors = validate(values)
      if (Object.keys(errors).length) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({})

      try {
        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment/updateLevelTwo`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          },
        )
        if (!response.ok) {
          setSnackbar({ open: true, message: 'Failed to update candidate', severity: 'error' });

          throw new Error('Failed to update candidate')
        } else {
          setSnackbar({ open: true, message: 'Edited successfully', severity: 'success' });
          setx(!x);
        }
        table.setEditingRow(null)
      } catch (error) {
        console.error(error)
      }
    },
    onEditingRowCancel: () => {
      setValidationErrors({})
    },
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

    renderTopToolbar: ({ table }) => {
      const [hasSelectedRows, setHasSelectedRows] = useState(false)

      const handleActivate = async () => {
        let arr = []
        table.getSelectedRowModel().flatRows.map(row => {
          arr.push(row.original)
        })
        const response = await fetch(
          `${tanBaseUrl}/cpm2/assessment/selectLevelTwo`,
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
        table.toggleAllRowsSelected(false)
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
            Design Exercise
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
                  Select for Stage 3
                </Button>
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
                  ? `${count} candidate selected successfully for stage 3`
                  : `${count} candidates selected successfully for stage 3`}
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
  );
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom'

const CandidatesAssesmentsStage2 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
)

export default CandidatesAssesmentsStage2
