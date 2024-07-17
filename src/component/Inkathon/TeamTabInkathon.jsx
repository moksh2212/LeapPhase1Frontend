import { useEffect, useMemo, useState } from 'react'
import { AddMembers } from './AddMembers'
import { AddProjectManager } from './AddProjectManager'
import { AddMentors } from './AddMentors'
import { useSelector } from 'react-redux'
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
  Snackbar,
  LinearProgress,
  Typography,
  styled
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ChangeCircle as ChangeCircleIcon,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { linearProgressClasses } from '@mui/material/LinearProgress';

export default function TeamTabInkathon() {
  const [memberList, setMemberList] = useState([])
  const [openAddMemberForm, setOpenAddMemberForm] = useState(false)
  const [openAddPmForm, setOpenAddPmForm] = useState(false)
  const [openAddMentorForm, setOpenAddMentorForm] = useState(false)

  const [teamToEdit, setTeamToEdit] = useState(false)
  const [openUpdateTeamForm, setOpenUpdateTeamForm] = useState(false)

  const [memberIdToDelete, setMemberIdToDelete] = useState(null)
  const [mentorIdToDelete, setMentorIdToDelete] = useState(null)

  const [openMemberDeleteModal, setOpenMemberDeleteModal] = useState(false)
  const [openMentorDeleteModal, setOpenMentorDeleteModal] = useState(false)

  const [mentorList, setMentorList] = useState([])
  const [projectManager, setProjectManager] = useState('Not Assigned')
  const [managerId, setManagerId] = useState(-1)
  const [error, setError] = useState()
  const [currTeam, setCurrTeam] = useState({
    teamId: null,
    teamName: '',
    membersCount: 0,
    progress: 0,
    presentationFile: null,
    projects: {
      projectId: null,
      projectTitle: '',
      projectDescription: '',
      descriptionFile: '',
    },
    mentor: [],
    manager: null,
  })

  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const token = useSelector(state => state.user.token)

  const urlParams = new URLSearchParams(location.search)
  const currTeamId = urlParams.get('id')
  const tanBaseUrl = process.env.BASE_URL
  const [progress, setProgress] = useState(0)

  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
    },
  }));
  
  // LinearProgressWithLabel Component
  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <BorderLinearProgress variant='determinate' {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant='body2' color='text.secondary'>{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  }

  const createMember = async formData => {
    setOpenAddMemberForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)
    formData.append('teamId', currTeam.teamId)
    try {
      const response = await fetch(`${tanBaseUrl}/api/members/add`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setMemberList(prevMembers => [...prevMembers, data])
        setOpenSnackbar('Member added successfully!')
        setIsLoading(false)
      } else {
        setError('Error adding member: Talent already exists in another team')
      }
    } catch (error) {
      console.error('Error Adding Member:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const createMentor = async formData => {
    setOpenAddMentorForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)
    formData.append('teamId', currTeam.teamId)
    try {
      const response = await fetch(`${tanBaseUrl}/api/mentors/addMentor`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setMentorList(prevMentors => [...prevMentors, data])
        setOpenSnackbar('Mentor added successfully!')
        setIsLoading(false)
      } else {
        setError('Error adding mentor')
      }
    } catch (error) {
      console.error('Error Adding Member:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const createPm = async formData => {
    setOpenAddPmForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)
    formData.append('teamId', currTeam.teamId)
    if (managerId !== -1) {
      formData.append('managerId', managerId)
    } else {
      formData.append('managerId', -1)
    }
    try {
      const response = await fetch(`${tanBaseUrl}/api/manager/addManager`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (response.ok) {
        const pm = await response.json()
        setError(null)
        setProjectManager(pm)
        setManagerId(pm.managerId)
        setOpenSnackbar('Manager added successfully!')
        setIsLoading(false)
      } else {
        setError('Error adding manager')
      }
    } catch (error) {
      console.error('Error Adding Manager:', error)
      setError(pm.message + ':')
    } finally {
      setIsLoading(false)
    }
  }
  const handleMemberDelete = async () => {
    await deleteMember(memberIdToDelete)
    setOpenMemberDeleteModal(false)
  }
  const handleMentorDelete = async () => {
    await deleteMentor(memberIdToDelete)
    setOpenMentorDeleteModal(false)
  }
  const deleteMember = async memberId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${tanBaseUrl}/api/members/delete/${memberId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        setMemberList(prevMembers =>
          prevMembers.filter(member => member.memberId !== memberId),
        )
        setOpenSnackbar('Member deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Member:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const deleteMentor = async memberId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(
        `${tanBaseUrl}/api/mentors/delete/${memberId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.ok) {
        setMentorList(prevMentors =>
          prevMentors.filter(mentors => mentors.mentorId !== memberId),
        )
        setOpenSnackbar('Mentor deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Mentor:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const renderMemberDeleteModal = () => (
    <Dialog
      open={openMemberDeleteModal}
      onClose={() => setOpenMemberDeleteModal(false)}
    >
      <DialogTitle>Delete Member</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Member?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenMemberDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting Member with ID:', memberIdToDelete)
            handleMemberDelete()
          }}
          color='error'
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const renderMentorDeleteModal = () => (
    <Dialog
      open={openMentorDeleteModal}
      onClose={() => setOpenMentorDeleteModal(false)}
    >
      <DialogTitle>Delete Mentor</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Mentor?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenMentorDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting Mentor with ID:', memberIdToDelete)
            handleMentorDelete(memberIdToDelete)
          }}
          color='error'
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    if (error) {
      setError(null)
    }

    setOpenSnackbar(false)
  }
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
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(talentToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setMemberList(prevTalents =>
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
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const currTeamResponse = await fetch(
          `${tanBaseUrl}/api/teams/${currTeamId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (currTeamResponse.status === 204) {
          setCurrTeam({
            teamId: null,
            teamName: '',
            membersCount: 0,
            progress: 0,
            presentationFile: null,
            projects: {
              projectId: null,
              projectTitle: '',
              projectDescription: '',
              descriptionFile: '',
            },
            mentor: [],
            manager: null,
          })
        } else {
          const team = await currTeamResponse.json()
          setCurrTeam(team)
          setProgress(team.progress)
          setMemberList(team.members)
          setMentorList(team.mentor)
          if (team.manager != null) {
            setProjectManager(team.manager)
            setManagerId(team.manager.managerId)
          }

          console.log(team)
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

  //tABLES ________________________________________________________________________________________________________________________________________________________________________________________________
  const teamsColumns = useMemo(() => [
    {
      id: 'members',
      columns: [
        {
          accessorKey: 'talentId', //hey a simple column for once
          header: 'Talent Id',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'name', //hey a simple column for once
          header: 'Name',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'ekYear', //hey a simple column for once
          header: 'EK YEAR',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'role', //hey a simple column for once
          header: 'ROLE',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'skills', //hey a simple column for once
          header: 'Skills',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'performanceRating', //hey a simple column for once
          header: 'Performance Rating',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
      ],
    },
  ])
  const mentorsColumns = useMemo(() => [
    {
      id: 'mentors',
      columns: [
        {
          accessorKey: 'talentId', //hey a simple column for once
          header: 'Talent Id',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'name', //hey a simple column for once
          header: 'Name',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'skills', //hey a simple column for once
          header: 'Skills',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
      ],
    },
  ])

  const teamsTable = useMaterialReactTable({
    columns: teamsColumns,
    data: memberList,
    initialState: { columnVisibility: { talentId: true } },
    isLoading,
    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        {/* <IconButton
          onClick={() => {
            setOpenUpdateTeamForm(true)
            setTeamToEdit(row.original)
          }}
        >
          <EditIcon />
        </IconButton> */}
        <IconButton
          onClick={() => {
            setMemberIdToDelete(row.original.memberId)
            setOpenMemberDeleteModal(true)
          }}
        >
          <DeleteIcon />
        </IconButton>
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
              setOpenAddMemberForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            + Add Member
          </Button>
        </div>
      )
    },
  })

  const mentorsTable = useMaterialReactTable({
    columns: mentorsColumns,
    data: mentorList,
    initialState: { columnVisibility: { talentId: true } },
    isLoading,
    enableEditing: true,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Box>
        {/* <IconButton
          onClick={() => {
            setOpenUpdateTeamForm(true)
            setTeamToEdit(row.original)
          }}
        >
          <EditIcon />
        </IconButton> */}
        <IconButton
          onClick={() => {
            setMemberIdToDelete(row.original.mentorId)
            setOpenMentorDeleteModal(true)
          }}
        >
          <DeleteIcon />
        </IconButton>
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
              setOpenAddMentorForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            + Add Mentor
          </Button>
        </div>
      )
    },
  })

  return (
    <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-full'>
      <div className='flex flex-col mx-5 mt-2 overflow-x-auto max-w-full'>
        <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>iNKATHON</h2>
      </div>
      <div className='w-full p-4 bg-gray-100'>
        <div className='w-full p-4 bg-gray-200'>
          <div className='flex flex-row gap-x-6'>
            <div className='w-full p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                TEAM : {currTeam.teamName}
              </h2>
              <br />
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                {currTeam && currTeam.projects
                  ? `PROJECT: ${currTeam.projects.projectTitle}`
                  : ' PROJECT: Loading...'}
              </h2>
              <br />
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                PROJECT MANAGER: {projectManager.name}
                <IconButton
                  onClick={() => {
                    setOpenAddPmForm(true)
                  }}
                >
                  <ChangeCircleIcon />
                </IconButton>
              </h2>
            </div>
            <div className='w-full p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                {currTeam && currTeam.membersCount
                  ? `MEMBERS COUNT: ${currTeam.membersCount}`
                  : 'MEMBERS COUNT: 0'}
              </h2>
              <br/>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                Progress:
              </h2>
              <br/>
              <Box sx={{ width: '100%' }}>
                <LinearProgressWithLabel value={progress} />
              </Box>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-column'>
        <div className='w-full p-4 bg-gray-100 '>
          <div className='flex flex-row gap-x-4'>
            <div className='w-full p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                Mentors
              </h2>
              {!isLoading && (
                <MaterialReactTable
                  table={mentorsTable}
                  updateTalent={updateTalent}
                />
              )}
              <br></br>
              {/* Second column content */}
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                Members
              </h2>

              {isLoading && (
                <div className='flex min-h-[70vh] justify-center items-center'>
                  <CircularProgress className='w-full mx-auto my-auto' />
                </div>
              )}
              {!isLoading && (
                <MaterialReactTable
                  table={teamsTable}
                  updateTalent={updateTalent}
                />
              )}

              {openAddMemberForm && (
                <AddMembers
                  openModal={openAddMemberForm}
                  setOpenModal={setOpenAddMemberForm}
                  createMember={createMember}
                />
              )}

              {openAddMentorForm && (
                <AddMentors
                  openModal={openAddMentorForm}
                  setOpenModal={setOpenAddMentorForm}
                  createMentor={createMentor}
                />
              )}

              {openAddPmForm && (
                <AddProjectManager
                  openModal={openAddPmForm}
                  setOpenModal={setOpenAddPmForm}
                  createPm={createPm}
                />
              )}
              {renderMemberDeleteModal()}
              {renderMentorDeleteModal()}
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={!!openSnackbar} // Convert openSnackbar to a boolean value
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
