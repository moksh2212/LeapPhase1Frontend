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





const InkathonTable = () => {
  const [talentList, setTalentList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()
  
  const [talentIdToDelete, setTalentIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const tanBaseUrl = process.env.BASE_URL


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
  const openInkathon = (inkathonId) => {
    console.log(`Opening inkathon ${inkathonId}`);
    window.open('?tab=createinkathon', '_blank');
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
  const updateTalent = async talentToUpdate => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${tanBaseUrl}/api/inkathons/${talentToUpdate.inkathonId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(talentToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setTalentList(prevTalents =>
          prevTalents.map(talent =>
            talent.inkathonId === data.inkathonId ? data : talent,
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
      const response = await fetch(
        `${tanBaseUrl}/api/inkathons/${talentId}`,
        {
          method: 'DELETE',
        },
      )

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
    location.reload()
  }
  const handleDeleteSelectedRows = async () => {
    setOpenSnackbar(null)
    setError(null)
    setIsLoading(true)
    setOpenDeleteRowsModal(false)

    let count = 0
    try {
      for (const row of selectedRows) {
        await deleteTalent(row.inkathonId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete talent(s): ${error.message}`)
    }

    setRowSelection([])
    setOpenSnackbar(`${count} talent(s) deleted successfully.`)
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${tanBaseUrl}/api/inkathons`)
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
    data: talentList,
    enableRowSelection: true,
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
        <IconButton onClick={() => console.info('Delete')}>
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

    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => {
      const hasErrors = columns.some(
        accessorKey => validationErrors[accessorKey],
      )
      return (
        <>
          <DialogTitle variant='h5' sx={{ textAlign: 'center' }}>
            Create New Talent
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
    
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map(row => row.original)

      return (
        <div className='flex gap-5'>
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
          updateTalent={updateTalent}
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
export default InkathonTable
