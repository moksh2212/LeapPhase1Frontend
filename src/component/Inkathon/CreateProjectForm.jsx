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

export function CreateProjectForm({ openModal, setOpenModal, createProject }) {

  const [projectTitle, setProjectTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [projectFile, setProjectFile] = useState(null)

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
    const formData = new FormData()
      // Append the string to the FormData
      formData.append('projectTitle', projectTitle );
      formData.append('projectDescription', projectDescription );
      formData.append('projectFile', projectFile )
    console.log(formData)
    createProject(formData);
  }

  const handleFileChange = async e => {
    setProjectFile(e.target.files[0])
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='projectTitle' value='Project Name' />
            </div>
            <TextInput
              id='projectTitle'
              type='text'
              placeholder='Enter project name'
              value={projectTitle}
              onChange={e => setProjectTitle(e.target.value)}
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
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Inkathon Project
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
