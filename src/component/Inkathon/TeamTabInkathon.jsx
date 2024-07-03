import { useEffect, useMemo, useState } from 'react'
import {AddMembers} from './AddMembers'
import {UpdateTeamForm} from './UpdateTeamForm'
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
} from '@mui/material'
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function TeamTabInkathon() {

  const [memberList, setMemberList] = useState([])
  const [openAddMemberForm, setOpenAddMemberForm] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState(false)
  const [openUpdateTeamForm, setOpenUpdateTeamForm] = useState(false)
  const [memberIdToDelete, setMemberIdToDelete] = useState(null)
  const [openTeamDeleteModal, setOpenMemberDeleteModal] = useState(false)

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
      descriptionFile: ''
    },
    mentor: [],
    manager: null
  });
  
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [rowSelection, setRowSelection] = useState({})
  const [projectTitles, setProjectTitles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})
  const token = useSelector(state => state.user.token)

  const urlParams = new URLSearchParams(location.search)
  const currTeamId = urlParams.get('id')
  const tanBaseUrl = process.env.BASE_URL



  const teamsActionCell = ({ cell }) => {
    // Assuming cell.getValue() is the method to get the Inkathon ID
    const teamId = cell.getValue()

    // Construct the URL with the Inkathon ID as a query parameter
    const url = `?tab=teamtabinkathon&id=${teamId}`

    return (
      <Box display='flex' justifyContent='center'>
        <Link to={url}>
          <Button>Details</Button>
        </Link>
      </Box>
    )
  }
  teamsActionCell.propTypes = {
    cell: PropTypes.shape({
      getValue: PropTypes.func.isRequired,
    }).isRequired,
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
          Authorization: `Basic ${token}`
        },
        body: formData,
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setMemberList(prevMembers => [...prevMembers, data])
        setOpenSnackbar('Member added successfully!')
        setIsLoading(false)
      }else{
        setError('Error adding member: Talent already exists in another team')
      }
    } catch (error) {
      console.error('Error Adding Member:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleMemberDelete = async () => {
    await deleteMember(memberIdToDelete)
    setOpenMemberDeleteModal(false)
  }
  const deleteMember = async memberId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${tanBaseUrl}/api/members/delete/${memberId}`, {
        
        method: 'DELETE',
        headers:{
          Authorization: `Basic ${token}`,
        }
      })

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
  const renderMemberDeleteModal = () => (
    <Dialog open={openTeamDeleteModal} onClose={() => setOpenMemberDeleteModal(false)}>
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
            Authorization: `Basic ${token}`,
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
        const currTeamResponse = await fetch(`${tanBaseUrl}/api/teams/${currTeamId}`,{
          headers: {
            Authorization: `Basic ${token}`,
          },
        })
  
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
              descriptionFile: ''
            },
            mentor: [],
            manager: null
          });
        } else {
          const team = await currTeamResponse.json();
          setCurrTeam(team);
          setMemberList(team.members)
          console.log(team);
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
        <IconButton onClick={() => {
          setOpenUpdateTeamForm(true)
          setTeamToEdit(row.original)}}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => {
          setMemberIdToDelete(row.original.memberId)
          setOpenMemberDeleteModal(true)}}>
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
            +  Add Member
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
                {currTeam && currTeam.manager
                  ? `PROJECT MANAGER: ${currTeam.manager.name}`
                  : ' PROJECT MANAGER: Not Assigned'}
              </h2>

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
            <div className='w-full p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                {currTeam && currTeam.membersCount  
                  ? `MEMBERS COUNT: ${currTeam.membersCount}`
                  : 'MEMBERS COUNT: 0'}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-column'>
        <div className='w-full p-4 bg-gray-100 '>
          <div className='flex flex-row gap-x-4'>
            <div className='w-full p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>Members</h2>
              {/* Second column content */}
              <br></br>
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
              {renderMemberDeleteModal()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
