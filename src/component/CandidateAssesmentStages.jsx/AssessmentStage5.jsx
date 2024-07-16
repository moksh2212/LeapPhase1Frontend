import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux'

import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table'
import PropTypes from 'prop-types'

import {
  Button,

  Snackbar,
  lighten,
} from '@mui/material'

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
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const navigate = useNavigate()

  const token = useSelector(state => state.user.token)


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const collegeId = urlParams.get('collegeId');
        const response = await fetch(`${canBaseUrl}/cpm2/assessment/getAssessmentByCollegeId?collegeId=${collegeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let jsonData = await response.json();

        // Filter out any assessments that are null
        jsonData = jsonData.filter(assessment => assessment && assessment.assessmentLevelFive);

        // Extract only the assessmentLevelTwo data
        const arr = jsonData.map(assessment => assessment.assessmentLevelFive);

        setData(arr);
        console.log(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const validate = (values) => {
    const errors = {};
    const requiredFields = [
      'hrScore',

    ];

    requiredFields.forEach((key) => {
      if (values[key] === undefined || values[key] === null || values[key] === '') {
        errors[key] = `${key} is required`;
      } else {
        const numValue = Number(values[key]);
        if (isNaN(numValue)) {
          errors[key] = `${key} must be a number`;
        } else if (numValue > 10) {
          errors[key] = `${key} should not be greater than 10`;
        } else if (numValue < 0) {
          errors[key] = `${key} should not be less than 0`;
        }
      }
    });

    return errors;
  };

  const columns = useMemo(
    () => [
      {
        id: 'candidate',
        header: 'Candidate',
        columns: [
          {
            accessorKey: 'levelFiveId',
            header: 'level',
            size: 100,
            enableEditing: false,
            isVisible: false,
            Cell: ({ cell }) => (
              <div className='ml-2'>
                {cell.getValue()}
              </div>
            ),
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 100,
            enableEditing: false,
          },
          {
            accessorKey: 'candidateName',
            header: 'Candiate Name',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => (
              <div className='ml-11'>
                {cell.getValue()}
              </div>
            ),
          },

          {
            accessorKey: 'hrScore',
            header: 'HR Score',
            enableSorting: true,
            enableColumnFilter: true,
            size: 100,
            muiEditTextFieldProps: ({ cell }) => ({
              error: !!validationErrors[cell.column.id],
              helperText: validationErrors[cell.column.id],
              onFocus: () => {
                if (validationErrors[cell.column.id]) {
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
            Cell: ({ cell }) => (
              <div className='ml-11'>
                {cell.getValue()}
              </div>
            ),
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
          backgroundColor: row.original.selectedForNextStage ? 'rgba(0, 135, 213, 0.2)' : undefined,
        },
      },
    }),
    onEditingRowSave: async ({ table, values }) => {
      const errors = validate(values);
      if (Object.keys(errors).length) {
        setValidationErrors(errors);
        return;
      }
      setValidationErrors({})

      try {
        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment
/updateLevelFive`,
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
      const [hasSelectedRows, setHasSelectedRows] = useState(false);

      const handleActivate = async () => {
        let arr = [];
        table.getSelectedRowModel().flatRows.map((row) => {
          arr.push(row.original);

        });
        const response = await fetch(
          `${tanBaseUrl}/cpm2/assessment
/selectLevelFive`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,

            },
            body: JSON.stringify(arr),
          }
        );
        setData(prevData => prevData.map(row => ({
          ...row,
          selectedForNextStage: arr.some(selectedRow => selectedRow.id === row.id)
        })));
        setCount(table.getSelectedRowModel().rows.length)

        setOpen(true);
        table.toggleAllRowsSelected(false);
      };


      const selectedRowCount = table.getSelectedRowModel().flatRows.length;
      useEffect(() => {
        setHasSelectedRows(selectedRowCount > 0);
      }, [selectedRowCount]);

      return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300">
            <h2 className={`text-2xl text-[#0087D5] font-bold mb-3 flex items-center`}>
            {' '}
            <Button
              color='primary'
              onClick={() => navigate(-1)} // Navigate to the previous page
              style={{ width: '50px' }}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            Behavioural Interview
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
                  Final Selected
                </Button>
                <div>

                </div>
              </Box>
            </Box>
          </Box>
          {hasSelectedRows && (
            <Snackbar
              open={hasSelectedRows}
              message="Rows are selected"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
          )}
          {open && <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert
              onClose={handleClose}
              severity="success"
              variant="filled"
              sx={{ width: '100%' }}
            >
              {count === 1 ? `${count} candiadate selected successfully  ` : `${table.getSelectedRowModel().rows.length} candiadates selected successfully `}
            </Alert>
          </Snackbar>}
        </div>
      )
    },
  })
  return <MaterialReactTable table={table} />
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useNavigate } from 'react-router-dom';

const CandidatesAssesmentsStage5 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
)

export default CandidatesAssesmentsStage5
