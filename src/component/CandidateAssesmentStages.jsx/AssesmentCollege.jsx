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
  Snackbar,
  Tooltip,
} from '@mui/material'
import { useSelector } from 'react-redux'

//Module completed testing done

const AssesmentCollege = () => {
  const [collegeList, setCollegeList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()



  const [collegeIdToDelete, setCollegeIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const token = useSelector(state => state.user.token)
  const baseUrl = process.env.BASE_URL2
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
    await deleteCollege(collegeIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete College</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this college?</p>
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
      <DialogTitle>Delete Colleges</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected colleges?</p>
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
    setTimeout(() => {
      const fetchData = async () => {
        setIsLoading(true)
        try {
          const response = await fetch(`${baseUrl}/admin/viewData`, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          })
          const data = await response.json()
          setCollegeList(data)
        } catch (error) {
          console.error('Error fetching data:', error)
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }, 1000)
  }, [])

  const createCollege = async newCollege => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${baseUrl}/admin/insertCollegeData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(newCollege),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setValidationErrors({})
        setCollegeList(prevColleges => [...prevColleges, data])
        setOpenSnackbar('College added successfully!')
      }
    } catch (error) {
      console.error('Error creating college:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateCollege = async collegeToUpdate => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/admin/updateData/${collegeToUpdate.collegeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(collegeToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setValidationErrors({})
        setCollegeList(prevColleges =>
          prevColleges.map(college =>
            college.collegeId === data.collegeId ? data : college,
          ),
        )
        setOpenSnackbar('College updated successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error updating college:', error)
      console.error('Error updating collegellllll')
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCollege = async collegeId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${baseUrl}/admin/deleteData/${collegeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${token}`,
        },
      })

      if (response.ok) {
        setCollegeList(prevColleges =>
          prevColleges.filter(college => college.collegeId !== collegeId),
        )
        setOpenSnackbar('College deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting college:', error)
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
        await deleteCollege(row.collegeId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete college(s): ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} college(s) deleted successfully.`)
  }
const columns = useMemo(
  () => [
    {
      accessorKey: 'collegeId',
      header: 'College Id',
      enableEditing: false,
      size: 150,
    },
    {
      accessorKey: 'collegeName',
      header: 'College Name',
      enableEditing: true,
      size: 150,
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.collegeName,
        helperText: validationErrors?.collegeName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            collegeName: undefined,
          }),
        onBlur: event => {
          const { value } = event.target;
          if (!value) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              collegeName: 'College Name cannot be empty',
            }));
          }
        },
      },
    },
    {
      accessorKey: 'location',
      header: 'Location',
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
          const { value } = event.target;
          if (!value) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              location: 'Location cannot be empty',
            }));
          }
        },
      },
    },
    
    {
      accessorKey: 'tpoName',
      header: 'TPO Contact Name',
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.tpoName,
        helperText: validationErrors?.tpoName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            tpoName: undefined,
          }),
        onBlur: event => {
          const { value } = event.target;
          if (!value) {
            setValidationErrors(prevErrors => ({
              ...prevErrors,
              tpoName: 'TPO Name cannot be empty',
            }));
          }
        },
      },
    },
    {
      accessorKey: 'viewAssessment',
      header: 'View Assessment',
      size: 150,
      Cell: ({ row }) => (
        <div >
        <Button
          onClick={() => {
            const collegeId = row.original.collegeId;
            window.location.href = `?tab=candidate-assessment&collegeId=${collegeId}`;
          }}
           variant='contained'
        >
          View Assessment
        </Button>
        </div>
      ),
    },
  ],
  [validationErrors]
);


  const table = useMaterialReactTable({
    columns,
    data: collegeList,
    enableRowSelection: false,
    initialState: { columnVisibility: { collegeId: false } },
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: false,
    enableRowActions: false,
    onRowSelectionChange: setRowSelection,

    state: { rowSelection, isLoading },
    getRowId: row => row.collegeId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    muiSkeletonProps: {
      animation: 'pulse',
      height: 28,
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),

    // onCreatingRowSave: async ({ values, table }) => {
    //   setValidationErrors({})
    //   await createCollege(values)
    //   table.setCreatingRow(null)
    // },

    // onEditingRowSave: async ({ values, table }) => {
    //   setValidationErrors({})
    //   console.log(values)
    //   await updateCollege(values)
    //   table.setEditingRow(null)
    // },

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

      setValidationErrors({}) // Clear any previous errors
      await createCollege(values)
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
      await updateCollege(values)
      table.setEditingRow(null)
    },


    renderRowActionMenuItems: ({ row, table, closeMenu }) => (
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box className='flex items-center'>
          <Tooltip title='Edit' className='flex gap-1'>
            <Button
              onClick={() => {
                table.setEditingRow(row)
                closeMenu()
              }}
            >
              <p className='text-[12px] font-semibold'>Edit</p>
            </Button>
          </Tooltip>
        </Box>
        <Box className='flex items-center'>
          <Tooltip title='Delete' className='flex gap-1'>
            <Button
              color='error'
              onClick={() => {
                setCollegeIdToDelete(row.original.collegeId)
                setOpenDeleteModal(true)
                closeMenu()
              }}
            >
              <p className='text-[12px] font-semibold'>Delete</p>
            </Button>
          </Tooltip>
        </Box>
      </Box>
    ),

  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-2xl text-[#0087D5] font-bold mb-3`}>
        Colleges
      </h2>

      <MaterialReactTable
        table={table}
        updateCollege={updateCollege}
        createCollege={createCollege}
      />

      {renderDeleteModal()}
      {renderDeleteRowsModal()}
      <Snackbar
        open={openSnackbar}
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

export default AssesmentCollege
