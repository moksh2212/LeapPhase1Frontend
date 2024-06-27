import { useState, useEffect, useMemo } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import PropTypes from 'prop-types';

import {
  Button,
  Snackbar,
  lighten,
} from '@mui/material';

const canBaseUrl = process.env.BASE_URL;
const tanBaseUrl = process.env.BASE_URL;

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
  const [data, setData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${canBaseUrl}/cpm2/assessment/getAllAssessments`);
        let jsonData = await response.json();
  
        jsonData = jsonData.filter(assessment => assessment && assessment.assessmentLevelTwo);
  
        const arr = jsonData.map(assessment => assessment.assessmentLevelTwo);
  
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
      'contentTotal', 
      'presentationTotal', 
      'problemStatement', 
      'processWorkflow', 
      'techStacks', 
      'recommendedSolution', 
      'languageAndGrammar', 
      'logicalFlow'
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
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 100,
            enableEditing: false,
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
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
                  const newValidationErrors = { ...validationErrors };
                  delete newValidationErrors[cell.column.id];
                  setValidationErrors(newValidationErrors);
                }
              },
            }),
          },
          {
            accessorKey: 'totalScore', 
            header: 'Total Score',
            enableSorting: true,
            enableColumnFilter: true,
            enableEditing: false,

            size: 100,
          },
        ],
      },
    ],
    [validationErrors],
  );

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
        backgroundColor: row.original.selectedForNextStage ? 'rgba(0, 135, 213, 0.1)' : undefined,
        color: row.original.selectedForNextStage ? '#0087D5' : undefined,
        '&:hover': {
          backgroundColor: row.original.selectedForNextStage ? 'rgba(0, 135, 213, 0.2)' : undefined,
        },
      },
    }),
    onEditingRowSave: async ({ table, values, row }) => {
      const errors = validate(values);
      if (Object.keys(errors).length) {
        setValidationErrors(errors);
        return;
      }
    
      setValidationErrors({});
    
    
      try {
        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment/updateLevelTwo`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          },
        );
        if (!response.ok) {
          throw new Error('Failed to update candidate');
        } else {
          alert('Edited successfully');
        }
        table.setEditingRow(null);
      } catch (error) {
        console.error(error);
      }
    },
    onEditingRowCancel: () => {
      setValidationErrors({});

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
          `${tanBaseUrl}/cpm2/assessment/selectLevelTwo`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(arr),
          }
        );
        setData(prevData => prevData.map(row => ({
          ...row,
          selectedForNextStage: arr.some(selectedRow => selectedRow.id === row.id)
        })));
        setOpen(true);
      };

      const selectedRowCount = table.getSelectedRowModel().flatRows.length;
      useEffect(() => {
        setHasSelectedRows(selectedRowCount > 0);
      }, [selectedRowCount]);

      return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300">
          <div className='flex justify-between mb-2 rounded-md'>
            <h2 className={`text-2xl text-[#0087D5] font-bold my-auto p-2`}>
              Candidates selected for Stage 2
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
              message="Rows are selected"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            />
          )}
          {open && (
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
                anchorOrigin={{ vertical: "top", horizontal: "top" }}
              >
                {table.getSelectedRowModel().rows.length === 1
                  ? `${table.getSelectedRowModel().rows.length} candidate selected successfully for stage 3`
                  : `${table.getSelectedRowModel().rows.length} candidates selected successfully for stage 3`}
              </Alert>
            </Snackbar>
          )}
        </div>
      );
    },
  });

  return <MaterialReactTable table={table} />;
}

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const CandidatesAssesmentsStage2 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
);

export default CandidatesAssesmentsStage2;
