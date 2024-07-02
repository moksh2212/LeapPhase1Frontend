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
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage'

import { app } from '../../firebase.js'

export function UpdateProjectForm({ openModal, setOpenModal, updateProject , projForm, }) {
  const [projectId, setProjectId] = useState(projForm.projectId)
  const [projectTitle, setProjectTitle] = useState(projForm.projectTitle)
  const [projectDescription, setProjectDescription] = useState(projForm.projectDescription)
  const [projectFile, setProjectFile] = useState(null)

  const [assignmentFileUploadProgress, setAssignmentFileUploadProgress] =
    useState(null)
  const [assignmentFileUploadError, setAssignmentFileUploadError] =
    useState(null)
  const [assignmentFileUploading, setAssignmentFileUploading] = useState(false)
  const [talentList, setTalentList] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([]);
  const tanBaseUrl = process.env.BASE_URL
  const urlParams = new URLSearchParams(location.search)
  const inkathonId = urlParams.get('id')

  
  useEffect(() => {
    if (projectFile) {
      handleFileUpload()
    }
  }, [projectFile])

  const handleSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
      
      // Append the string to the FormData
      formData.append('projectTitle', projectTitle );
      formData.append('projectDescription', projectDescription );
      formData.append('projectFile', projectFile )
      console.log( formData)
      updateProject( formData ,projectId);
    
  }

  const handleFileUpload = async () => {
    try {
      if (!projectFile) {
        setAssignmentFileUploadError('No file selected')
        return
      }

      if (
        !projectFile.type.startsWith('application/pdf') ||
        projectFile.size > 2 * 1024 * 1024
      ) {
        setAssignmentFileUploadError(
          'File must be of type pdf and less than 4mb',
        )
        setAssignmentFileUploadProgress(null)
        console.log('File must be of type pdf')
        return
      }

      setAssignmentFileUploadError(null)
      setAssignmentFileUploading(true)
      const storage = getStorage(app)
      const fileName = projectFile.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, projectFile)

      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          setAssignmentFileUploadProgress(progress.toFixed(0))
        },
        error => {
          setAssignmentFileUploadError('Could not upload file')
          setAssignmentFileUploadProgress(null)
          setAssignmentFile(null)
          setAssignmentFileName(null)
          setAssignmentFileUrl(null)
          setAssignmentFileUploading(false)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            setAssignmentFileUploadProgress(null)
            setAssignmentFileUrl(downloadURL)
            setAssignmentFileUploading(false)
            setAssignmentFileUrl(downloadURL)

            console.log(downloadURL)
          })
        },
      )
    } catch (error) {
      setAssignmentFileUploadError('Could not upload Image')
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
              <Label htmlFor='projectTitle' value='Assignment Name' />
            </div>
            <TextInput
              id='projectTitle'
              type='text'
              placeholder=''
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='projectDescription' value='Assignment Description' />
            </div>
            <TextInput
              id='projectDescription'
              type='text'
              placeholder=''
              value={projectDescription}
              onChange={e => setProjectDescription(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label
                htmlFor='projectFile'
                value='Assignment File (upload if you want to change previous) '
              />
            </div>
            <FileInput
              id='projectFile'
              type='file'
              helperText='PDF(Max size 2 MB)'
              accept='.pdf'
              onChange={handleFileChange}
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
            Submit
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
