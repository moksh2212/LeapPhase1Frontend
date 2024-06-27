import * as React from 'react'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Checkbox,
  TextField,
  Button,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import TableSortLabel from '@mui/material/TableSortLabel'
import { GridSearchIcon } from '@mui/x-data-grid'
import { CreateInterviewerForm } from './InterviewerCreateForm'
import { UpdateInterviewerForm } from './InterviewerUpdateForm'

function Row(props) {
  const { row, selected, onSelectChange } = props
  const [open, setOpen] = useState(false)

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell padding='checkbox'>
          <Checkbox checked={selected} onChange={onSelectChange} />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.interviewerName}</TableCell>
        <TableCell>{row.inctureId}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>{row.mobileNumber}</TableCell>
        <TableCell>{row.grade}</TableCell>
        <TableCell>{row.techRole}</TableCell>
        <TableCell>{row.techProficiency}</TableCell>
        <TableCell>{row.location}</TableCell>
        <TableCell>{row.region}</TableCell>
        <TableCell>{row.workExperience}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Assigned Details
              </Typography>
              {row.scheduleDetails && row.scheduleDetails.length === 0 && (
                <Table>No Schedules</Table>
              )}
              <Table size='small' aria-label='details'>
                {row.scheduleDetails && row.scheduleDetails.length !== 0 && (
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>College Name</b>
                      </TableCell>
                      <TableCell>
                        <b>Pre Placement Talk</b>
                      </TableCell>
                      <TableCell>
                        <b>Assessment Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Design Exercise Date</b>
                      </TableCell>
                      <TableCell>
                        <b>Interview Date</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                )}
                <TableBody>
                  {row.scheduleDetails &&
                    row.scheduleDetails.length !== 0 &&
                    row.scheduleDetails.map(project => (
                      <TableRow key={project.scheduleId}>
                        <TableCell>{project.collegeTPO && project.collegeTPO.collegeName}</TableCell>
                        {/* <TableCell>{project.collegeName}</TableCell> */}
                        <TableCell>{project.pptDate}</TableCell>
                        <TableCell>{project.assessmentDate}</TableCell>
                        <TableCell>{project.designDate}</TableCell>
                        <TableCell>{project.interviewDate}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <Box mt={2}>
                <Typography variant='h6' gutterBottom component='div'>
                  Previous Batches
                </Typography>

                <ul>
                  {row.prevBatches.map((batch, index) => (
                    <li key={index}>{batch}</li>
                  ))}
                </ul>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

    
    </React.Fragment>
  )
}

export default function CollapsibleTable() {
  // const [interviewerList, setInterviewerList] = useState([
  //   {
  //     interviewerId: 1,
  //     interviewerName: 'Alice Johnson',
  //     grade: 'A',
  //     techRole: 'Frontend Developer',
  //     techProficiency: 'Advanced',
  //     location: 'New York',
  //     region: 'North America',
  //     workExperience: '5 years',
  //     email: 'alice.johnson@example.com',
  //     mobileNumber: '+1 (555) 123-4567',
  //     prevBatches: ['Batch 2022', 'Batch 2021', 'Batch 2020'],
  //     scheduleDetails: [
  //       {
  //         collegeName: 'College A',
  //         pptDate: '2020-09-15',
  //         designDate: '2020-09-20',
  //         interviewDate: '2020-09-25',
  //         assessmentDate: '2020-09-30',
  //       },
  //       {
  //         collegeName: 'College B',
  //         pptDate: '2019-09-15',
  //         designDate: '2019-09-20',
  //         interviewDate: '2019-09-25',
  //         assessmentDate: '2019-09-30',
  //       },
  //       {
  //         collegeName: 'College C',
  //         pptDate: '2018-09-15',
  //         designDate: '2018-09-20',
  //         interviewDate: '2018-09-25',
  //         assessmentDate: '2018-09-30',
  //       },
  //       {
  //         collegeName: 'College D',
  //         pptDate: '2017-09-15',
  //         designDate: '2017-09-20',
  //         interviewDate: '2017-09-25',
  //         assessmentDate: '2017-09-30',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 2,
  //     interviewerName: 'Bob Smith',
  //     grade: 'B',
  //     techRole: 'Backend Developer',
  //     techProficiency: 'Intermediate',
  //     location: 'San Francisco',
  //     region: 'North America',
  //     workExperience: '4 years',
  //     email: 'bob.smith@example.com',
  //     mobileNumber: '+1 (555) 987-6543',
  //     prevBatches: ['Batch 2021', 'Batch 2020', 'Batch 2019'],
  //     scheduleDetails: [
  //       {
  //         collegeName: 'College E',
  //         pptDate: '2021-09-15',
  //         designDate: '2021-09-20',
  //         interviewDate: '2021-09-25',
  //         assessmentDate: '2021-09-30',
  //       },
  //       {
  //         collegeName: 'College F',
  //         pptDate: '2020-09-15',
  //         designDate: '2020-09-20',
  //         interviewDate: '2020-09-25',
  //         assessmentDate: '2020-09-30',
  //       },
  //       {
  //         collegeName: 'College G',
  //         pptDate: '2019-09-15',
  //         designDate: '2019-09-20',
  //         interviewDate: '2019-09-25',
  //         assessmentDate: '2019-09-30',
  //       },
  //       {
  //         collegeName: 'College H',
  //         pptDate: '2018-09-15',
  //         designDate: '2018-09-20',
  //         interviewDate: '2018-09-25',
  //         assessmentDate: '2018-09-30',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 3,
  //     interviewerName: 'Carol Williams',
  //     grade: 'A',
  //     techRole: 'Full Stack Developer',
  //     techProficiency: 'Advanced',
  //     location: 'Chicago',
  //     region: 'North America',
  //     workExperience: '6 years',
  //     email: 'carol.williams@example.com',
  //     mobileNumber: '+1 (555) 456-7890',
  //     prevBatches: ['Batch 2022', 'Batch 2020', 'Batch 2019'],
  //     scheduleDetails: [
  //       {
  //         collegeName: 'College I',
  //         pptDate: '2021-09-15',
  //         designDate: '2021-09-20',
  //         interviewDate: '2021-09-25',
  //         assessmentDate: '2021-09-30',
  //       },
  //       {
  //         collegeName: 'College J',
  //         pptDate: '2020-09-15',
  //         designDate: '2020-09-20',
  //         interviewDate: '2020-09-25',
  //         assessmentDate: '2020-09-30',
  //       },
  //       {
  //         collegeName: 'College K',
  //         pptDate: '2019-09-15',
  //         designDate: '2019-09-20',
  //         interviewDate: '2019-09-25',
  //         assessmentDate: '2019-09-30',
  //       },
  //       {
  //         collegeName: 'College L',
  //         pptDate: '2018-09-15',
  //         designDate: '2018-09-20',
  //         interviewDate: '2018-09-25',
  //         assessmentDate: '2018-09-30',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 4,
  //     interviewerName: 'David Brown',
  //     grade: 'C',
  //     techRole: 'DevOps Engineer',
  //     techProficiency: 'Intermediate',
  //     location: 'Seattle',
  //     region: 'North America',
  //     workExperience: '3 years',
  //     email: 'david.brown@example.com',
  //     mobileNumber: '+1 (555) 234-5678',
  //     prevBatches: ['Batch 2021', 'Batch 2020'],
  //     scheduleDetails: [
  //       {
  //         collegeName: 'College M',
  //         pptDate: '2021-09-15',
  //         designDate: '2021-09-20',
  //         interviewDate: '2021-09-25',
  //         assessmentDate: '2021-09-30',
  //       },
  //       {
  //         collegeName: 'College N',
  //         pptDate: '2020-09-15',
  //         designDate: '2020-09-20',
  //         interviewDate: '2020-09-25',
  //         assessmentDate: '2020-09-30',
  //       },
  //       {
  //         collegeName: 'College O',
  //         pptDate: '2019-09-15',
  //         designDate: '2019-09-20',
  //         interviewDate: '2019-09-25',
  //         assessmentDate: '2019-09-30',
  //       },
  //       {
  //         collegeName: 'College P',
  //         pptDate: '2018-09-15',
  //         designDate: '2018-09-20',
  //         interviewDate: '2018-09-25',
  //         assessmentDate: '2018-09-30',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 5,
  //     interviewerName: 'Eva Green',
  //     grade: 'B',
  //     techRole: 'Data Scientist',
  //     techProficiency: 'Advanced',
  //     location: 'Boston',
  //     region: 'North America',
  //     workExperience: '7 years',
  //     email: 'eva.green@example.com',
  //     mobileNumber: '+1 (555) 789-0123',
  //     prevBatches: ['Batch 2022', 'Batch 2021', 'Batch 2020', 'Batch 2019'],
  //     scheduleDetails: [
  //       {
  //         collegeName: 'College Q',
  //         pptDate: '2021-09-15',
  //         designDate: '2021-09-20',
  //         interviewDate: '2021-09-25',
  //         assessmentDate: '2021-09-30',
  //       },
  //       {
  //         collegeName: 'College R',
  //         pptDate: '2020-09-15',
  //         designDate: '2020-09-20',
  //         interviewDate: '2020-09-25',
  //         assessmentDate: '2020-09-30',
  //       },
  //       {
  //         collegeName: 'College S',
  //         pptDate: '2019-09-15',
  //         designDate: '2019-09-20',
  //         interviewDate: '2019-09-25',
  //         assessmentDate: '2019-09-30',
  //       },
  //       {
  //         collegeName: 'College T',
  //         pptDate: '2018-09-15',
  //         designDate: '2018-09-20',
  //         interviewDate: '2018-09-25',
  //         assessmentDate: '2018-09-30',
  //       },
  //     ],
  //   },
  // ])

  const [interviewerList, setInterviewerList] = useState([])
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('interviewerId')
  const [selected, setSelected] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openCreateInterviewerForm, setOpenCreateInterviewerForm] =
    useState(false)
  const [openUpdateInterviewerForm, setOpenUpdateInterviewerForm] =
    useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState()
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const [selectedInterviewer, setSelectedInteverviewer] = useState({})

  console.log(selected)

  const baseUrl = process.env.BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${baseUrl}/api/interviewer/read`)
        if (response.ok) {
          const data = await response.json()
          setInterviewerList(data)
          console.log(data)
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

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }

  const handleCreate = async formData => {
    setOpenCreateInterviewerForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${baseUrl}/api/interviewer/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setInterviewerList(prevInterviewerList => [
          ...prevInterviewerList,
          data,
        ])
        setOpenSnackbar('Interviewer created successfully!')
      }
    } catch (error) {
      console.error('Error creating Interviewer:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSort = property => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAll = event => {
    if (event.target.checked) {
      const newSelected = sortedData && sortedData.map(row => row)
      setSelected(newSelected)
    } else {
      setSelected([])
    }
  }

  const handleSelect = row => {
    const selectedIndex = selected.findIndex(
      item => item.interviewerId === row.interviewerId,
    )
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row)
    } else {
      newSelected = selected.filter(
        item => item.interviewerId !== row.interviewerId,
      )
    }

    setSelected(newSelected)
  }

  const handleDelete = async interviewerId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(interviewerId)
    try {
      const response = await fetch(
        `${baseUrl}/api/interviewer/delete/${interviewerId}`,
        {
          method: 'DELETE',
        },
      )

      if (response.ok) {
        setInterviewerList(prevInterviewers =>
          prevInterviewers.filter(
            interviewer => interviewer.interviewerId !== interviewerId,
          ),
        )
        setOpenSnackbar('Interviewer deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Interviewer:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleUpdate = async formData => {
    setIsLoading(true)
    setOpenUpdateInterviewerForm(false)
    setSelected([])
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${baseUrl}/api/interviewer/update/${formData.interviewerId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setError(null)
        setInterviewerList(prevInterviewers =>
          prevInterviewers.map(interviewer =>
            interviewer.interviewerId === data.interviewerId
              ? data
              : interviewer,
          ),
        )
        setOpenSnackbar('Interviewer updated successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error updating college:', error)
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSelectedRows = async () => {
    setOpenSnackbar(null)
    setError(null)
    setIsLoading(true)
    setOpenDeleteRowsModal(false)

    console.log(selected)
    let count = 0
    try {
      for (const row of selected) {
        await handleDelete(row.interviewerId)
        count++
      }
    } catch (error) {
      setError()
      setError(`Failed to delete interviewer(s): ${error.message}`)
    }

    setSelected([])
    setOpenSnackbar(`${count} interviewer(s) deleted successfully.`)
  }
  const handleSearch = event => {
    setSearchQuery(event.target.value)
  }

  const renderDeleteRowsModal = () => (
    <Dialog
      open={openDeleteRowsModal}
      onClose={() => setOpenDeleteRowsModal(false)}
    >
      <DialogTitle>Delete Interviewers</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected interviewer(s)?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={handleDeleteSelectedRows} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )

  const filteredData = interviewerList.filter(
    row =>
      row.interviewerId.toString().includes(searchQuery) ||
      row.interviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.grade.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.techRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.techProficiency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.workExperience.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[orderBy]
    const bValue = b[orderBy]

    if (aValue < bValue) {
      return order === 'asc' ? -1 : 1
    } else if (aValue > bValue) {
      return order === 'asc' ? 1 : -1
    }
    return 0
  })

  return (
    <Box>
      <Box
        display='flex'
        justifyContent='space-between'
        alignItems='center'
        mb={2}
      >
        <Box display={'flex'} gap={2}>
          <Button
            variant='contained'
            color='primary'
            sx={{
              borderRadius: '4px',
              textTransform: 'none',
              px: 3,
            }}
            onClick={() => {
              setOpenCreateInterviewerForm(true)
            }}
            disabled={selected.length !== 0}
          >
            Create
          </Button>
          <Button
            variant='contained'
            color='primary'
            sx={{
              borderRadius: '4px',
              textTransform: 'none',
              px: 3,
            }}
            onClick={() => {
              setOpenUpdateInterviewerForm(true)
              setSelectedInteverviewer(selected[0])
            }}
            disabled={selected.length !== 1}
          >
            Edit
          </Button>

          <Paper
            component='form'
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
            }}
            className='w-24 md:w-64'
          >
            <InputAdornment sx={{ pl: 1.5 }}>
              <GridSearchIcon color='action' />
            </InputAdornment>
            <TextField
              sx={{
                ml: 1,
                flex: 1,
                '& .MuiInputBase-input': {
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  padding: '8px 0',
                },
                '& .MuiInput-underline:before': { borderBottom: 'none' },
                '& .MuiInput-underline:after': { borderBottom: 'none' },
                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                  borderBottom: 'none',
                },
              }}
              placeholder='Search'
              value={searchQuery}
              onChange={handleSearch}
              variant='standard'
              InputProps={{
                disableUnderline: true,
              }}
            />
          </Paper>
        </Box>
        <Button
          variant='contained'
          color='error'
          startIcon={<DeleteIcon />}
          onClick={() => setOpenDeleteRowsModal(true)}
          disabled={selected.length === 0}
        >
          Delete
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell padding='checkbox'>
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < sortedData.length
                  }
                  checked={
                    sortedData.length > 0 &&
                    selected.length === sortedData.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell />
            
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'interviewerName'}
                  direction={orderBy === 'interviewerName' ? order : 'asc'}
                  onClick={() => handleSort('interviewerName')}
                >
                  <b>Interviewer Name</b>
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'inctureId'}
                  direction={orderBy === 'inctureId' ? order : 'asc'}
                  onClick={() => handleSort('inctureId')}
                >
                  <b>Incture ID</b>
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'email'}
                  direction={orderBy === 'email' ? order : 'asc'}
                  onClick={() => handleSort('email')}
                >
                  <b>Email</b>
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'mobileNumber'}
                  direction={orderBy === 'mobileNumber' ? order : 'asc'}
                  onClick={() => handleSort('mobileNumber')}
                >
                  <b>Phone</b>
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'grade'}
                  direction={orderBy === 'grade' ? order : 'asc'}
                  onClick={() => handleSort('grade')}
                >
                  <b>Grade</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'techRole'}
                  direction={orderBy === 'techRole' ? order : 'asc'}
                  onClick={() => handleSort('techRole')}
                >
                  <b>Tech Role</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'techProficiency'}
                  direction={orderBy === 'techProficiency' ? order : 'asc'}
                  onClick={() => handleSort('techProficiency')}
                >
                  <b>Tech Proficiency</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'location'}
                  direction={orderBy === 'location' ? order : 'asc'}
                  onClick={() => handleSort('location')}
                >
                  <b>Location</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'region'}
                  direction={orderBy === 'region' ? order : 'asc'}
                  onClick={() => handleSort('region')}
                >
                  <b>Region</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'workExperience'}
                  direction={orderBy === 'workExperience' ? order : 'asc'}
                  onClick={() => handleSort('workExperience')}
                >
                  <b>Work Experience</b>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData &&
              sortedData.map(row => (
                <Row
                  key={row.interviewerId}
                  row={row}
                  selected={selected.some(
                    item => item.interviewerId === row.interviewerId,
                  )}
                  onSelectChange={() => handleSelect(row)}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {renderDeleteRowsModal()}

      {openCreateInterviewerForm && (
        <CreateInterviewerForm
          openModal={openCreateInterviewerForm}
          setOpenModal={setOpenCreateInterviewerForm}
          createInterviewer={handleCreate}
        />
      )}
      {openUpdateInterviewerForm && (
        <UpdateInterviewerForm
          openModal={openUpdateInterviewerForm}
          setOpenModal={setOpenUpdateInterviewerForm}
          updateInterviewer={handleUpdate}
          currentInterviewer={selectedInterviewer}
        />
      )}

      {isLoading && (
        <Box sx={{ display: 'flex' }} className='flex h-full items-center justify-center'>
          <CircularProgress />
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
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
        autoHideDuration={2000}
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
    </Box>
  )
}