import { useEffect, useMemo, useState } from 'react'

import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  IconButton,
  Snackbar,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'

//Module completed testing done
const baseUrl = "http://192.168.0.147:8080";
const Trainers = () => {
  const [trainerList, setTrainerList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()


  const [trainerIdToDelete, setTrainerIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const token = useSelector(state=>state.user.token)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }

  const handleDelete = async () => {
    await deleteTrainer(trainerIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete trainer</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this trainer?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        <Button onClick={handleDelete} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const renderDeleteRowsModal = () => (
    <Dialog
      open={openDeleteRowsModal}
      onClose={() => setOpenDeleteRowsModal(false)}
    >
      <DialogTitle>Delete trainers</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected trainers?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={handleDeleteSelectedRows} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/api/trainers/getAll`,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        )
        const data = await response.json()
        setTrainerList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const createTrainer = async newTrainer => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      newTrainer.skills = newTrainer.skills.split(',').map(skill => skill.trim());
      const response = await fetch(`${baseUrl}/api/trainers/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(newTrainer),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setValidationErrors({})
        setTrainerList(prevTrainers => [...prevTrainers, data])
        setOpenSnackbar('Trainer added successfully!')
      }
    } catch (error) {
      console.error('Error creating trainer:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTrainer = async trainerToUpdate => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      if (typeof trainerToUpdate.skills === 'string') {
        trainerToUpdate.skills = trainerToUpdate.skills.split(',').map(skill => skill.trim());
      }
      const response = await fetch(
        `${baseUrl}/api/trainers/update/${trainerToUpdate.trainerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(trainerToUpdate),
        },
      );
  
      if (response.ok) {
        const data = await response.json();
        setValidationErrors({});
        setTrainerList(prevTrainers =>
          prevTrainers.map(trainer =>
            trainer.trainerId === data.trainerId ? data : trainer,
          ),
        );
        setOpenSnackbar('Trainer updated successfully!');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred');
      }
    } catch (error) {
      console.error('Error updating trainer:', error);
      //setError(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  const deleteTrainer = async trainerId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${baseUrl}/api/trainers/delete/${trainerId}`, {
        method: 'DELETE',
        headers:{
          Authorization: `Basic ${token}`,
        }
      })

      if (response.ok) {
        setTrainerList(prevTrainers =>
          prevTrainers.filter(trainer => trainer.trainerId !== trainerId),
        )
        setOpenSnackbar('Trainer deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Trainer:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSelectedRows = async () => {
    setOpenSnackbar(null)
    setError(null)
    setIsLoading(true)
    setOpenDeleteRowsModal(false)

    let count = 0
    try {
      for (const row of selectedRows) {
        await deleteTrainer(row.trainerId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete trainer(s): ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} Trainer(s) deleted successfully.`)
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: 'trainerId',
        header: 'Incture ID',
        enableEditing: true,
        size: 150,
      },
      {
        accessorKey: 'trainerName',
        header: 'Trainer Name',
        enableEditing: true,
        enableSorting: false,
        size: 150,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.trainerName,
          helperText: validationErrors?.trainerName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              trainerName: undefined,
            }),

          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                trainerName: 'Trainer Name cannot be empty',
              }))
            }
          },
        },
      },
      {
        accessorKey: 'skills',
        header: 'Skills',
        enableSorting: false,
        Cell: ({ cell }) => cell.getValue().join(', '), // Display skills as comma-separated string
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.skills,
          helperText: validationErrors?.skills,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              skills: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                skills: 'Skills cannot be empty',
              }));
            }
          },
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        enableSorting: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.location,
          helperText: validationErrors?.location,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              location: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                location: 'Location cannot be empty',
              }))
            }
          },
        },
      },
      {
        accessorKey: 'email',
        header: 'Trainer Email',
        enableSorting: false,
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.email,
          helperText: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(value)) {
              setValidationErrors({
                ...validationErrors,
                email: 'Please enter a valid email address.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
        enableSorting: false,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.designation,
          helperText: validationErrors?.designation || '',
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              designation: undefined,
            }),
          onBlur: event => {
            const { value } = event.target;
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                designation: 'Designation cannot be empty.',
              }));
            }
          },
        },
      },
    ],
    [validationErrors],
  )
  const validationRules = {
    trainerName: {
      required: true,
      message: 'Trainer Name cannot be empty',
    },
    region: {
      required: true,
      message: 'Region cannot be empty',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
    designation: {
        required: true,
        message: 'Designation cannot be empty',
      },
  }

  const table = useMaterialReactTable({
    columns,
    data: trainerList,
    enableRowSelection: true,
    initialState: { columnVisibility: { trainerId: true } },
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    onRowSelectionChange: setRowSelection,

    state: { rowSelection },
    getRowId: row => row.trainerId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),

    onCreatingRowSave: async ({ values, table }) => {
      const errors = {}

      Object.entries(values).forEach(([key, value]) => {
        const rule = validationRules[key]
        if (rule) {
          if (rule.required && !value.trim()) {
            errors[key] = `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } field cannot be empty`
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errors[key] = rule.message
          }
        }
      })

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({}) 
      await createTrainer(values)
      table.setCreatingRow(null)
    },

    onEditingRowSave: async ({ values, table }) => {
      const errors = {}

      Object.entries(values).forEach(([key, value]) => {
        const temp = value.toString().trim() // Convert value to string and remove leading/trailing whitespaces
        const rule = validationRules[key]

        if (rule) {
          if (rule.required && temp.length === 0) {
            errors[key] = `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } field cannot be empty`
          } else if (rule.pattern && !rule.pattern.test(value)) {
            errors[key] = rule.message
          }
        }
      })

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        return
      }

      setValidationErrors({})
      await updateTrainer(values)
      table.setEditingRow(null)
    },

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      const hasErrors = columns.some(
        accessorKey => validationErrors[accessorKey],
      )
      return (
        <>
          <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
            Add New Trainer
          </DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            {internalEditComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}

            {columns.map(
              accessorKey =>
                validationErrors[accessorKey] && (
                  <FormHelperText key={accessorKey} error>
                    {validationErrors[accessorKey]}
                  </FormHelperText>
                ),
            )}
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons
              variant='text'
              table={table}
              row={row}
              disabled={hasErrors}
            />
          </DialogActions>
        </>
      )
    },
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => {
      const values = row.original
      const hasErrors = columns.some(
        column =>
          validationRules[column.accessorKey]?.required &&
          !values[column.accessorKey],
      )

      return (
        <>
          <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
            Edit trainer Details
          </DialogTitle>
          <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {internalEditComponents.map((component, index) => (
              <div key={index}>{component}</div>
            ))}

            {columns.map(
              accessorKey =>
                validationErrors[accessorKey] && (
                  <FormHelperText key={accessorKey} error>
                    {validationErrors[accessorKey]}
                  </FormHelperText>
                ),
            )}
          </DialogContent>
          <DialogActions>
            <MRT_EditActionButtons
              variant='text'
              table={table}
              row={row}
              disabled={hasErrors}
            />
          </DialogActions>
        </>
      )
    },

    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title='Edit'>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title='Delete'>
          <IconButton
            color='error'
            onClick={() => {
              setTrainerIdToDelete(row.original.trainerId)
              setOpenDeleteModal(true)
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map(row => row.original)

      return (
        <div className='flex gap-5'>
          <Button
            variant='contained'
            onClick={() => {
              table.setCreatingRow(true)
            }}
          >
            Add New Trainer
          </Button>

          <Button
            variant='contained'
            color='error'
            onClick={() => {
              setSelectedRows(selectedRows)
              setOpenDeleteRowsModal(true)
            }}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      )
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
        Trainer Details
      </h2>
      {isLoading && (
        <div className='flex min-h-[70vh] justify-center items-center'>
          <CircularProgress className='w-full mx-auto my-auto' />
        </div>
      )}
      {!isLoading && (
        <MaterialReactTable
          table={table}
          updateTrainer={updateTrainer}
          createTrainer={createTrainer}
        />
      )}
      {renderDeleteModal()}
      {renderDeleteRowsModal()}
      <Snackbar
        open={!!openSnackbar}
        autoHideDuration={5000}
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
    </div>
  )
}

export default Trainers
