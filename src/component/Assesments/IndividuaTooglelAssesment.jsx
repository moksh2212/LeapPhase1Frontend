import { useEffect, useMemo, useState } from 'react'
import { AccountCircle } from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom' // Import Link and useNavigate

import {
  MRT_EditActionButtons,
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table'
import CommentCell from './CommandCell'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'

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
} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import ScoreDropdown from './ScoreDropdown'
const IndividualToogleAssesments = () => {
  const [talentList, setTalentList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()
  const [x, setx] = useState(0)
  const [talentIdToDelete, setTalentIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const navigate = useNavigate() // Use useNavigate hook

  const baseUrl = process.env.BASE_URL2
  const token = useSelector(state => state.user.token)
  const updateAssessment = async AssesmentToUpdate => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const assesmentid = urlParams.get('assesmentid')

      // Create URL with query parameters
      const url = new URL(
        `${baseUrl}/assessments/updateassessment/${assesmentid}/${AssesmentToUpdate.talentId}`,
      )
      url.searchParams.append('assessmentId', assesmentid)
      url.searchParams.append('talentId', AssesmentToUpdate.talentId)

      // Get the latest score (which is the only score in the array)

      url.searchParams.append('score', AssesmentToUpdate.scores)
      url.searchParams.append('reason', AssesmentToUpdate.reason || '')

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setValidationErrors({})
        setx(1)
      } else {
        console.error('Error updating assessment:', response.statusText)
        throw new Error(response.statusText)
      }
    } catch (error) {
      console.error('Error updating talent:', error)
      throw error
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
        const urlParams = new URLSearchParams(window.location.search)
        const assessmentId = urlParams.get('assesmentid')
        const response = await fetch(
          `${baseUrl}/assessments/assessment/${assessmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
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
  }, [x])

  const createTalent = async newTalent => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(
        `${baseUrl}assessments/viewassessment/${talentId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTalent),
        },
      )
      if (response.ok) {
        setError(null)
        const data = await response.json()
        // Ensure that each item in the data array has a 'scores' property
        const processedData = data.map(item => ({
          ...item,
          scores: Array.isArray(item.scores) ? item.scores : [item.score], // Fallback to single score if array not provided
        }))
        setValidationErrors({})
        setTalentList(processedData)
        setOpenSnackbar('Talent added successfully!')
      }
    } catch (error) {
      console.error('Error creating talent:', error)
      setError(error.message)
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
        `${baseUrl}/cpm/talents/deletetalent/${talentId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
            accessorKey: 'location',
            header: 'Location',
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'scores',
            header: 'Score',
            enableEditing: true,
            size: 170,
            accessorFn: row => {
              const scores = Array.isArray(row.scores)
                ? row.scores
                : [row.score]
              return scores[scores.length - 1]
            },
            Cell: ({ row }) => <ScoreDropdown scores={row.original.scores} />,
            Header: ({ column }) => (
              <Box className='ml-2'>{column.columnDef.header}</Box>
            ),
          },
          {
            accessorKey: 'assessmentSkill',
            header: 'Assessment Skill',
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'location',
            header: 'Location',
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'attempts',
            header: 'Attempts',
            enableEditing: true,
            size: 100,
          },
          {
            accessorKey: 'comments',
            header: 'Log',
            enableEditing: false,
            size: 250, // Increased size
            Cell: ({ row }) => <CommentCell comments={row.original.comments} />,
            Header: ({ column }) => (
              <Box
                sx={{
                  marginLeft: '120px',
                }}
              >
                {column.columnDef.header}
              </Box>
            ),
          },
          {
            accessorKey: 'assessmentDate',
            header: 'Assessment Date',
            enableEditing: false,
            size: 100,
          },
          {
            accessorKey: 'reason',
            header: 'Reason',
            enableEditing: true,

            size: 250, // Adjust size as needed
          },
        ],
      },
    ],
    [validationErrors],
  )

  const table = useMaterialReactTable({
    columns,
    data: talentList,
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    initialState: { columnVisibility: { reason: false, talentId: false } },

    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: async ({ values, table }) => {
      try {
        setValidationErrors({})
        console.log('hello')
        updateAssessment(values)
        table.setEditingRow(null)

        setOpenSnackbar('Assessment updated successfully!')
      } catch (error) {
        setError(`Failed to update assessment: ${error.message}`)
      }
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-3xl text-[#0087D5] font-bold mb-3`}>
        {' '}
        <Button
          color='primary'
          onClick={() => navigate(-1)} // Navigate to the previous page
          style={{ width: '50px' }}
        >
          <KeyboardArrowLeftIcon />
        </Button>
        Indidvidual Assessment Wise Scorecard
      </h2>
      {isLoading && (
        <div className='flex min-h-[70vh] justify-center items-center'>
          <CircularProgress className='w-full mx-auto my-auto' />
        </div>
      )}
      {!isLoading && (
        <MaterialReactTable table={table} createTalent={createTalent} />
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
export default IndividualToogleAssesments
