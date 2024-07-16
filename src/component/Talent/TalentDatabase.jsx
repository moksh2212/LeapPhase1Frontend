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
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Snackbar,
} from '@mui/material'
import { Group } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { PieChart } from '@mui/x-charts/PieChart'
import { useDrawingArea } from '@mui/x-charts/hooks'
import { styled } from '@mui/material/styles'
import { StatusForm } from './StatusForm'

const TalentTable = () => {
  const [talentList, setTalentList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const [openDeleteModal, setOpenDeleteModal] = useState(false)
  const [error, setError] = useState()

  const [talentToStatus, setTalentToStatus] = useState(false)
  const [openStatusForm, setOpenStatusForm] = useState(false)
  const [summary, setSummary] = useState({
    totalTalents: 0,
    activeTalents: 0,
    inactiveTalents: 0,
    declinedTalents: 1,
    resignedTalents: 0,
    revokedTalents: 0,
    talentLeftForBetterOffer: 0,
    talentLeftForHigherStudies: 0,
    talentLeftForFamilyReasons: 0,
    talentLeftForHealthReasons: 0,
    talentLeftForPerformanceIssues: 0,
    talentLeftForOthers: 0,
  })

  const [talentIdToDelete, setTalentIdToDelete] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)

  const tanBaseUrl = process.env.BASE_URL2
  const token = useSelector(state => state.user.token)
  const data = [
    { value: summary.declinedTalents, label: 'Declined' },
    { value: summary.resignedTalents, label: 'Resigned' },
    { value: summary.revokedTalents, label: 'Revoked' }
  ]
  // const reasonsData = [
  //   { value: 2, label: 'Better Offer' }
    // { value: summary.talentLeftForHigherStudies, label: 'Higher Studies' },
    // { value: summary.talentLeftForFamilyReasons, label: 'Family Reasons' },
    // { value: summary.talentLeftForHealthReasons, label: 'Health Reasons' },
    // { value: summary.talentLeftForPerformanceIssues, label: 'Performance Issues' },
    // { value: summary.talentLeftForOthers, label: 'Others' },
  // ];
  const size = {
    width: 400,
    height: 200,
  }
  const StyledText = styled('text')(({ theme }) => ({
    fill: theme.palette.text.primary,
    textAnchor: 'middle',
    dominantBaseline: 'central',
    fontSize: 20,
  }))
  function PieCenterLabel({ children }) {
    const { width, height, left, top } = useDrawingArea()
    return (
      <StyledText x={left + width / 2} y={top + height / 2}>
        {children}
      </StyledText>
    )
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

  const StatusCell = ({ row }) => {
    const talentId = row.original.talentId
    const status = row.original.talentStatus

    const statusButtonStyle = {
      backgroundColor: status === 'ACTIVE' ? 'lightgreen' : 'lightcoral',
      padding: '10px',
      border: 'none',
      borderRadius: '80px',
      cursor: 'pointer',
    }
    const dotStyle = {
      fontSize: '25px',
      marginRight: '5px',
      color: status === 'ACTIVE' ? 'green' : 'red',
    }

    return (
      <button
        style={statusButtonStyle}
        onClick={() => {
          setTalentToStatus(row.original), setOpenStatusForm(true)
        }}
      >
        <span style={dotStyle}>&#8226;</span>
        {status === 'ACTIVE' ? `${status}` : `${status}`}
      </button>
    )
  }

  StatusCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        talentId: PropTypes.string.isRequired,
        talentStatus: PropTypes.string.isRequired,
        marksheetsSemwise: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }
  const updateStatus = async formData => {
    setOpenStatusForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)
    const talentId = formData.get('talentId')
    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/resign/${talentId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
      console.log(response)
      if (response.ok) {
        setOpenSnackbar('Status Updated successfully.')
        const data = await response.json()
        setTalentList(prevTalents => [
          ...prevTalents.filter(talent => talent.talentId !== data.talentId),
          data,
        ])
        setIsLoading(false)
      } else {
        setError('Failed to Update Status')
        setIsLoading(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  const fetchMarksheet = async talentId => {
    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/viewmarksheet/${talentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!response.ok) {
        throw new Error('Failed to fetch marksheet')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error fetching marksheet:', error)
    }
  }
  const uploadMarksheet = async (talentId, file) => {
    const formData = new FormData()
    formData.append('marksheetsSemwise', file)

    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/uploadmarksheet/${talentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Failed to upload marksheet')
      }

      console.log('Marksheet uploaded successfully')
    } catch (error) {
      console.error('Error uploading marksheet:', error)
    }
    location.reload()
  }
  // MarksheetCell component with prop validation
  const MarksheetCell = ({ row }) => {
    const talentId = row.original.talentId

    const handleViewMarksheet = async () => {
      await fetchMarksheet(talentId)
    }

    return (
      <Box display='flex' justifyContent='center'>
        <ButtonGroup variant='contained' size='small'>
          <Button
            onClick={handleViewMarksheet}
            disabled={!row.original.marksheetsSemwise}
          >
            {row.original.marksheetsSemwise ? 'View' : 'NA'}
          </Button>
          <Button component='label'>
            <input
              type='file'
              hidden
              accept='.pdf'
              onChange={event =>
                uploadMarksheet(talentId, event.target.files[0])
              }
            />
            {row.original.marksheetsSemwise ? 'Update' : 'Upload'}
          </Button>
        </ButtonGroup>
      </Box>
    )
  }

  MarksheetCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        talentId: PropTypes.string.isRequired,
        marksheetsSemwise: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }
  const fetchResume = async talentId => {
    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/viewresume/${talentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!response.ok) {
        throw new Error('Failed to fetch Resume')
      }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error fetching Resume:', error)
    }
  }
  const uploadResume = async (talentId, file) => {
    const formData = new FormData()
    formData.append('resume', file)

    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/uploadresume/${talentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: 'PUT',
          body: formData,
        },
      )

      if (!response.ok) {
        throw new Error('Failed to upload Resume')
      }

      console.log('Resume uploaded successfully')
    } catch (error) {
      console.error('Error uploading Resume:', error)
    }
    location.reload()
  }
  const ResumeCell = ({ row }) => {
    const talentId = row.original.talentId
    const handleViewResume = async () => {
      await fetchResume(talentId)
    }

    return (
      <Box display='flex' justifyContent='center'>
        <ButtonGroup variant='contained' size='small'>
          <Button onClick={handleViewResume} disabled={!row.original.resume}>
            {row.original.resume ? 'View' : 'NA'}
          </Button>
          <Button component='label'>
            <input
              type='file'
              hidden
              accept='.pdf'
              onChange={event => uploadResume(talentId, event.target.files[0])}
            />
            {row.original.resume ? 'Update' : 'Upload'}
          </Button>
        </ButtonGroup>
      </Box>
    )
  }

  ResumeCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        talentId: PropTypes.string.isRequired,
        resume: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
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

  const createTalent = async newTalent => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${tanBaseUrl}/cpm/talents/createtalent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
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
            Authorization: `Bearer ${token}`,
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
  const handleDelete = async () => {
    await deleteTalent(talentIdToDelete)
    setOpenDeleteModal(false)
  }
  const deleteTalent = async talentId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${tanBaseUrl}/cpm/talents/deletetalent/${talentId}`,
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const talentResponse = await fetch(
          `${tanBaseUrl}/cpm/talents/alltalent`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const summaryResponse = await fetch(
          `${tanBaseUrl}/cpm/talents/summary`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        const talData = await talentResponse.json()
        setTalentList(talData)

        const sumData = await summaryResponse.json()
        setSummary(sumData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

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
            accessorKey: 'talentStatus',
            header: 'Status',
            enableEditing: false,
            size: 100,
            Cell: StatusCell,
          },
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
            accessorKey: 'collegeName',
            header: 'College Name',
            enableSorting: false,
            size: 100,
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
            accessorKey: 'department',
            filterVariant: 'select',
            header: 'Branch',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.department,
              helperText: validationErrors?.department,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  department: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    department: 'Branch cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'email',
            enableClickToCopy: true,
            filterVariant: 'autocomplete',
            header: 'Email',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
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
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    email: 'Email cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'phoneNumber', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            enableColumnFilter: false,
            header: 'Phone Number',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.phoneNumber,
              helperText: validationErrors?.phoneNumber,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  phoneNumber: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    phoneNumber: 'Phone Number cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'alternateNumber', //accessorKey used to define `data` column. `id` gets set to accessorKey automatically
            header: 'Alt Phone Number',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.alternateNumber,
              helperText: validationErrors?.alternateNumber,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  alternateNumber: undefined,
                }),
              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    alternateNumber: 'Alternate Phone Number cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'tenthPercent', //hey a simple column for once
            header: 'Tenth Percent',
            filterVariant: 'range',
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.tenthPercent,
              helperText: validationErrors?.tenthPercent,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  tenthPercent: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    tenthPercent: 'Tenth Percent cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'twelthPercent', //hey a simple column for once
            header: 'Twelth Percent',
            filterVariant: 'range',
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.twelthPercent,
              helperText: validationErrors?.twelthPercent,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  twelthPercent: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    twelthPercent: 'Twelth Percent cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'cgpaMasters', //hey a simple column for once
            header: 'CGPA M',
            filterVariant: 'range',
            size: 100,
          },
          {
            accessorKey: 'cgpaUndergrad', //hey a simple column for once
            header: 'CGPA U',
            filterVariant: 'range',
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.cgpaUndergrad,
              helperText: validationErrors?.cgpaUndergrad,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  cgpaUndergrad: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    cgpaUndergrad: 'CGPA U cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'marksheet',
            header: 'Marksheet',
            size: 100,
            Cell: MarksheetCell,
            Edit: () => null,
          },
          {
            accessorKey: 'resume',
            header: 'Resume',
            size: 100,
            Cell: ResumeCell,
            Edit: () => null,
          },
          {
            accessorKey: 'officeLocation', //hey a simple column for once
            header: 'Office Location',
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
            accessorKey: 'permanentAddress', //hey a simple column for once
            header: 'Permanent Address',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.permanentAddress,
              helperText: validationErrors?.permanentAddress,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  permanentAddress: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    permanentAddress: 'Permanent Address cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'panNumber', //hey a simple column for once
            header: 'Pan Number',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.panNumber,
              helperText: validationErrors?.panNumber,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  panNumber: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    panNumber: 'Pan Number cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'aadhaarNumber', //hey a simple column for once
            header: 'Aadhaar Number',
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.aadhaarNumber,
              helperText: validationErrors?.aadhaarNumber,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  aadhaarNumber: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    aadhaarNumber: 'Aadhaar Number cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'fatherName', //hey a simple column for once
            header: 'Father Name',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.fatherName,
              helperText: validationErrors?.fatherName,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  fatherName: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    fatherName: 'Father Name cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'motherName', //hey a simple column for once
            header: 'Mother Name',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.motherName,
              helperText: validationErrors?.motherName,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  motherName: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    motherName: 'Mother Name cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'dob', //convert to Date for sorting and filtering
            id: 'dob',
            header: 'DOB',
            enableColumnFilter: false,
            size: 100,
            muiEditTextFieldProps: {
              required: true,
              error: !!validationErrors?.dob,
              helperText: validationErrors?.dob,
              onFocus: () =>
                setValidationErrors({
                  ...validationErrors,
                  dob: undefined,
                }),

              onBlur: event => {
                const { value } = event.target
                if (!value) {
                  setValidationErrors(prevErrors => ({
                    ...prevErrors,
                    dob: 'DOB cannot be empty',
                  }))
                }
              },
            },
          },
          {
            accessorKey: 'talentSkills', //hey a simple column for once
            header: 'Skills',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'talentEmploymentType', //hey a simple column for once
            header: 'Employment Type',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'reportingManager', //hey a simple column for once
            header: 'Reporting Manager',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'plOwner', //hey a simple column for once
            header: 'P&L Owner',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
          },
          {
            accessorKey: 'talentCategory', //hey a simple column for once
            header: 'Category',
            enableColumnFilter: false,
            enableSorting: false,
            size: 100,
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
    enableRowSelection: true,
    initialState: { columnVisibility: { talentId: true } },
    isLoading,
    muiTableHeadCellProps:{
      align: 'center',
    },
    muiTableBodyCellProps:{
      align: 'center',
    },
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
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

    onCreatingRowSave: async ({ values, table }) => {
      console.log('Creating row save function called')
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
      await createTalent(values)
      table.setCreatingRow(null)
    },

    onEditingRowSave: async ({ values, table }) => {
      console.log('Editing row save function called 1')
      const errors = {}

      Object.entries(values).forEach(([key, value]) => {
        const temp = value ? value.toString().trim() : '' // Add a null check here
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
      console.log('Editing row save function called 2')

      if (Object.keys(errors).length > 0) {
        console.log('Editing row save function called 3')

        setValidationErrors(errors)
        return
      }
      console.log('Editing row save function called 4')

      setValidationErrors({})
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
            Edit Talent Details
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
            Create New Talent
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
      <h2 className={`text-3xl text-[#0087D5] font-bold mb-3`}>TALENT</h2>
      <br></br>
      <div className='w-full p-4 bg-gray-100'>
        <div className='w-full p-4 bg-gray-200'>
          <div className='flex flex-row gap-x-6'>
            <div className='w-1/3 p-4 bg-gray-200'>
              <div>
                <h3 className='text-3xl text-[#0087D5] font-bold mb-3'>
                  <Group />
                  &nbsp;Talents&nbsp;:&nbsp;{summary.totalTalents}
                </h3>
              </div>
              <h3 className='text-2xl text-[#309130] font-bold mb-3'>
                Active&nbsp;:&nbsp;{summary.activeTalents}
              </h3>
              <h3 className='text-2xl text-[#D31C1C] font-bold mb-3'>
                Inactive&nbsp;:&nbsp;{summary.inactiveTalents}
              </h3>
              <br />
            </div>
            <div className='w-2/3 p-4 bg-gray-200'>
              <PieChart series={[{ data, innerRadius: 80 }]} {...size}>
              <PieCenterLabel>Inactive Dist.</PieCenterLabel>
              </PieChart>
            </div>
            {/* <div className='w-2/3 p-4 bg-gray-200'>
              <PieChart series={[{ reasonsData, innerRadius: 80 }]} {...size}>
              <PieCenterLabel>Reasons</PieCenterLabel>
              </PieChart>
            </div> */}

          </div>
        </div>
      </div>
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
      {openStatusForm && (
        <StatusForm
          openModal={openStatusForm}
          setOpenModal={setOpenStatusForm}
          updateStatus={updateStatus}
          statusUp={talentToStatus}
        />
      )}
    </div>
  )
}
export default TalentTable
