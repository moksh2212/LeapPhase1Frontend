import { useEffect, useMemo, useState } from 'react'
import {CreateProjectForm} from './CreateProjectForm'
import {CreateTeamForm} from './CreateTeamForm'
import {UpdateProjectForm} from './UpdateProjectForm'
import {UpdateTeamForm} from './UpdateTeamForm'
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
} from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default function CreateInkathon() {
  
  const [projectList, setProjectList] = useState([])
  const [openCreateProjectForm, setOpenCreateProjectForm] = useState(false)
  const [projToEdit, setProjToEdit] = useState(false)
  const [openUpdateProjectForm, setOpenUpdateProjectForm] = useState(false)
  const [projectIdToDelete, setProjectIdToDelete] = useState(null)
  const [openProjectDeleteModal, setOpenProjectDeleteModal] = useState(false)

  const [teamList, setTeamList] = useState([])
  const [openCreateTeamForm, setOpenCreateTeamForm] = useState(false)
  const [teamToEdit, setTeamToEdit] = useState(false)
  const [openUpdateTeamForm, setOpenUpdateTeamForm] = useState(false)
  const [teamIdToDelete, setTeamIdToDelete] = useState(null)
  const [openTeamDeleteModal, setOpenTeamDeleteModal] = useState(false)


  const [error, setError] = useState()
  const [currInkathon, setCurrInkathon] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [rowSelection, setRowSelection] = useState({})
  const [projectTitles, setProjectTitles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState({})





  const urlParams = new URLSearchParams(location.search)
  const inkathonId = urlParams.get('id')
  const tanBaseUrl = process.env.BASE_URL


  const projectFileCell = ({ cell }) => {
    const projectFileBase64 = cell.getValue();
  
    // Check if the projectFileBase64 is null
    if (!projectFileBase64) {
      return (
        <Box display="flex" justifyContent="center">
          <Button disabled>NA</Button>
        </Box>
      );
    }
  
    // Decode the base64 string
    const byteCharacters = atob(projectFileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    // Create a Blob from the byteArray
    const blob = new Blob([byteArray], { type: 'application/pdf' });
  
    // Create an object URL from the Blob
    const url = window.URL.createObjectURL(blob);
  
    const handleViewMarksheet = async () => {
      window.open(url, '_blank');
    };
  
    return (
      <Box display="flex" justifyContent="center">
        <Button onClick={handleViewMarksheet}>
          View
        </Button>
      </Box>
    );
  };
  projectFileCell.propTypes = {
    row: PropTypes.shape({
      original: PropTypes.shape({
        talentId: PropTypes.string.isRequired,
        marksheetsSemwise: PropTypes.bool.isRequired,
      }).isRequired,
    }).isRequired,
  }
  const teamsActionCell = ({ cell }) => {
    // Assuming cell.getValue() is the method to get the Inkathon ID
    const teamId = cell.getValue()

    // Construct the URL with the Inkathon ID as a query parameter
    const url = `?tab=createinkathon&id=${teamId}`

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
  const createProject = async formData => {
    setOpenCreateProjectForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${tanBaseUrl}/assignments/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setProjectList(prevProjects => [...prevProjects, data])
        setOpenSnackbar('Project created successfully!')
      }
    } catch (error) {
      console.error('Error creating Project:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const updateProject = async formData => {
    setOpenUpdateProjectForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${tanBaseUrl}/assignments/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setProjectList(prevProjects => [...prevProjects, data])
        setOpenSnackbar('Project created successfully!')
      }
    } catch (error) {
      console.error('Error creating Project:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleProjectDelete = async () => {
    await deleteProject(projectIdToDelete)
    setOpenProjectDeleteModal(false)
  }
  const deleteProject = async projectId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${tanBaseUrl}/api/projects/delete/${projectId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjectList(prevProjects =>
          prevProjects.filter(project => project.projectId !== projectId),
        )
        setOpenSnackbar('Project deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Project:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const renderProjectDeleteModal = () => (
    <Dialog open={openProjectDeleteModal} onClose={() => setOpenProjectDeleteModal(false)}>
      <DialogTitle>Delete Project</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Project?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenProjectDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting Project with ID:', projectIdToDelete)
            handleProjectDelete()
          }}
          color='error'
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )


  const createTeam = async formData => {
    setOpenCreateProjectForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    console.log(formData)

    try {
      const response = await fetch(`${tanBaseUrl}/api/teams/create/${inkathonId}/${formData.projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setTeamList(prevTeams => [...prevTeams, data])
        setOpenSnackbar('Team created successfully!')
      }
    } catch (error) {
      console.error('Error creating Team:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const updateTeam = async formData => {
    setOpenUpdateProjectForm(false)
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)

    try {
      const response = await fetch(`${tanBaseUrl}/assignments/Create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        setError(null)
        const data = await response.json()
        setProjectList(prevProjects => [...prevProjects, data])
        setOpenSnackbar('Project created successfully!')
      }
    } catch (error) {
      console.error('Error creating Project:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const handleTeamDelete = async () => {
    await deleteTeam(teamIdToDelete)
    setOpenTeamDeleteModal(false)
  }
  const deleteTeam = async teamId => {
    setIsLoading(true)
    setError(null)
    setOpenSnackbar(null)
    try {
      const response = await fetch(`${tanBaseUrl}/api/teams/delete/${teamId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTeamList(prevTeams =>
          prevTeams.filter(team => team.teamId !== teamId),
        )
        setOpenSnackbar('Team deleted successfully!')
        setError(null)
      }
    } catch (error) {
      console.error('Error deleting Team:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }
  const renderTeamDeleteModal = () => (
    <Dialog open={openTeamDeleteModal} onClose={() => setOpenTeamDeleteModal(false)}>
      <DialogTitle>Delete Team</DialogTitle>
      <DialogContent>
        <p>Are you sure you want to delete this Team?</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenTeamDeleteModal(false)}>Cancel</Button>
        <Button
          onClick={() => {
            console.log('Deleting Team with ID:', teamIdToDelete)
            handleTeamDelete()
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
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(talentToUpdate),
        },
      )

      if (response.ok) {
        const data = await response.json()
        setTeamList(prevTalents =>
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
        const inkResponse = await fetch(`${tanBaseUrl}/api/inkathons/${inkathonId}`)
        const projectResponse = await fetch(`${tanBaseUrl}/api/projects/getInkathonProject/${inkathonId}`)
        const teamResponse = await fetch(`${tanBaseUrl}/api/teams/getInkathonTeams/${inkathonId}`)
  
        if (inkResponse.status === 204) {
          setCurrInkathon(null) // or set to an empty object {}
        } else {
          const inkathon = await inkResponse.json()
          setCurrInkathon(inkathon)
        }
  
        if (teamResponse.status === 204) {
          setTeamList([]) // or set to null
        } else {
          const teams = await teamResponse.json()
          setTeamList(teams)
        }
  
        if (projectResponse.status !== 200) {
          setProjectList([]) // or set to null
        } else {
          const projects = await projectResponse.json()
          setProjectList(projects)
          setProjectTitles(projects.map(project => ({
            projectId: project.projectId,
            projectTitle: project.projectTitle
          })))
          
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
  const projectColumns = useMemo(() => [
    {
      id: 'projects',
      columns: [
        {
          accessorKey: 'projectId', //hey a simple column for once
          header: 'Project Id',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 50,
        },
        {
          accessorKey: 'projectTitle', //hey a simple column for once
          header: 'Project Title',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'projectDescription', //hey a simple column for once
          header: 'Project Description',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'teamCount', //hey a simple column for once
          header: 'No. of Teams',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'descriptionFile',
          header: 'Description File',
          size: 100,
          Cell: projectFileCell,
        },
      ],
    },
  ])
  const teamsColumns = useMemo(() => [
    {
      id: 'teams',
      columns: [
        {
          id: 'action',
          accessorKey: 'teamId', // Assuming you want to pass inkathonId as parameter
          header: 'Access Team',
          disableFilters: true,
          disableSortBy: true,
          size: 100,
          Cell: teamsActionCell,
        },
        {
          accessorKey: 'teamId', //hey a simple column for once
          header: 'Team Id',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'teamName', //hey a simple column for once
          header: 'Team Name',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
        {
          accessorKey: 'membersCount', //hey a simple column for once
          header: 'Members',
          enableColumnFilter: false,
          enableSorting: false,
          enableEditing: false,
          size: 100,
        },
        {
          accessorKey: 'progress', //hey a simple column for once
          header: 'Progress',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },    
        {
          accessorKey: 'projectId', //hey a simple column for once
          header: 'ProjectId',
          enableColumnFilter: false,
          enableSorting: false,
          size: 100,
        },
      ],
    },
  ])

  const teamsTable = useMaterialReactTable({
    columns: teamsColumns,
    data: teamList,
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
          setTeamIdToDelete(row.original.teamId)
          setOpenTeamDeleteModal(true)}}>
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
              setOpenCreateTeamForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            Create New Team
          </Button>
        </div>
      )
    },
  })
  const projectTable = useMaterialReactTable({
    columns: projectColumns,
    data: projectList,
    initialState: { columnVisibility: { talentId: true } },
    isLoading,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableRowActions: true,
    renderRowActions: ({ row ,closeMenu}) => (
      <Box>
        <IconButton onClick={() => {
          setOpenUpdateProjectForm(true)
          setProjToEdit(row.original)}}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => {
          setProjectIdToDelete(row.original.projectId)
          setOpenProjectDeleteModal(true)
          closeMenu()}}>
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
              setOpenCreateProjectForm(true)
            }}
            disabled={selectedRows.length !== 0}
          >
            Create New Project
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
          <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
            {currInkathon.title}
          </h2>
          <br />
          <br />
          <h2 className='text-2xl text-[#0087D5] font-bold mb-3'>
            {currInkathon.creationDate}
          </h2>
          <br />
          <br />
          <h5 className='text-xl text-[#00001] font-bold mb-3'>
            {currInkathon.description}
          </h5>
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
      </div>
      <div className='flex flex-column'>
        <div className='w-full p-4 bg-gray-100 '>
          <div className='flex flex-row gap-x-4'>
            <div className='w-2/5 p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>
                Projects
              </h2>
              {/* Second column content */}
              <br></br>
              <br></br>
              {isLoading && (
                <div className='flex min-h-[70vh] justify-center items-center'>
                  <CircularProgress className='w-full mx-auto my-auto' />
                </div>
              )}
              {!isLoading && (
                <MaterialReactTable
                  table={projectTable}
                  updateTalent={updateTalent}
                />
              )}
              {openCreateProjectForm && (
                <CreateProjectForm
                  openModal={openCreateProjectForm}
                  setOpenModal={setOpenCreateProjectForm}
                  createProject={createProject}
                />
              )}
              {openUpdateProjectForm && (
                <UpdateProjectForm
                  openModal={openUpdateProjectForm}
                  setOpenModal={setOpenUpdateProjectForm}
                  updateProject={updateProject}
                  projForm={projToEdit}
                />
              )}
              {renderProjectDeleteModal()}
            </div>
            <div className='w-3/5 p-4 bg-gray-200'>
              <h2 className='text-3xl text-[#0087D5] font-bold mb-3'>Teams</h2>
              {/* Second column content */}
              <br></br>
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
              
              {openCreateTeamForm && (
                <CreateTeamForm
                  openModal={openCreateTeamForm}
                  setOpenModal={setOpenCreateTeamForm}
                  createTeam={createTeam}
                  projectTitles={projectTitles}
                />
              )}
              {openUpdateTeamForm && (
                <UpdateTeamForm
                  openModal={openUpdateTeamForm}
                  setOpenModal={setOpenUpdateTeamForm}
                  updateTeam={updateTeam}
                  teamForm={teamToEdit}
                  projectTitles={projectTitles}
                />
              )}
              {renderTeamDeleteModal()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
