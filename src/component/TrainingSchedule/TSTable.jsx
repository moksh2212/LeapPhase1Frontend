import * as React from 'react'
import { useState } from 'react'
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
import TablePagination from '@mui/material/TablePagination'
import { GridSearchIcon } from '@mui/x-data-grid'
import { useSelector } from 'react-redux'
import TrainingScheduleForm from './CreateTSForm'
import TrainingScheduleUpdateForm from './UpdateTSForm'

const highlightText = (text, highlight) => {
  if (!highlight.trim()) {
    return text
  }
  const regex = new RegExp(`(${highlight})`, 'gi')
  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <mark key={index} style={{ backgroundColor: 'orange' }}>
        {part}
      </mark>
    ) : (
      part
    ),
  )
}

function Row(props) {
  const { row, selected, onSelectChange, searchQuery } = props
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
        <TableCell>
          {highlightText(row.weekNumber || '', searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(row.trainingDate || '', searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(row.actualTrainingDate || '', searchQuery)}
        </TableCell>
        <TableCell>{highlightText(row.startTime || '', searchQuery)}</TableCell>
        <TableCell>{highlightText(row.endTime || '', searchQuery)}</TableCell>
        <TableCell>
          {highlightText(row.trainingTech || '', searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(row.trainingTopic || '', searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(
            row.trainer ? row.trainer.trainerName : '',
            searchQuery,
          )}
        </TableCell>
        <TableCell>
          {highlightText(row.trainingStatus || '', searchQuery)}
        </TableCell>
        <TableCell>
          {highlightText(row.comments || '', searchQuery)}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Trainees
              </Typography>
              <Table size='small' aria-label='trainees'>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <b>Name</b>
                    </TableCell>
                    <TableCell>
                      <b>Email</b>
                    </TableCell>
                    <TableCell>
                      <b>College</b>
                    </TableCell>
                    <TableCell>
                      <b>Office Location</b>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.selectedEmployees &&
                    row.selectedEmployees.map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.talentName}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.collegeName}</TableCell>
                        <TableCell>{employee.officeLocation}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}

export default function TrainingScheduleTable() {
  const [scheduleList, setScheduleList] = useState([
    {
      "startTime": "14:00",
      "endTime": "16:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "789456123013",
          "alternateNumber": "9876543213",
          "candidateId": 13,
          "cgpaMasters": 8.9,
          "cgpaUndergrad": 9.1,
          "collegeName": "IIT Madras",
          "currentLocation": "Tamil Nadu",
          "department": "CS",
          "dob": "2002-05-18",
          "ekYear": "2023",
          "email": "gaurav@gmail.com",
          "fatherName": "Anil",
          "label": "Gaurav",
          "motherName": "Meena",
          "officeLocation": "CHN",
          "panNumber": "BCDEF7890L",
          "permanentAddress": "Chennai",
          "phoneNumber": "9123456790",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 11,
          "talentName": "Gaurav",
          "talentSkills": "Big Data",
          "tenthPercent": 93,
          "twelthPercent": 90,
          "value": 11
        }
      ],
      "trainer": {
        "designation": "Data Engineer",
        "email": "vivek@gmail.com",
        "label": "Vivek Rao",
        "location": "Bangalore",
        "skills": ["Big Data", "Hadoop", "Spark"],
        "trainerId": "INC41",
        "trainerName": "Vivek Rao",
        "value": "INC41"
      },
      "trainingDate": "2024-07-18",
      "trainingTech": "bigdata",
      "trainingTopic": "Hadoop Ecosystem",
      "weekNumber": 1,
      "actualTrainingDate": "2024-07-18",
      "comments": "Good participation from attendees.",
      "trainingStatus": "Scheduled"
    },
    {
      "startTime": "12:00",
      "endTime": "14:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "123456789013",
          "alternateNumber": "9876543214",
          "candidateId": 14,
          "cgpaMasters": 9.3,
          "cgpaUndergrad": 9.4,
          "collegeName": "IIT Roorkee",
          "currentLocation": "Uttarakhand",
          "department": "CE",
          "dob": "2001-04-21",
          "ekYear": "2022",
          "email": "ritu@gmail.com",
          "fatherName": "Naveen",
          "label": "Ritu",
          "motherName": "Sunita",
          "officeLocation": "HR",
          "panNumber": "BCDEF8901M",
          "permanentAddress": "Haridwar",
          "phoneNumber": "9112345679",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 12,
          "talentName": "Ritu",
          "talentSkills": "AI",
          "tenthPercent": 95,
          "twelthPercent": 93,
          "value": 12
        }
      ],
      "trainer": {
        "designation": "AI Specialist",
        "email": "rohit@gmail.com",
        "label": "Rohit Gupta",
        "location": "Noida",
        "skills": ["AI", "Machine Learning", "Python"],
        "trainerId": "INC42",
        "trainerName": "Rohit Gupta",
        "value": "INC42"
      },
      "trainingDate": "2024-07-19",
      "trainingTech": "ai",
      "trainingTopic": "Deep Learning",
      "weekNumber": 1,
      "actualTrainingDate": "2024-07-19",
      "comments": "Interactive session with practical examples.",
      "trainingStatus": "Scheduled"
    },
    {
      "startTime": "09:00",
      "endTime": "11:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "654321789013",
          "alternateNumber": "9876543215",
          "candidateId": 15,
          "cgpaMasters": 8.6,
          "cgpaUndergrad": 8.8,
          "collegeName": "IIT Guwahati",
          "currentLocation": "Assam",
          "department": "EE",
          "dob": "2000-01-10",
          "ekYear": "2021",
          "email": "arjun@gmail.com",
          "fatherName": "Prakash",
          "label": "Arjun",
          "motherName": "Kavita",
          "officeLocation": "GHY",
          "panNumber": "BCDEF9012N",
          "permanentAddress": "Guwahati",
          "phoneNumber": "9123456791",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 13,
          "talentName": "Arjun",
          "talentSkills": "Cybersecurity",
          "tenthPercent": 92,
          "twelthPercent": 89,
          "value": 13
        }
      ],
      "trainer": {
        "designation": "Security Analyst",
        "email": "akash@gmail.com",
        "label": "Akash Mehta",
        "location": "Chandigarh",
        "skills": ["Cybersecurity", "Network Security", "Penetration Testing"],
        "trainerId": "INC43",
        "trainerName": "Akash Mehta",
        "value": "INC43"
      },
      "trainingDate": "2024-07-20",
      "trainingTech": "cybersecurity",
      "trainingTopic": "Network Security",
      "weekNumber": 1,
      "actualTrainingDate": "2024-07-20",
      "comments": "Detailed discussion on recent cyber threats.",
      "trainingStatus": "Scheduled"
    },
    {
      "startTime": "14:00",
      "endTime": "16:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "789456123014",
          "alternateNumber": "9876543216",
          "candidateId": 16,
          "cgpaMasters": 9.0,
          "cgpaUndergrad": 9.1,
          "collegeName": "IIT Gandhinagar",
          "currentLocation": "Gujarat",
          "department": "CS",
          "dob": "2001-05-22",
          "ekYear": "2023",
          "email": "manisha@gmail.com",
          "fatherName": "Surya",
          "label": "Manisha",
          "motherName": "Savita",
          "officeLocation": "AHM",
          "panNumber": "BCDEF0123O",
          "permanentAddress": "Ahmedabad",
          "phoneNumber": "9123456792",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 14,
          "talentName": "Manisha",
          "talentSkills": "Blockchain",
          "tenthPercent": 94,
          "twelthPercent": 92,
          "value": 14
        }
      ],
      "trainer": {
        "designation": "Blockchain Developer",
        "email": "pankaj@gmail.com",
        "label": "Pankaj Singh",
        "location": "Gurgaon",
        "skills": ["Blockchain", "Solidity", "Ethereum"],
        "trainerId": "INC44",
        "trainerName": "Pankaj Singh",
        "value": "INC44"
      },
      "trainingDate": "2024-07-21",
      "trainingTech": "blockchain",
      "trainingTopic": "Smart Contracts",
      "weekNumber": 1,
      "actualTrainingDate": "2024-07-21",
      "comments": "Introduction to blockchain fundamentals.",
      "trainingStatus": "Scheduled"
    },
    {
      "startTime": "10:00",
      "endTime": "12:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "987654321014",
          "alternateNumber": "9876543217",
          "candidateId": 17,
          "cgpaMasters": 8.7,
          "cgpaUndergrad": 8.9,
          "collegeName": "IIT Bhubaneswar",
          "currentLocation": "Odisha",
          "department": "ME",
          "dob": "2002-03-13",
          "ekYear": "2022",
          "email": "sushant@gmail.com",
          "fatherName": "Arun",
          "label": "Sushant",
          "motherName": "Anita",
          "officeLocation": "BBS",
          "panNumber": "BCDEF2345P",
          "permanentAddress": "Bhubaneswar",
          "phoneNumber": "9123456793",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 15,
          "talentName": "Sushant",
          "talentSkills": "IoT",
          "tenthPercent": 91,
          "twelthPercent": 88,
          "value": 15
        }
      ],
      "trainer": {
        "designation": "IoT Architect",
        "email": "neha@gmail.com",
        "label": "Neha Sharma",
        "location": "Pune",
        "skills": ["IoT", "Embedded Systems", "Cloud Computing"],
        "trainerId": "INC45",
        "trainerName": "Neha Sharma",
        "value": "INC45"
      },
      "trainingDate": "2024-07-22",
      "trainingTech": "iot",
      "trainingTopic": "Embedded Systems",
      "weekNumber": 1,
      "actualTrainingDate": "2024-07-22",
      "comments": "Hands-on lab session on IoT devices.",
      "trainingStatus": "Scheduled"
    }
  ]
   )
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('trainingDate')
  const [selected, setSelected] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [openDeleteRowsModal, setOpenDeleteRowsModal] = useState(false)
  const [openCreateScheduleForm, setOpenCreateScheduleForm] = useState(false)
  const [openUpdateScheduleForm, setOpenUpdateScheduleForm] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const token = useSelector(state => state.user.token)

  const baseUrl = process.env.BASE_URL2

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       setIsLoading(true)
  //       setError(null)
  //       try {
  //         const response = await fetch(`${baseUrl}/api/training/read`, {
  //           headers: {
  //             Authorization: `Basic ${token}`,
  //           },
  //         })
  //         if (response.ok) {
  //           const data = await response.json()
  //           setScheduleList(data)
  //         }
  //       } catch (error) {
  //         console.error('Error fetching data:', error)
  //         setError(error.message)
  //       } finally {
  //         setIsLoading(false)
  //       }
  //     }

  //     fetchData()
  //   }, [])

  // ... (keep other functions like handleClose, handleCreate, handleSort, etc.)

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }

  //   const handleCreate = async formData => {
  //     setOpenCreateScheduleForm(false)
  //     setIsLoading(true)
  //     setError(null)
  //     setOpenSnackbar(null)

  //     try {
  //       const response = await fetch(`${baseUrl}/api/interviewer/create`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Basic ${token}`,
  //         },
  //         body: JSON.stringify(formData),
  //       })
  //       if (response.ok) {
  //         setError(null)
  //         const data = await response.json()
  //         setInterviewerList(prevInterviewerList => [
  //           ...prevInterviewerList,
  //           data,
  //         ])
  //         setOpenSnackbar('Interviewer created successfully!')
  //       }
  //     } catch (error) {
  //       console.error('Error creating Interviewer:', error)
  //       setError(error.message)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

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
      item =>
        item.trainingDate === row.trainingDate &&
        item.startTime === row.startTime,
    )
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row)
    } else {
      newSelected = selected.filter(
        item =>
          !(
            item.trainingDate === row.trainingDate &&
            item.startTime === row.startTime
          ),
      )
    }

    setSelected(newSelected)
    setSelectedSchedule(selected[0])
  }

  //   const handleDelete = async interviewerId => {
  //     setIsLoading(true)
  //     setError(null)
  //     setOpenSnackbar(null)
  //     console.log(interviewerId)
  //     try {
  //       const response = await fetch(
  //         `${baseUrl}/api/interviewer/delete/${interviewerId}`,
  //         {
  //           method: 'DELETE',
  //           headers: {
  //             Authorization: `Basic ${token}`,
  //           },
  //         },
  //       )

  //       if (response.ok) {
  //         setInterviewerList(prevInterviewers =>
  //           prevInterviewers.filter(
  //             interviewer => interviewer.interviewerId !== interviewerId,
  //           ),
  //         )
  //         setOpenSnackbar('Interviewer deleted successfully!')
  //         setError(null)
  //       }
  //     } catch (error) {
  //       console.error('Error deleting Interviewer:', error)
  //       setError(error.message)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }
  //   const handleUpdate = async formData => {
  //     setIsLoading(true)
  //     setOpenUpdateInterviewerForm(false)
  //     setSelected([])
  //     setError(null)
  //     setOpenSnackbar(null)
  //     try {
  //       const response = await fetch(
  //         `${baseUrl}/api/interviewer/update/${formData.interviewerId}`,
  //         {
  //           method: 'PUT',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Basic ${token}`,
  //           },
  //           body: JSON.stringify(formData),
  //         },
  //       )

  //       if (response.ok) {
  //         const data = await response.json()
  //         setError(null)
  //         setInterviewerList(prevInterviewers =>
  //           prevInterviewers.map(interviewer =>
  //             interviewer.interviewerId === data.interviewerId
  //               ? data
  //               : interviewer,
  //           ),
  //         )
  //         setOpenSnackbar('Interviewer updated successfully!')
  //         setError(null)
  //       }
  //     } catch (error) {
  //       console.error('Error updating college:', error)
  //       setError(error)
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   const handleDeleteSelectedRows = async () => {
  //     setOpenSnackbar(null)
  //     setError(null)
  //     setIsLoading(true)
  //     setOpenDeleteRowsModal(false)

  //     console.log(selected)
  //     let count = 0
  //     try {
  //       for (const row of selected) {
  //         await handleDelete(row.interviewerId)
  //         count++
  //       }
  //     } catch (error) {
  //       setError()
  //       setError(`Failed to delete interviewer(s): ${error.message}`)
  //     }

  //     setSelected([])
  //     setOpenSnackbar(`${count} interviewer(s) deleted successfully.`)
  //   }
  const handleSearch = event => {
    setSearchQuery(event.target.value)
  }

  const renderDeleteRowsModal = () => (
    <Dialog
      open={openDeleteRowsModal}
      onClose={() => setOpenDeleteRowsModal(false)}
    >
      <DialogTitle>Delete Schedule(s)</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete selected schedule(s)?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDeleteRowsModal(false)}>Cancel</Button>
        <Button onClick={() => {}} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const filteredData = scheduleList.filter(row => {
    const searchLower = searchQuery.toLowerCase()
    return (
      (row.trainingDate && row.trainingDate.includes(searchQuery)) ||
      (row.trainingTech &&
        row.trainingTech.toLowerCase().includes(searchLower)) ||
      (row.trainingTopic &&
        row.trainingTopic.toLowerCase().includes(searchLower)) ||
      (row.trainer &&
        row.trainer.trainerName &&
        row.trainer.trainerName.toLowerCase().includes(searchLower))
    )
  })

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
  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  )

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
              setOpenCreateScheduleForm(true)
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
              setOpenUpdateScheduleForm(true)
              setSelectedSchedule(selected[0])
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
                  active={orderBy === 'weekNumber'}
                  direction={orderBy === 'weekNumber' ? order : 'asc'}
                  onClick={() => handleSort('weekNumber')}
                >
                  <b>Week</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trainingDate'}
                  direction={orderBy === 'trainingDate' ? order : 'asc'}
                  onClick={() => handleSort('trainingDate')}
                >
                  <b>Planned Date</b>
                </TableSortLabel>
              </TableCell>

              <TableCell>
                <TableSortLabel
                  active={orderBy === 'actualTrainingDate'}
                  direction={orderBy === 'actualTrainingDate' ? order : 'asc'}
                  onClick={() => handleSort('actualTrainingDate')}
                >
                  <b>Actual Date</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'startTime'}
                  direction={orderBy === 'startTime' ? order : 'asc'}
                  onClick={() => handleSort('startTime')}
                >
                  <b>Start Time</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'endTime'}
                  direction={orderBy === 'endTime' ? order : 'asc'}
                  onClick={() => handleSort('endTime')}
                >
                  <b>End Time</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trainingTech'}
                  direction={orderBy === 'trainingTech' ? order : 'asc'}
                  onClick={() => handleSort('trainingTech')}
                >
                  <b>Technology</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trainingTopic'}
                  direction={orderBy === 'trainingTopic' ? order : 'asc'}
                  onClick={() => handleSort('trainingTopic')}
                >
                  <b>Topic</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trainer.trainerName'}
                  direction={orderBy === 'trainer.trainerName' ? order : 'asc'}
                  onClick={() => handleSort('trainer.trainerName')}
                >
                  <b>Trainer</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'trainingStatus'}
                  direction={orderBy === 'trainingStatus' ? order : 'asc'}
                  onClick={() => handleSort('trainingStatus')}
                >
                  <b>Status</b>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'comments'}
                  direction={orderBy === 'comments' ? order : 'asc'}
                  onClick={() => handleSort('comments')}
                >
                  <b>Comments</b>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData &&
              paginatedData.map(row => (
                <Row
                  key={`${row.trainingDate}-${row.startTime}`}
                  row={row}
                  selected={selected.some(
                    item =>
                      item.trainingDate === row.trainingDate &&
                      item.startTime === row.startTime,
                  )}
                  onSelectChange={() => handleSelect(row)}
                  searchQuery={searchQuery}
                />
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component='div'
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={event => {
          setRowsPerPage(parseInt(event.target.value, 10))
          setPage(0)
        }}
      />

      {renderDeleteRowsModal()}

      {openCreateScheduleForm && (
        <TrainingScheduleForm
          open={openCreateScheduleForm}
          setOpen={setOpenCreateScheduleForm}
        />
      )}
      {openUpdateScheduleForm && (
        <TrainingScheduleUpdateForm
          open={openUpdateScheduleForm}
          setOpen={setOpenUpdateScheduleForm}
          // updateInterviewer={handleUpdate}
          currentSchedule={selectedSchedule}
        />
      )}

      {isLoading && (
        <Box
          sx={{ display: 'flex' }}
          className='flex h-full items-center justify-center'
        >
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
