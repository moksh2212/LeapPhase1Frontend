import { useState, useEffect, useMemo } from 'react'
import Modal from '@mui/material/Modal'
import { Label, Select } from 'flowbite-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
//MRT Imports
import { AddCandidates } from './AddCandidates'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'
import { mkConfig, generateCsv, download } from 'export-to-csv'
//Material UI Imports
import {
  Alert,
  Button,
  ButtonGroup,
  Snackbar,
  lighten,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Tooltip,
} from '@mui/material'

const Example = () => {
  const [error, setError] = useState()
  const [data, setData] = useState([])
  const [ekYear, setEkYear] = useState('')
  const [ekYearOptions, setEkYearOptions] = useState([])
  const [filteredCandidateList, setFilteredCandidateList] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  const [openAddCandidates, setOpenAddCandidates] = useState(false)

  const [text, setText] = useState('')
  const phoneRegex = /^[0-9]{10}$/
  const aadhaarRegex = /^[0-9]{12}$/
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/
  const [openSnackbar, setOpenSnackbar] = useState(null)

  const token = useSelector(state => state.user.token)
  const canBaseUrl = process.env.BASE_URL2
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete Selected</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        <Button onClick={handleDeactivate} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const handleDeactivate = () => {
    table.getSelectedRowModel().flatRows.map(async row => {
      setIsLoading(true)
      setError(null)
      setOpenSnackbar(null)
      //alert('deactivating ' + row.getValue('name'))
      const response = await fetch(
        `${canBaseUrl}/candidates/${row.getValue('candidateId')}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (response.ok) {
        setData(prevCandidates =>
          prevCandidates.filter(
            Candidates =>
              Candidates.candidateId !== row.getValue('candidateId'),
          ),
        )
        setOpenSnackbar('Candidate deleted successfully!')
        setIsLoading(false)
      }
    })
  }
  useEffect(() => {
    console.log('hello')
    fetchCandidateList()
  }, [])
  useEffect(() => {
    if (!ekYear) {
      setFilteredCandidateList(data)
      return
    }

    const filteredList = data.filter(candidate => {
      if (!candidate.ekYear) return false
      const requiredYear = candidate.ekYear
      return requiredYear.includes(ekYear)
    })
    setFilteredCandidateList(filteredList)
  }, [ekYear, data])

  useEffect(() => {
    const distinctEkYears = [
      ...new Set(data.map(candidate => candidate.ekYear).filter(Boolean)),
    ]
    setEkYearOptions(distinctEkYears)
  }, [data])

  const csvConfig = mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })

  const handleExportRows = rows => {
    const rowData = rows.map(row => row.original)
    const csv = generateCsv(csvConfig)(rowData)
    download(csvConfig)(csv)
  }

  const handleExportData = () => {
    const csv = generateCsv(csvConfig)(data)
    download(csvConfig)(csv)
  }

  const handleUpload = async formData => {
    setOpenAddCandidates(false)
    console.log(formData)
    try {
      const response = await fetch(
        `${canBaseUrl}/candidates/upload/${formData.get('collegeId')}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
      console.log(response)
      if (response.ok) {
        setOpenSnackbar('File uploaded successfully.')
        window.location.reload()
      } else {
        setError('Failed to upload file.')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
    }
  }
  const style = {
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'green',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
    borderRadius: '20px',
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
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }

  // Make API call to fetch data
  const fetchCandidateList = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${canBaseUrl}/candidates/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const jsonData = await response.json()
      setData(jsonData)
      setFilteredCandidateList(jsonData)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      console.error('Error fetching data:', error)
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 'candidate', //id used to define `group` column
        header: 'Candidate',
        columns: [
          {
            accessorKey: 'candidateId', //hey a simple column for once
            header: 'Candiate Id',
            size: 100,
            enableEditing: false,
          },
          {
            accessorKey: 'candidateName', //accessorFn used to join multiple data into a single cell
            header: 'Name',
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'ekYear', //hey a simple column for once
            header: 'EK Year',
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'candidateCollege', //hey a simple column for once
            header: 'College Name',
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'department', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            filterVariant: 'select',
            enableSorting: false,
            header: 'Branch',
            size: 100,
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
            accessorKey: 'phoneNumber', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableColumnFilter: false,
            header: 'Phone Number',
            enableSorting: false,
            type: 'text',
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!phoneRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid phone number',
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
            accessorKey: 'alternateNumber', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: 'Alt Phone Number',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!phoneRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid phone number',
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
            accessorKey: 'tenthPercent',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            enableColumnFilter: false,
            header: 'Tenth Percent',
            size: 100,
            //custom conditional format and styling
            Cell: SalaryCell,
            enableEditing: false,
          },
          {
            accessorKey: 'twelthPercent',
            // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
            enableColumnFilter: false,
            filterFn: 'between',
            header: 'Twelth Percent',
            size: 50,
            //custom conditional format and styling
            Cell: SalaryCell,
            enableEditing: false,
          },
          {
            accessorKey: 'cgpau', //hey a simple column for once
            header: 'CGPA U',
            filterVariant: 'range',
            size: 100,
            enableEditing: false,
          },
          {
            accessorKey: 'cgpam', //hey a simple column for once
            header: 'CGPA M',
            filterVariant: 'range',
            size: 100,
            enableEditing: false,
          },
          {
            accessorKey: 'currentLocation', //hey a simple column for once
            header: 'Current Location',
            enableSorting: false,
            filterVariant: 'autocomplete',
            size: 100,
          },
          {
            accessorKey: 'permanentAddress', //hey a simple column for once
            header: 'Permanent Address',
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'panNumber', //hey a simple column for once
            header: 'Pan Number',
            enableSorting: false,
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!panRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid PAN number',
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
            accessorKey: 'aadhaarNumber', //hey a simple column for once
            header: 'Aadhaar Number',
            enableSorting: false,
            size: 100,
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!aadhaarRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid Aadhaar number',
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
            accessorKey: 'fatherName', //hey a simple column for once
            header: 'Father Name',
            enableSorting: false,
            enableColumnFilter: false,
            size: 100,
          },
          {
            accessorKey: 'motherName', //hey a simple column for once
            header: 'Mother Name',
            enableSorting: false,
            enableColumnFilter: false,
            size: 100,
          },
          {
            accessorKey: 'dob', //convert to Date for sorting and filtering
            id: 'dob',
            enableSorting: false,
            header: 'DOB',
            filterVariant: 'date',
            muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.id],
              helperText: validationErrors[cell.id],
              onChange: e => {
                const newValue = e.target.value
                if (!dobRegex.test(newValue)) {
                  setValidationErrors(prev => ({
                    ...prev,
                    [cell.id]: 'Invalid date format. Use DD.MM.YYYY',
                  }))
                } else {
                  const [day, month, year] = newValue.split('.')
                  const date = dayjs(`${year}-${month}-${day}`)
                  const currentDate = dayjs()
                  const minDate = currentDate.subtract(120, 'years')
                  if (date.isAfter(currentDate)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      [cell.id]: 'Date of birth cannot be in the future.',
                    }))
                  } else if (date.isBefore(minDate)) {
                    setValidationErrors(prev => ({
                      ...prev,
                      [cell.id]: 'Date of birth is too far in the past.',
                    }))
                  } else {
                    setValidationErrors(prev => {
                      const updatedErrors = { ...prev }
                      delete updatedErrors[cell.id]
                      return updatedErrors
                    })
                  }
                }
              },
            }),
            //render Date as a string
            Header: DateHeader, //custom header markup
            muiFilterTextFieldProps: {
              sx: {
                minWidth: '250px',
              },
            },
          },
        ],
      },
    ],
    [validationErrors],
  )

  const table = useMaterialReactTable({
    columns,
    data: filteredCandidateList, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableSelectAll: true,
    selectAllMode: 'all',
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    isLoading,
    enableRowActions: true,
    enableRowSelection: true,
    state: { isLoading },
    enableEditing: true,
    muiTableHeadCellProps: {
      align: 'center',
    },
    muiTableBodyCellProps: {
      align: 'center',
    },
    onEditingRowSave: async ({ table, values }) => {
      //validate data alternateNumber
      const errors = {}
      if (!emailRegex.test(values.email)) {
        errors.email = 'Invalid email'
      }
      if (!phoneRegex.test(values.phoneNumber)) {
        errors.phoneNumber = 'Invalid phone number'
      }
      if (!phoneRegex.test(values.alternateNumber)) {
        errors.alternateNumber = 'Invalid phone number'
      }
      if (!aadhaarRegex.test(values.aadhaarNumber)) {
        errors.aadhaarNumber = 'Invalid Aadhaar number'
      }
      if (!panRegex.test(values.panNumber)) {
        errors.panNumber = 'Invalid PAN number'
      }
      if (!dobRegex.test(values.dob)) {
        errors.dob = 'Invalid DOB'
      }

      if (Object.keys(errors).length) {
        setValidationErrors(errors)
        if (errors.email) {
          setError('Invalid email')
          setText('Invalid email')
        } else if (errors.phoneNumber || errors.alternateNumber) {
          setError('Invalid phone number')
          setText('Invalid phone number')
        } else if (errors.aadhaarNumber) {
          setError('Invalid Aadhaar number')
          setText('Invalid Aadhaar number')
        } else if (errors.panNumber) {
          setError('Invalid PAN number')
          setText('Invalid PAN number')
        } else if (errors.dob) {
          setError('Invalid dob number')
          setText('Invalid dob number')
        }
        return
      }

      try {
        const response = await fetch(
          `${canBaseUrl}/candidates/${values.candidateId}`,
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
          console.log(text)
          throw new Error('Failed to update candidate')
        } else {
          setOpenSnackbar('Edited successfully')
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
      const [openConvertModal, setOpenConvertModal] = useState(false)
      // Update the state variable based on the selected rows
      const selectedRowCount = table.getSelectedRowModel().flatRows.length
      useEffect(() => {
        setHasSelectedRows(selectedRowCount > 0)
      }, [selectedRowCount])

      return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300'>
          <div className='flex justify-between mb-2 rounded-md'>
            <h2 className={`text-2xl text-[#0087D5] font-bold my-auto p-2`}>
              Candidates
            </h2>
            <div className='my-auto mr-2'></div>
          </div>
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
              {/* import MRT sub-components */}
              <MRT_GlobalFilterTextField table={table} />
              <MRT_ToggleFiltersButton table={table} />
              <div>
                <div className='mb-0 block'>
                  <Label htmlFor='selectedto' value='Select EK Year' />
                </div>
                <Select
                  id='ekYearFiltered'
                  value={ekYear}
                  onChange={e => setEkYear(e.target.value)}
                  size='sm'
                >
                  <option value=''>All</option>
                  {ekYearOptions.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Select>
              </div>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  color='error'
                  disabled={selectedRowCount === 0}
                  onClick={() => {
                    setOpenDeleteModal(true)
                  }}
                  variant='contained'
                >
                  Delete
                </Button>
                <Button
                  color='success'
                  onClick={() => {
                    setOpenAddCandidates(true)
                  }}
                  variant='contained'
                >
                  Add Candidates
                </Button>
                <Box
                  sx={{
                    display: 'flex',
                    gap: '16px',
                    padding: '8px',
                    flexWrap: 'wrap',
                  }}
                >
                  <Button
                    disabled={
                      !table.getIsSomeRowsSelected() &&
                      !table.getIsAllRowsSelected()
                    }
                    //only export selected rows
                    onClick={() =>
                      handleExportRows(table.getSelectedRowModel().rows)
                    }
                    startIcon={<FileDownloadIcon />}
                  >
                    Export Selected Rows
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* Render the snackbar conditionally */}
          {hasSelectedRows && (
            <Snackbar
              open={hasSelectedRows}
              message='Rows are selected'
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
          )}
          <Modal
            open={openConvertModal}
            onClose={() => setOpenConvertModal(false)}
            aria-labelledby='convert-modal-title'
            aria-describedby='convert-modal-description'
          >
            <Box sx={style}>
              <Typography id='convert-modal-title' variant='h6' component='h2'>
                Convert to Talent
              </Typography>
              <Typography id='convert-modal-description' sx={{ mt: 2 }}>
                Successfully converted to Talent.
              </Typography>
            </Box>
          </Modal>
          <Snackbar
            open={!!openSnackbar} // Convert openSnackbar to a boolean value
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
          {openAddCandidates && (
            <AddCandidates
              openModal={openAddCandidates}
              setOpenModal={setOpenAddCandidates}
              handleUpload={handleUpload}
            />
          )}
          {renderDeleteModal()}
        </div>
      )
    },
  })
  return <MaterialReactTable table={table} />
}

//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useSelector } from 'react-redux'

const ExampleWithLocalizationProvider = () => (
  //App.tsx or AppProviders file
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
)

export default ExampleWithLocalizationProvider
