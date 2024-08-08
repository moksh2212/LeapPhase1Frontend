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

const CollegeTable = () => {
  const [collegeList, setCollegeList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()

  const indStates = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ]

  const selectTier = [
    'Government Tier 1',
    'Government Tier 2',
    'Private Tier 1',
    'Private Tier 2',
    'NIT',
  ]

  const selectRegion = ['North', 'South', 'East', 'West']

  const [collegeIdToDelete, setCollegeIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const token = useSelector(state => state.user.token)
  const baseUrl = process.env.BASE_URL


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
              Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
          Authorization: `Bearer ${token}`,
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
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                collegeName: 'College Name cannot be empty',
              }))
            }
          },
        },
      },
      {
        accessorKey: 'region',
        header: 'Region',
        editVariant: 'select',
        editSelectOptions: selectRegion,
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.region,
          helperText: validationErrors?.region,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              region: undefined,
            }),

          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                region: 'Region cannot be empty',
              }))
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
        accessorKey: 'state',
        header: 'State',
        editVariant: 'select',
        editSelectOptions: indStates,
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              state: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                state: 'State cannot be empty',
              }))
            }
          },
        },
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
        editVariant: 'select',
        editSelectOptions: selectTier,
        muiEditTextFieldProps: {
          required: true,
          select: true,
          error: !!validationErrors?.tier,
          helperText: validationErrors?.tier,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tier: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                tier: 'Tier cannot be empty',
              }))
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
            const { value } = event.target
            if (!value) {
              setValidationErrors(prevErrors => ({
                ...prevErrors,
                tpoName: 'TPO Name cannot be empty',
              }))
            }
          },
        },
      },
      {
        accessorKey: 'primaryEmail',
        header: 'TPO Email',
        muiEditTextFieldProps: {
          type: 'email',
          required: true,
          error: !!validationErrors?.primaryEmail,
          helperText: validationErrors?.primaryEmail,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              primaryEmail: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(value)) {
              setValidationErrors({
                ...validationErrors,
                primaryEmail: 'Please enter a valid email address.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'primaryContact',
        header: 'Primary Contact',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.primaryContact,
          helperText: validationErrors?.primaryContact,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              primaryContact: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!/^\d{10}$/.test(value)) {
              setValidationErrors({
                ...validationErrors,
                primaryContact: 'Primary Contact must be a 10-digit number.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'secondaryContact',
        header: 'Secondary Contact',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.secondaryContact,
          helperText: validationErrors?.secondaryContact,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              secondaryContact: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!/^\d{10}$/.test(value)) {
              setValidationErrors({
                ...validationErrors,
                secondaryContact:
                  'Secondary Contact must be a 10-digit number.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'addressLine1',
        header: 'Address Line 1',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.addressLine1,
          helperText: validationErrors?.addressLine1,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              addressLine1: undefined,
            }),

          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors({
                ...validationErrors,
                addressLine1: 'Address Line 1 can not be empty.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'addressLine2',
        header: 'Address Line 2',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.addressLine2,
          helperText: validationErrors?.addressLine2,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              addressLine2: undefined,
            }),

          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors({
                ...validationErrors,
                addressLine2: 'Address Line 2 can not be empty.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'pinCode',
        header: 'Pin Code',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.pinCode,
          helperText: validationErrors?.pinCode,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              pinCode: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!/^\d{6}$/.test(value)) {
              setValidationErrors({
                ...validationErrors,
                pinCode: 'Pin Code must be a 6-digit number.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'collegeOwner',
        header: 'College Owner',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.collegeOwner,
          helperText: validationErrors?.collegeOwner,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              collegeOwner: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!value) {
              setValidationErrors({
                ...validationErrors,
                collegeOwner: 'College Owner can not be empty.',
              })
            }
          },
        },
      },
      {
        accessorKey: 'compensation',
        header: 'Compensation',
        muiEditTextFieldProps: {
          required: true,
          error: !!validationErrors?.compensation,
          helperText: validationErrors?.compensation,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              compensation: undefined,
            }),
          onBlur: event => {
            const { value } = event.target
            if (!/^\d+$/.test(value)) {
              setValidationErrors({
                ...validationErrors,
                compensation: 'Compensation must be a non-empty integer.',
              })
            }
          },
        },
      },
    ],
    [validationErrors],
  )
  const validationRules = {
    collegeName: {
      required: true,
      message: 'College Name cannot be empty',
    },
    region: {
      required: true,
      message: 'Region cannot be empty',
    },
    location: {
      required: true,
      message: 'Location cannot be empty',
    },
    state: {
      required: true,
      message: 'State cannot be empty',
    },
    tier: {
      required: true,
      message: 'Tier cannot be empty',
    },
    tpoName: {
      required: true,
      message: 'TPO Contact Name cannot be empty',
    },
    primaryEmail: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
    primaryContact: {
      required: true,
      pattern: /^\d{10}$/,
      message: 'Primary Contact must be a 10-digit number',
    },
    secondaryContact: {
      required: true,
      pattern: /^\d{10}$/,
      message: 'Secondary Contact must be a 10-digit number',
    },
    addressLine1: {
      required: true,
      message: 'Address Line 1 cannot be empty',
    },
    addressLine2: {
      required: true,
      message: 'Address Line 2 cannot be empty',
    },
    pinCode: {
      required: true,
      pattern: /^\d{6}$/,
      message: 'Pin Code must be a 6-digit number',
    },
    collegeOwner: {
      required: true,
      message: 'College Owner cannot be empty',
    },
    compensation: {
      required: true,
      pattern: /^\d+$/,
      message: 'Compensation must be a non-empty integer.',
    },
  }

  const table = useMaterialReactTable({
    columns,
    data: collegeList,
    enableRowSelection: true,
    initialState: { columnVisibility: { collegeId: false } },
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    muiTableHeadCellProps: {
      align: 'center',
    },
    muiTableBodyCellProps: {
      align: 'center',
    },
    enableEditing: false,
    enableRowActions: true,
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

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      const hasErrors = columns.some(
        accessorKey => validationErrors[accessorKey],
      )
      return (
        <>
          <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
            Create New College
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
            Edit College Details
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
            disabled={selectedRows.length !== 0}
          >
            Create New College
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
      <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>College Schedules</h2>
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

export default CollegeTable
