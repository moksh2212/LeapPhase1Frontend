import { useState, useEffect, useMemo } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import {
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';
import PropTypes from 'prop-types';
import { Button, Snackbar, lighten } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress'

const canBaseUrl = process.env.BASE_URL2;
const tanBaseUrl = process.env.BASE_URL2;

const NameCell = ({ renderedCellValue }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <span>{renderedCellValue}</span>
  </Box>
);

NameCell.propTypes = {
  renderedCellValue: PropTypes.node.isRequired,
  row: PropTypes.shape({
    original: PropTypes.shape({}).isRequired,
  }).isRequired,
};

const SalaryCell = ({ cell }) => (
  <Box
    component='span'
    sx={(theme) => ({
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
);

SalaryCell.propTypes = {
  cell: PropTypes.shape({
    getValue: PropTypes.func.isRequired,
  }).isRequired,
};

const DateHeader = ({ column }) => <em>{column.columnDef.header}</em>;

DateHeader.propTypes = {
  column: PropTypes.shape({
    columnDef: PropTypes.shape({
      header: PropTypes.node.isRequired,
    }).isRequired,
  }).isRequired,
};

const AssesTable = () => {
  const [data, setData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const token = useSelector((state) => state.user.token);
  const [count, setCount] = useState(0);
  const [x, setx] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${canBaseUrl}/cpm2/assessment/getAllAssessments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let jsonData = await response.json();

        jsonData = jsonData.filter(
          (assessment) => assessment && assessment.assessmentLevelThree,
          (assessment) => assessment && assessmecountnt.assessmentLevelThree,
        );
        const arr = jsonData.map((assessment) => assessment.assessmentLevelThree);
        setData(arr);
        setLoading(false)
        console.log(jsonData);
      } catch (error) {
       

        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [token,x]);

  const validate = (values) => {
    const errors = {};
    const requiredFields = ['problemSolving', 'analyticalSkills'];

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

  const urlParams = new URLSearchParams(window.location.search);
  const collegeName = urlParams.get('collegeName');

  const columns = useMemo(
    () => [
      {
        id: 'candidate',
        header: collegeName,
        columns: [
          {
            accessorKey: 'levelThreeId',
            header: 'Level',
            size: 100,
            enableEditing: false,
            isVisible: false,
            Cell: ({ cell }) => <div className='ml-3'>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'candidateName',
            header: 'Candidate Name',
            size: 100,
            enableEditing: false,
            Cell: ({ cell }) => <div className=''>{cell.getValue()}</div>,
          },
          {
            accessorKey: 'email',
            header: 'Email',
            size: 100,
            enableEditing: false,
            Header: ({ column }) => (
              <div className='ml-10'>
                {column.columnDef.header}
              </div>
            ),
          },
          {
            accessorKey: 'problemSolving',
            header: 'Problem Solving',
            enableColumnFilter: true,
            enableSorting: true,
            size: 100,
            Cell: ({ cell }) => <div className='ml-11'>{cell.getValue()}</div>,
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
            accessorKey: 'analyticalSkills',
            header: 'Analytical Skills',
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
    [validationErrors, collegeName],
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
        '&:hover': {
          backgroundColor: row.original.selectedForNextStage
            ? 'rgba(0, 135, 213, 0.2)'
            : undefined,
        },
      },
    }),
    onEditingRowSave: async ({ table, values }) => {
      const errors = validate(values);
      if (Object.keys(errors).length) {
        setValidationErrors(errors);
        return;
      }
      setValidationErrors({});
      try {
        const response = await fetch(
          `${canBaseUrl}/cpm2/assessment/updateLevelThree`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(values),
          },
        );
        if (!response.ok) {
          throw new Error('Failed to update candidate');
        } else {
          setx(!x)
          setSnackbar({ open: true, message: 'Edited successfully', severity: 'success' });
        }
        table.setEditingRow(null);
      } catch (error) {
        console.error(error);
        setSnackbar({ open: true, message: 'Failed to update candidate', severity: 'error' });
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
        const selectedRows = table.getSelectedRowModel().flatRows.map((row) => row.original);

        const response = await fetch(
          `${tanBaseUrl}/cpm2/assessment/selectLevelThree`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(selectedRows),
          },
        );
        setCount(table.getSelectedRowModel().rows.length);

        setData((prevData) =>
          prevData.map((row) => ({
            ...row,
            selectedForNextStage: selectedRows.some((selectedRow) => selectedRow.id === row.id),
          })),
        );

        setSnackbar({
          open: true,
          message: `${table.getSelectedRowModel().rows.length} candidate${table.getSelectedRowModel().rows.length > 1 ? 's' : ''} selected successfully for stage 4`,
          severity: 'success',
        });
        table.toggleAllRowsSelected(false);
      };

      const selectedRowCount = table.getSelectedRowModel().flatRows.length;
      useEffect(() => {
        setHasSelectedRows(selectedRowCount > 0);
      }, [selectedRowCount]);

      return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbar-thumb-slate-300'>
          <h2 className='text-2xl text-[#0087D5] font-bold mb-3 flex items-center'>
            <Button
              color='primary'
              onClick={() => navigate(-1)} // Navigate to the previous page
              style={{ width: '50px' }}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            Stage 3
          </h2>
          <Box
            sx={(theme) => ({
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
                  disabled={selectedRowCount === 0}
                  onClick={handleActivate}
                  variant='contained'
                >
                  Select for Stage 4
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
      );
    },
  });

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
};

const CandidatesAssesmentsStage3 = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AssesTable />
  </LocalizationProvider>
);

export default CandidatesAssesmentsStage3;
