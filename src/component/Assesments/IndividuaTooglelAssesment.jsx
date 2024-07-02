import { useEffect, useMemo, useState } from 'react'
import { AccountCircle } from '@mui/icons-material'
import { Link } from 'react-router-dom' // Import Link
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

const IndividualToogleAssesments = () => {
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
  const baseUrl = process.env.BASE_URL2
  const token = useSelector(state=>state.user.token)
  const updateAssessment = async AssesmentToUpdate => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const talentId = urlParams.get('talentId')
      const response = await fetch(
        `${baseUrl}/assessments/updateassessment/${AssesmentToUpdate.assessmentId}/${talentId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(AssesmentToUpdate),
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
      }
    } catch (error) {
      console.error('Error updating talent:', error)
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
            headers:{
              Authorization: `Basic ${token}`,
            }
          }
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
  }, [])

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
            Authorization: `Basic ${token}`,
          },
          body: JSON.stringify(newTalent),
        },
      )
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

  const deleteTalent = async talentId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/cpm/talents/deletetalent/${talentId}`,
        {
          method: 'DELETE',
          headers:{
            Authorization: `Basic ${token}`,
          }
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
            accessorKey: 'score',
            header: 'Scores',
            enableEditing: false,
            size: 100,
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
            enableEditing: true,
            size: 100,
          },
          {
            accessorKey: 'assessmentDate',
            header: 'Assessment Date',
            enableEditing: false,
            size: 100,
          },
        ],
      },
    ],
    [validationErrors],
  )

  const validationRules = {
    tenthPercent: {
      required: true,
      pattern: /^(100(\.\d{1,2})?|[1-9]?\d(\.\d{1,2})?)$/,
      message: 'Tenth Percent must be a valid percentage between 0 and 100.',
    },
    currentLocation: {
      required: true,
      message: 'Current Location cannot be empty.',
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
    enableEditing: true,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: async ({ values, table }) => {
      console.log('Editing row save function called 1')
      const errors = {}

      // Object.entries(values).forEach(([key, value]) => {
      //   const temp = value ? value.toString().trim() : '' // Add a null check here
      //   const rule = validationRules[key]

      //   if (rule) {
      //     if (rule.required && temp.length === 0) {
      //       errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} field cannot be empty`
      //     } else if (rule.pattern && !rule.pattern.test(value)) {
      //       errors[key] = rule.message
      //     }
      //   }
      // // })
      // console.log("Editing row save function called 2");

      // if (Object.keys(errors).length > 0) {
      //   console.log("Editing row save function called 3");

      //   setValidationErrors(errors)
      //   return
      // }
      // console.log("Editing row save function called 4");

      setValidationErrors({})
      await updateAssessment(values)
      table.setEditingRow(null)
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-100%'>
      <h2 className={`text-3xl text-[#0087D5] font-bold mb-3`}>ScoreCard</h2>
      <br></br>
      <br></br>
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
