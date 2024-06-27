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

export function UpdateForm({ openModal, setOpenModal, createAssignment, assnForm, }) {
  const [assignmentWeek, setAssignmentWeek] = useState(assnForm.assignmentWeek);
  const [assignmentName, setAssignmentName] = useState(assnForm.assignmentName)
  const [assignmentTechnology, setAssignmentTechnology] = useState((assnForm.assignmentTechnology) ? (assnForm.assignmentTechnology) : ('Java'))
  const [assignmentDuedate, setAssignmentDuedate] = useState(assnForm.assignmentDuedate)
  const [assignmentFile, setAssignmentFile] = useState(null)
  const [assignmentFileName, setAssignmentFileName] = useState(assnForm.assignmentFileName)
  const [assignedTo, setAssignedTo] = useState(assnForm.assignedTo)
  const [assignmentFileUrl, setAssignmentFileUrl] = useState(assnForm.assignmentFileUrl)
  const [assignmentFileUploadProgress, setAssignmentFileUploadProgress] =
    useState(null)
  const [assignmentFileUploadError, setAssignmentFileUploadError] =
    useState(null)
  const [assignmentFileUploading, setAssignmentFileUploading] = useState(false)
  const [talentList, setTalentList] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([]);
  
  useEffect(() => {
    if (assignmentFile) {
      handleFileUpload()
    }
  }, [assignmentFile])

  useEffect(() => {
    fetchTalentList()
  }, [])

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

  const handleSubmit = async e => {
    e.preventDefault()
   
    const formData = {
      assignmentWeek,
      assignmentName,
      assignmentTechnology,
      assignmentDuedate,
      assignmentFileName,
      assignmentFileUrl,
      assignedTo
    }
    console.log(formData)
    createAssignment(formData);
  }

  const handleFileUpload = async () => {
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
      const storage = getStorage(app)
      const fileName = assignmentFile.name
      const storageRef = ref(storage, fileName)
      const uploadTask = uploadBytesResumable(storageRef, assignmentFile)

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
              <Label htmlFor='assignmentWeek' value='Assignment Week' />
            </div>
            <TextInput
              id='assignmentWeek'
              type='text'
              placeholder='Enter assignment week'
              value={assignmentWeek}
              onChange={e => setAssignmentWeek(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='assignmentName' value='Assignment Name' />
            </div>
            <TextInput
              id='assignmentName'
              type='text'
              placeholder='Enter assignment name'
              value={assignmentName}
              onChange={e => setAssignmentName(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label
                htmlFor='assignmentTechnology'
                value='Assignment Technology'
              />
            </div>
            <Select
              id='assignmentTechnology'
              value={assignmentTechnology}
              onChange={e => setAssignmentTechnology(e.target.value)}
              required
              size={'sm'}
            >
              <option>Java</option>
              <option>React</option>
              <option>JavaScript</option>
              <option>UI 5</option>
              <option>Integration</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='assignmentDuedate' value='Assignment Due Date' />
            </div>
            <TextInput
              id='assignmentDuedate'
              type='date'
              value={assignmentDuedate}
              onChange={e => setAssignmentDuedate(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='assignmentFile' value='Assignment File (upload if you want to change previous) ' />
            </div>
            <FileInput
              id='assignmentFile'
              type='file'
              helperText="PDF(Max size 2 MB)"
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
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='assignedTo' value='Assigned To' />
            </div>
            <Select
              id='assignedTo'
              value={assignedTo}
              onChange={e => {
                const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                const uniqueSelectedValues = selectedValues.filter(value => !selectedTalents.includes(value));
                const newAssignedTo = uniqueSelectedValues.join(", ");
                setAssignedTo(prevAssignedTo => prevAssignedTo ? prevAssignedTo + ", " + newAssignedTo : newAssignedTo);
                setSelectedTalents(prevSelected => [...prevSelected, ...uniqueSelectedValues]);
              }}
              multiple
              size={'sm'}
            >
              {talentList.map(talent => (
                <option key={talent.talentId} value={talent.talentName}>
                  {talent.talentName}
                </option>
              ))}
            </Select>
          </div>
          {assignedTo && (
    <div>
      <label className="block text-sm font-medium text-gray-700">Assigned Talents:</label>
      <div className="mt-2 flex flex-wrap">
        {assignedTo.split(',').map((talent, index) => (
          <span key={index} className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white">
            {talent.trim()}
          </span>
        ))}
      </div>
            </div>
          )}
          <Button type='submit' color={'blue'} size={'sm'}>Submit</Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
