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
import CircularProgress from '@mui/material/CircularProgress'

import { Button, Snackbar, lighten } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
const canBaseUrl = process.env.BASE_URL2
const tanBaseUrl = process.env.BASE_URL2

const urlParams = new URLSearchParams(window.location.search)
const collegeName = urlParams.get('collegeName')

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
  const navigate = useNavigate()
  const [x, setx] = useState(0)
  const [loading, setLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: '',
  })

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false })
  }
  const transformAssessmentData = jsonData => {
    const assessmentList = jsonData || []

    return assessmentList.map(candidate => {
      return {
        name: candidate.candidateName,
        email: candidate.email,
        levelOne: candidate.assessmentLevelOne
          ? candidate.assessmentLevelOne.totalScore
          : 'Not Assessed',
        levelTwo: candidate.assessmentLevelTwo
          ? candidate.assessmentLevelTwo.totalScore
          : 'Not Assessed',
        levelThree: candidate.assessmentLevelThree
          ? candidate.assessmentLevelThree.totalScore
          : 'Not Assessed',
        levelFour: candidate.assessmentLevelFour
          ? candidate.assessmentLevelFour.totalScore
          : 'Not Assessed',
        levelFive: candidate.assessmentLevelFive
          ? candidate.assessmentLevelFive.hrScore
          : 'Not Assessed',
        levelFinal: candidate.assessmentLevelFinal
          ? 'Selected'
          : 'Not Selected',
      }
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const collegeId = urlParams.get('collegeId')
        setLoading(true)

        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment/getAllAssessmentByEkYear?ekYear=2024`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        let jsonData = await response.json()
        console.log(jsonData)
        const transformedData = transformAssessmentData(jsonData)

        setData(transformedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setSnackbar({
          open: true,
          message: 'Error fetching data',
          severity: 'error',
        })
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
  console.log(collegeName)
  const columns = useMemo(
    () => [
      {
        id: collegeName,
        header: collegeName,
        columns: [
          {
            accessorKey: 'name',
            header: 'Candiate Name',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => <div className='ml-6'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => <div className=' '>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelOne',
            header: 'Level One',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-3'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelTwo',
            header: 'Level Two',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-4'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelThree',
            header: 'Level Three',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-4'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelFour',
            header: 'Level Four',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,

            Cell: ({ cell }) => <div className='ml-4'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelFive',
            header: 'Level Five',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,

            Cell: ({ cell }) => <div className='ml-4'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'levelFinal',
            header: 'Final',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,

            Cell: ({ cell }) => <div className='ml-4'>{cell.getValue()}</div>,
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
    enableRowActions: false,
    enableRowSelection: false,
    enableEditing: false,
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
          throw new Error('Failed to update candidate')
        } else {
          alert('Edited successfully')
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
        const formData = new FormData()
        const urlParams = new URLSearchParams(window.location.search)
        const collegeId = urlParams.get('collegeId')

        formData.append('collegeId', collegeId)

        try {
          const response = await fetch(
            `${tanBaseUrl}/cpm2/assessment/loadCandidates`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`, // No Content-Type header required
              },
              body: formData,
            },
          )

          if (!response.ok) {
            // Handle error response
            console.error(
              'Failed to fetch:',
              response.status,
              response.statusText,
            )

            return
          }

          // Process the response if needed
          setx(!x)
          setOpen(true)
        } catch (error) {
          console.error('Error during fetch:', error)
        }
      }

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
                  onClick={handleActivate}
                  variant='contained'
                >
                  Add Candidates
                </Button>
              </Box>
            </Box>
          </Box>
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
                Candidate Loaded Successfully!
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
  )
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom'

const CandidatesAssesmentsStage0 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
)

export default CandidatesAssesmentsStage0
