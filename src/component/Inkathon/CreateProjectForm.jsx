import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  FileInput,
  Select,
  Progress,
  Alert,
} from 'flowbite-react'

export function CreateProjectForm({ openModal, setOpenModal, createAssignment }) {
  const [assignmentWeek, setAssignmentWeek] = useState('')
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [assignmentFile, setAssignmentFile] = useState(null)
  const [assignmentFileName, setAssignmentFileName] = useState(null)
  const [assignedTo, setAssignedTo] = useState('');
  const [assignmentFileUrl, setAssignmentFileUrl] = useState(null)
  const [assignmentFileUploadProgress, setAssignmentFileUploadProgress] =
    useState(null)
  const [assignmentFileUploadError, setAssignmentFileUploadError] =
    useState(null)
  const [assignmentFileUploading, setAssignmentFileUploading] = useState(false)
  const [talentList, setTalentList] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [FilteredTalentList, setFilteredTalentList] = useState([])
  const tanBaseUrl = process.env.BASE_URL
  const urlParams = new URLSearchParams(location.search)
  const inkathonId = urlParams.get('id')
  useEffect(() => {
    fetchTalentList()
  }, [])
  const technologySkills = {
    "Java": ["Java", "Spring", "Hibernate"],
    "React": ["React", "JavaScript", "HTML", "CSS"],
    "JavaScript": ["JavaScript", "Node.js", "Express.js"],
    "UI 5": ["UI 5", "SAPUI5", "HTML", "CSS"],
    "Integration": ["Integration", "API", "Microservices"],
    // Add SolidWorks, AutoCAD, ANSYS for relevant technologies
    "Mechanical Engineering": ["SolidWorks", "AutoCAD", "ANSYS"],
    "Civil Engineering": ["AutoCAD", "Revit", "STAAD.Pro"],
    // Add more technologies and their required skills as needed
};


  const fetchTalentList = async () => {
    try {
      const response = await fetch('http://localhost:8080/cpm/talents/alltalent')
      if (!response.ok) {
        throw new Error('Failed to fetch talent list')
      }
      const data = await response.json()
      setTalentList(data)
      console.log('Talent list:', data)
    } catch (error) {
      console.error('Error fetching talent list:', error)
    }
  }
  const handleselectedtalent = (talent, index) => {
    const newselectedtalent = selectedTalents.filter((tal, i) => (
      tal != talent
    ))
    setSelectedTalents(newselectedtalent)
  }
  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      projectName,
      projectDescription,
      assignmentFileName,
      assignmentFileUrl,
    }
    console.log(formData)
    handleFileUpload(formData);
  }

  const handleFileUpload = async (formData) => {
    try {
      if (!assignmentFile) {
        setAssignmentFileUploadError('No file selected')
        return
      }

      if (
        !assignmentFile.type.startsWith('application/pdf') ||
        assignmentFile.size > 2 * 1024 * 1024
      ) {
        setAssignmentFileUploadError(
          'File must be of type pdf and less than 4mb',
        )
        setAssignmentFile(null)
        setAssignmentFileUrl(null)
        setAssignmentFileUploadProgress(null)
        console.log('File must be of type pdf')
        return
      }

      setAssignmentFileUploadError(null)
      setAssignmentFileUploading(true)

      const formData = new FormData()
      
      // Append the string to the FormData
      formData.append('projectName', projectName );
      formData.append('projectDescription', projectDescription );
      formData.append('projectDescriptionFile', assignmentFile )

      const response = await fetch(`${tanBaseUrl}/api/projects/create/${inkathonId}`, {
        method: 'POST',
        body: formData,
      })
      console.log(response)
      if (response.ok) {
        alert('File uploaded successfully.')
        window.location.reload()
      } else {
        alert('Failed to upload file.')
      }
    } catch (error) {
      setAssignmentFileUploadError('Could not upload File')
      console.log(error)
    }

  }

  const handleFileChange = async e => {
    setAssignmentFile(e.target.files[0])
    setAssignmentFileName(e.target.files[0].name)
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='projectName' value='Project Name' />
            </div>
            <TextInput
              id='projectName'
              type='text'
              placeholder='Enter project name'
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='projectDescription' value='Project Description' />
            </div>
            <TextInput
              id='projectDescription'
              type='text'
              placeholder='Enter project description'
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='projectFile' value='Project File (pdf)' />
            </div>
            <FileInput
              id='projectFile'
              type='file'
              helperText='PDF(Max size 2 MB)'
              accept='.pdf'
              onChange={handleFileChange}
              required
              size={'sm'}
            />
          </div>
          {assignmentFileUploadProgress && (
            <Progress progress={assignmentFileUploadProgress} />
          )}
          {assignmentFileUploadError && (
            <Alert color={'failure'}>{assignmentFileUploadError}</Alert>
          )}
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Inkathon Project
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
