import { useEffect, useMemo, useState } from 'react'
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import {
  Alert,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Snackbar,
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {AddInkathon }from './AddInkathon'



  const InkathonTable = () => {
  const [inkathonList, setInkathonsList] = useState([])
  const [openCreateInkathonForm, setOpenCreateInkathonForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [error, setError] = useState()
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})

  const [inkathonIdToDelete, setInkathonIdToDelete] = useState({})
  const [openInkathonDeleteModal, setOpenInkathonDeleteModal] = useState(false)

  

  const tanBaseUrl = process.env.BASE_URL
  const token = useSelector(state => state.user.token)

  const ActionCell = ({ cell }) => {
    // Assuming cell.getValue() is the method to get the Inkathon ID
    const inkathonId = cell.getValue();
    
    // Construct the URL with the Inkathon ID as a query parameter
    const url = `?tab=createinkathon&id=${inkathonId}`;
  
    return (
      <Box display="flex" justifyContent="center">
        <Link to={url}>
          <Button>
            Open Inkathon
          </Button>
        </Link>
      </Box>
    );
  };
  ActionCell.propTypes = {
    cell: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
    }).isRequired,
  };
  const createInkathon = async formData => {
    setOpenCreateInkathonForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)
    try {
      const response = await fetch(`${tanBaseUrl}/api/inkathons/create`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${token}`,
        },
        body: formData,
        
      })
      console.log(response)
      if (response.ok) {
        setOpenSnackbar('Inkathon Created successfully.')
        const data = await response.json()
        setInkathonsList(prevInkathons => [...prevInkathons, data])
        setIsLoading(false)
      } else {
        setError('Failed to Create Inkathon')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
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
  const handleInkathonDelete = async () => {
    await deleteInkathon(inkathonIdToDelete)
    setOpenInkathonDeleteModal(false)
  }
  const deleteInkathon = async inkathonId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${tanBaseUrl}/api/inkathons/delete/${inkathonId}`, {
        method: 'DELETE',
        headers:{
          Authorization: `Basic ${token}`,
        },
      })

      if (response.ok) {
        setInkathonsList(prevInkathons =>
          prevInkathons.filter(inkathon => inkathon.inkathonId !== inkathonId),
        )
        setOpenSnackbar('Inkathon deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Inkathon:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const renderInkathonDeleteModal = () => (
    <Dialog open={openInkathonDeleteModal} onClose={() => setOpenInkathonDeleteModal(false)}>
      <DialogTitle>Delete Inkathon</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Project?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenInkathonDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting Inkathon with ID:', inkathonIdToDelete)
            handleInkathonDelete()
          }}
          color='error'
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${tanBaseUrl}/api/inkathons`,{
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        if (response.status !== 200) {
          setInkathonsList([]) // or set to null
        } else {
          const data = await response.json()
          setInkathonsList(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  //Functions ________________________________________________________________________________________________________________________________________________________________________________________________
  


  const columns = useMemo(
    () => [
      {
        id: 'talent',
        columns: [
          {
            accessorKey: 'inkathonId', //hey a simple column for once
            header: 'inkathonId',
            enableColumnFilter: false,
            enableSorting: false,
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'title', //hey a simple column for once
            header: 'title',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'creationDate', //hey a simple column for once
            header: 'creationDate',
            enableColumnFilter: false,
            enableSorting: false,
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'description', //hey a simple column for once
            header: 'description',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            id: 'action',
            accessorKey: 'inkathonId', // Assuming you want to pass inkathonId as parameter
            header: 'Action',
            disableFilters: true,
            disableSortBy: true,
            size: 100,
            Cell: ActionCell,
          },
        ],
      },
    ],
  )

  const table = useMaterialReactTable({
    columns,
    data: inkathonList,
    initialState: { columnVisibility: { talentId: true, } },
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton onClick={() => console.info('Edit')}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => {
          setInkathonIdToDelete(row.original.inkathonId)
          setOpenInkathonDeleteModal(true)}}>
          <DeleteIcon />
          
        </IconButton>
      </Box>
    ),
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    getRowId: row => row.talentId,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: async ({ values, table }) => {

      await updateTalent(values)
      table.setEditingRow(null)
    },

    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <div className='flex gap-5'>
          <Button
            variant='contained'
            onClick={() => {
              setOpenCreateInkathonForm(true)
            }}
          >
            Create New Inkathon
          </Button>
        </div>
      )
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-3xl text-[#0087D5] font-bold mb-3`}>iNKATHON</h2>
      <br></br>
      <br></br>
      {isLoading && (
        <div className='flex min-h-[70vh] justify-center items-center'>
          <CircularProgress className='w-full mx-auto my-auto' />
        </div>
      )}
      {!isLoading && (
        <MaterialReactTable
          table={table}
        />
      )}
      {openCreateInkathonForm && (
                <AddInkathon
                  openModal={openCreateInkathonForm}
                  setOpenModal={setOpenCreateInkathonForm}
                  createInkathon={createInkathon}
                />
              )}
      {renderInkathonDeleteModal()}
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
export default InkathonTable
