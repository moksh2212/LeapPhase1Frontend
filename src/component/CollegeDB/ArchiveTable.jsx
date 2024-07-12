import { useEffect, useMemo, useState } from 'react'
import {
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
  Snackbar,
} from '@mui/material'
import { useSelector } from 'react-redux'

const ArchiveTable = () => {
  const [archivedColleges, setArchivedColleges] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [error, setError] = useState(null)

  const token = useSelector(state => state.user.token)
  const baseUrl = process.env.BASE_URL

  useEffect(() => {
    const fetchArchivedData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/admin/viewData`, {
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
        const data = await response.json()
        setArchivedColleges(data)
      } catch (error) {
        console.error('Error fetching archived data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchivedData()
  }, [])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(null)
    setError(null)
  }

  const handleDelete = async () => {
    try {
      const selectedCollegeIds = Object.keys(rowSelection).map(index => archivedColleges[index].collegeId)
      const response = await fetch(`${baseUrl}/admin/deleteMultipleArchivedData`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${token}`,
        },
        body: JSON.stringify({ collegeIds: selectedCollegeIds }),
      })

      if (response.ok) {
        setArchivedColleges(prevColleges =>
          prevColleges.filter(college => !selectedCollegeIds.includes(college.collegeId))
        )
        setOpenSnackbar(`${selectedCollegeIds.length} archived college(s) deleted successfully!`)
        setRowSelection({})
      }
    } catch (error) {
      console.error('Error deleting archived colleges:', error)
      setError(error.message)
    } finally {
      setOpenDeleteModal(false)
    }
  }

 
  const columns = useMemo(
    () => [
      {
        accessorKey: 'collegeId',
        header: 'College Id',
        enableHiding: true,
        hidden: true,
      },
      {
        accessorKey: 'collegeName',
        header: 'College Name',
        size: 150,
      },
      {
        accessorKey: 'region',
        header: 'Region',
      },
      {
        accessorKey: 'location',
        header: 'Location',
      },
      {
        accessorKey: 'state',
        header: 'State',
      },
      {
        accessorKey: 'tier',
        header: 'Tier',
      },
      {
        accessorKey: 'tpoName',
        header: 'TPO Contact Name',
      },
      {
        accessorKey: 'primaryEmail',
        header: 'TPO Email',
      },
      {
        accessorKey: 'primaryContact',
        header: 'Primary Contact',
      },
      {
        accessorKey: 'secondaryContact',
        header: 'Secondary Contact',
      },
      {
        accessorKey: 'addressLine1',
        header: 'Address Line 1',
      },
      {
        accessorKey: 'addressLine2',
        header: 'Address Line 2',
      },
      {
        accessorKey: 'pinCode',
        header: 'Pin Code',
      },
      {
        accessorKey: 'collegeOwner',
        header: 'College Owner',
      },
      {
        accessorKey: 'compensation',
        header: 'Compensation',
      },
    ],
    []
  )

  const table = useMaterialReactTable({
    columns,
    data: archivedColleges,
    enableEditing: false,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: true,
    enableSorting: true,
    muiTableProps: {
      sx: {
        tableLayout: 'fixed',
      },
    },
    getRowId: (row) => row.collegeId,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
    renderTopToolbarCustomActions: ({ table }) => {
      const selectedRows = table.getSelectedRowModel().flatRows
      return (
        <Button
          color="error"
          disabled={selectedRows.length === 0}
          onClick={() => setOpenDeleteModal(true)}
          variant="contained"
        >
          Delete Selected ({selectedRows.length})
        </Button>
      )
    },
  })

  return (
    <div className="flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%">
      <MaterialReactTable table={table} />

      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Delete Archived Colleges</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete {Object.keys(rowSelection).length} archived college(s)?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar !== null}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {openSnackbar}
        </Alert>
      </Snackbar>

      <Snackbar
        open={error !== null}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ArchiveTable