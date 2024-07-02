import { useEffect, useMemo, useState } from 'react'
import { AccountCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom'; // Import Link
import  IndividualAssesments  from './IndividualAssesments';
import Modal from '@mui/material/Modal';
import Switch from '@mui/material/Switch';
import { useNavigate } from 'react-router-dom';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton
} from 'material-react-table'
import {
  Alert,
  Box,
  Button,
  Dialog,
  MenuItem,
  ListItemIcon,
  DialogActions,
  Typography,
  lighten,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Snackbar,
  ButtonGroup,
} from '@mui/material'
const style = {
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'green',
  border: '2px solid white',
  boxShadow: 24,
  p: 4,
  borderRadius: '20px'
};
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux';

const TalentTable = () => {
  let navigate = useNavigate();
  const [talentList, setTalentList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()

  const [talentIdToDelete, setTalentIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState([]);
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const tanBaseUrl = process.env.BASE_URL2
  const token = useSelector(state=>state.user.token)
  const handleToggle = () => {
    navigate('/dashboard?tab=assessmenttoogle');
  };
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
    await deleteTalent(talentIdToDelete)
    setOpenDeleteModal(false)
  }

  const renderDeleteModal = () => (
    <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
      <DialogTitle>Delete Talent</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this talent?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting talent with ID:', talentIdToDelete)
            handleDelete()
          }}
          color='error'
        >
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
      <DialogTitle>Delete Talents</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected talents?</p>
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
        const response = await fetch(`${tanBaseUrl}/cpm/talents/alltalent`, {
          headers:{
            Authorization: `Basic ${token}`,
          }
        })
        const data = await response.json()
        setTalentList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const createTalent = async newTalent => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${tanBaseUrl}/cpm/talents/createtalent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify(newTalent),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setValidationErrors({})
        setTalentList(prevTalents => [...prevTalents, data])
        setOpenSnackbar('Talent added successfully!')
      }
    } catch (error) {
      console.error('Error creating talent:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const updateTalent = async talentToUpdate => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/updatetalent/${talentToUpdate.talentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(talentToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setValidationErrors({})
        setTalentList(prevTalents =>
          prevTalents.map(talent =>
            talent.talentId === data.talentId ? data : talent,
          ),
        )
        setOpenSnackbar('Talent updated successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error updating talent:', error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteTalent = async talentId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${tanBaseUrl}/cpm/talents/deletetalent/${talentId}`, {
        method: 'DELETE',
        headers:{
          Authorization: `Basic ${token}`,
        }
      })
  
      if (response.ok) {
        setTalentList(prevTalents =>
          prevTalents.filter(talent => talent.talentId !== talentId),
        )
        setOpenSnackbar('Talent deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting talent:', error)
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
        await deleteTalent(row.talentId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete talent(s): ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} talent(s) deleted successfully.`)
  }

  const columns = useMemo(
    () => [
      {
        id: 'talent', 
        columns: [
          {
            accessorKey: 'talentId', 
            header: 'Talent Id',
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'talentName', 
            header: 'Name',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.talentName,
              helperText: validationErrors?.talentName,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  talentName: undefined,
                }),
    
              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    talentName: 'Talent Name cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'currentLocation', //hey a simple column for once
            header: 'Current Location',
            filterVariant: 'autocomplete',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.currentLocation,
              helperText: validationErrors?.currentLocation,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  currentLocation: undefined,
                }),
    
              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    currentLocation: 'Current Location cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'ekYear', //hey a simple column for once
            header: 'EK Year',
            enableColumnFilter: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.ekYear,
              helperText: validationErrors?.ekYear,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  ekYear: undefined,
                }),
    
              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    ekYear: 'EK Year cannot be empty',
                  }))
                }
              },
            },
          },
        ],
      },
    ],
    [validationErrors],
  )

  const validationRules = {
    talentName: {
      required: true,
      message: 'Talent Name cannot be empty',
    },
    collegeName: {
      required: true,
      message: 'College Name cannot be empty',
    },
    department: {
      required: true,
      message: 'Department cannot be empty',
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Invalid email format',
    },
    phoneNumber: {
      required: true,
      pattern: /^\d{10}$/,
      message: 'Phone Number must be a 10-digit number',
    },
    alternateNumber: {
      required: true,
      pattern: /^\d{10}$/,
      message: 'Alternate Number must be a 10-digit number',
    },
    tenthPercent: {
      required: true,
      pattern: /^(100(\.\d{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
      message: 'Tenth Percent must be a valid percentage between 0 and 100.',
    },
    twelthPercent: {
      required: true,
      pattern: /^(100(\.\d{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
      message: 'Tenth Percent must be a valid percentage between 0 and 100.',
    },
    cgpaUndergrad: {
      required: true,
      pattern: /^(10(\.0{1,2})?|[0-9](\.\d{1,2})?)$/, // Pattern for CGPA from 0 to 10
      message: 'CGPA Masters must be a valid CGPA between 0 and 10.',
    },
    currentLocation: {
      required: true,
      message: 'Current Location cannot be empty.',
    },
    permanentAddress: {
      required: true,
      message: 'Permanent Address cannot be empty.',
    },
    panNumber: {
      required: true,
      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      message: 'Invalid PAN Number format. Example: ABCDE1234F',
    },
    aadhaarNumber: {
      required: true,
      pattern: /^\d{12}$/,
      message: 'Invalid Aadhaar Number format. Must be a 12-digit number.',
    },
    fatherName: {
      required: true,
      message: 'Father Name cannot be empty.',
    },
    motherName: {
      required: true,
      message: 'Mother Name cannot be empty.',
    },
    dob: {
      required: true,
      pattern: /^\d{4}-\d{2}-\d{2}$/,
      message: 'Invalid Date of Birth format. Must be in YYYY-MM-DD format.',
    },
    ekYear: {
      required: true,
      pattern: /^(19|20)\d{2}$/,
      message: 'Invalid EK Year format. Must be a valid year.',
    },
  }

  const table = useMaterialReactTable({
    columns,
    data: talentList,
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,

    renderRowActionMenuItems: ({ closeMenu ,row}) => [
      <MenuItem
        key={0}
        onClick={() => {
          handleModalOpen();
          closeMenu();
        }}
        sx={{ m: 0 }}
      >
        <ListItemIcon>
          <AccountCircle />
        </ListItemIcon>
        <Link to={`/dashboard?tab=IndividualAssesments&talentId=${row.original.talentId}`}>
          <Typography variant="inherit">Assesments</Typography>
        </Link>
      </MenuItem>,
    ],
 renderTopToolbar: ({ table }) => {
      const [hasSelectedRows, setHasSelectedRows] = useState(false);
  const [openConvertModal, setOpenConvertModal] = useState(false);
      const handleDeactivate = () => {
        const confirmed = window.confirm(
          'Are you sure you want to delete the data?',
        )
        if (confirmed) {
          table.getSelectedRowModel().flatRows.map(async row => {
            //alert('deactivating ' + row.getValue('name'))
            const response = await fetch(
              `${tanBaseUrl}/candidates/${row.getValue('candidateId')}`,
              {
                method: 'DELETE',
              },
            )
            window.location.reload()
          })
        }
      }

      
   // eslint-disable-next-line react-hooks/rules-of-hooks
      const [selectedFile, setSelectedFile] = useState(null)
      const handleFileChange = event => {
        setSelectedFile(event.target.files[0])
      }

      const handleUpload = async () => {
        try {
          if (!selectedFile) {
            alert('Please select a file.')
            return
          }

          const formData = new FormData()
          formData.append('file', selectedFile)

          const response = await fetch(`${tanBaseUrl}/assessments/uploadexcel`, {
            method: 'POST',
            body: formData,
          })
          console.log(response)
          if (response.ok) {
            alert('File uploaded successfully.')
            window.location.reload()
          } else {
            alert('Failed to upload file.')
          }
        } catch (error) {
          console.error('Error uploading file:', error)
        }
      }

        // Update the state variable based on the selected rows
  const selectedRowCount = table.getSelectedRowModel().flatRows.length;
  useEffect(() => {
    setHasSelectedRows(selectedRowCount > 0);
  }, [selectedRowCount]);

      return (
        <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-300 scrollbarr-thumb-slate-300">
          <div className='flex justify-between mb-2 rounded-md'>
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
                <div>
                  <ButtonGroup>
                  <div className='flex justify-center items-center p-2 border-3 border-gray-300 rounded bg-blue-500 text-gray-700 gap-1 mr-3'>
                  <h2 className="text-white font-bold">Assesment Wise View</h2>

                 
                <div>
                <Switch {...label} onChange={handleToggle} />
                
                </div>
                </div>
                    <Button variant='contained' component='label'>
                      <label htmlFor='excelFile' className='excel-file-label'>
                        {selectedFile
                          ? `File Selected: ${selectedFile.name}`
                          : 'Add via Excel'}
                        <input
                          type='file'
                          id='excelFile'
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </label>
                    </Button> 
                    <Button
                    style={{marginLeft: '10px'}}
                      onClick={handleUpload}
                      color='success'
                      variant='contained'
                      disabled={!selectedFile}
                      sx={{ ml: 2 }} // Add some margin-left to create space
                    >
                      Upload File
                    </Button>
                  </ButtonGroup>
                </div>
              </Box>
            </Box>
          </Box>
           {/* Render the snackbar conditionally */}
      {hasSelectedRows && (
        <Snackbar
          open={hasSelectedRows}
          message="Rows are selected"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
      )}

        </div>
      )
    },
    
  })

    

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-3xl text-[#0087D5] font-bold mb-3`}>
        Assesments
      </h2><br></br><br></br>
      {isLoading && (
        <div className='flex min-h-[70vh] justify-center items-center'>
          <CircularProgress className='w-full mx-auto my-auto' />
        </div>
      )}
      {!isLoading && (
        <MaterialReactTable
          table={table}
          updateTalent={updateTalent}
          createTalent={createTalent}
        />
      )}
      {renderDeleteModal()}
      {renderDeleteRowsModal()}
      <Snackbar
        open={!!openSnackbar} // Convert openSnackbar to a boolean value
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
export default TalentTable
