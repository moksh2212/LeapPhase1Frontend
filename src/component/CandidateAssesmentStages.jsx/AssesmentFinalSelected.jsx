import { useState, useEffect, useMemo } from 'react'
import Alert from '@mui/material/Alert'
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
// import { Modal, Button, Input} from 'antd'

import { Box, Button, Modal, TextField, FormControl, Typography,Snackbar,lighten } from '@mui/material';
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
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const token = useSelector(state => state.user.token)
  const [count, setCount] = useState(0)
  const [isLOIModalVisible, setIsLOIModalVisible] = useState(false)
  const navigate = useNavigate()
  //const [loiForm] = Form.useForm()
  const [values, setValues] = useState({
    ctc: '',
    fixedPay: '',
    bonus: '',
  });
  const [errors, setErrors] = useState({
    ctc: '',
    fixedPay: '',
    bonus: '',
  });
  const handleChange = (field) => (event) => {
    setValues({ ...values, [field]: event.target.value });
    setErrors({ ...errors, [field]: '' });
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }
  useEffect(() => {
    const fetchData = async () => {
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
          assessment => assessment && assessment.assessmentLevelFinal,
        )

        const arr = jsonData.map(assessment => assessment.assessmentLevelFinal)

        setData(arr)
        console.log(jsonData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

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

  const handleGenerateLOI = async (selectedRows) => {
    const response = await fetch(`${tanBaseUrl}/api/mail/generateLOI`, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedRows),
    });

    if (response.ok) {
      alert('LOI generated successfully');
    } else {
      alert('Failed to generate LOI');
    }
  }

  const handleSendLOI = async (selectedRows) => {
    const response = await fetch(`${tanBaseUrl}/sendLOI`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(selectedRows),
    });

    if (response.ok) {
      alert('LOI sent successfully');
    } else {
      alert('Failed to send LOI');
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 'candidate',
        columns: [
          {
            accessorKey: 'candidateName',
            header: 'Candiate Name',
            size: 80,
            enableEditing: false,
            Cell: ({ cell }) => <div className='ml-14'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 80,
            enableEditing: false,
            Cell: ({ cell }) => <div className='ml-14'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'loiStatus',
            header: 'LOI Status',
            size: 80,
            enableEditing: false,
            Cell: ({ cell }) => <div className='ml-1'>{cell.getValue()}</div>,
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
    enableRowSelection: true, 
    enableEditing: false,
    // layoutMode: 'grid',
    // muiTablePaperProps: {
    //   elevation: 0,
    //   sx: {
    //     maxWidth: '800px',
    //     margin: '0 auto',
    //     borderRadius: '8px',
    //     border: '1px solid #e0e0e0',
    //   },
    // },
    // muiTableProps: {
    //   sx: {
    //     tableLayout: 'fixed',
    //   },
    // },
    // muiTableBodyCellProps: {
    //   sx: {
    //     padding: '16px',
    //     textAlign: 'center', // Center the content horizontally
    //   },
    // },
    // muiTableHeadCellProps: {
    //   sx: {
    //     textAlign: 'center', // Center the header text
    //     marginLeft: '120px',
    //   },
    // },
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
      const [loisGenerated, setLoisGenerated] = useState(false)
      

      const showLOIModal = () => {
        setIsLOIModalVisible(true)
      }
      const handleClose = () => {
        setIsLOIModalVisible(false);
        setErrors({
          ctc: '',
          fixedPay: '',
          bonus: '',
        });
      }
      const handleGenerateLOIClick = () => {
        let hasError = false;
        let newErrors = { ctc: '', fixedPay: '', bonus: '' };
    
        if (!values.ctc) {
          newErrors.ctc = 'CTC is required';
          hasError = true;
        }
        if (!values.fixedPay) {
          newErrors.fixedPay = 'Fixed Pay is required';
          hasError = true;
        }
        if (!values.bonus) {
          newErrors.bonus = 'Bonus Amount is required';
          hasError = true;
        }
    
        if (hasError) {
          setErrors(newErrors);
        } else {
          const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
          handleGenerateLOI(selectedRows);
          setLoisGenerated(true);
          setIsLOIModalVisible(false);
        }
      };

      const handleSendLOIClick = () => {
        const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
        handleSendLOI(selectedRows);
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
            Final Selected
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
                  variant='contained'
                  color='primary'
                  onClick={showLOIModal}
                  disabled={!hasSelectedRows}
                >
                  Generate LOI
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleSendLOIClick}
                  disabled={!hasSelectedRows || !loisGenerated}
                >
                  Send LOI
                </Button>
              </Box>
            </Box>
          </Box>
          {isLOIModalVisible && (
        <Modal
          open={isLOIModalVisible}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" gutterBottom>
              LOI Generation
            </Typography>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Fixed CTC(INR per annum)"
                name="ctc"
                required
                variant="outlined"
                value={values.ctc}
              onChange={handleChange('ctc')}
              error={!!errors.ctc}
              helperText={errors.ctc}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Performance Pay"
                name="performancePay"
                required
                variant="outlined"
                alue={values.fixedPay}
              onChange={handleChange('fixedPay')}
              error={!!errors.fixedPay}
              helperText={errors.fixedPay}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Bonus Amount"
                name="bonus"
                required
                variant="outlined"
                alue={values.bonus}
              onChange={handleChange('bonus')}
              error={!!errors.bonus}
              helperText={errors.bonus}
              />
            </FormControl>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleGenerateLOIClick}>
                Generate
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
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
        </div>
      )
    },
  })

  return (
    <div style={{ padding: '20px' }}>
      <MaterialReactTable table={table} />
    </div>
  )
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom'

const AssesmentFinalSelected = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
)

export default AssesmentFinalSelected
