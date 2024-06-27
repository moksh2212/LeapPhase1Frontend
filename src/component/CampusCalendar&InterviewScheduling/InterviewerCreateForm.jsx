import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'

export function CreateInterviewerForm({ openModal, setOpenModal, createInterviewer }) {
  const [interviewerName, setInterviewerName] = useState('')
  const [grade, setGrade] = useState('A')
  const [techRole, setTechRole] = useState('Backend Developer')
  const [techProficiency, setTechProficiency] = useState('Beginner')
  const [location, setLocation] = useState('')
  const [region, setRegion] = useState('North')
  const [workExperience, setWorkExperience] = useState('')
  const [email, setEmail] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [inctureId, setInctureId] = useState('')
  const [prevBatches, setPrevBatches] = useState([])

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      interviewerName,
      grade,
      techRole,
      techProficiency,
      location,
      region,
      workExperience,
      email,
      inctureId,
      mobileNumber,
      prevBatches,
    }
    console.log(formData)
    createInterviewer(formData)
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='interviewerName' value='Interviewer Name' />
            </div>
            <TextInput
              id='interviewerName'
              type='text'
              placeholder='Enter interviewer name'
              value={interviewerName}
              onChange={e => setInterviewerName(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='grade' value='Grade' />
            </div>
            <Select
              id='grade'
              value={grade}
              onChange={e => setGrade(e.target.value)}
              required
              size={'sm'}
            >
              <option>A</option>
              <option>B</option>
              <option>C</option>
              <option>D</option>
              <option>E</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='techRole' value='Tech Role' />
            </div>
            <Select
              id='techRole'
              value={techRole}
              onChange={e => setTechRole(e.target.value)}
              required
            >
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
              <option>Full Stack Developer</option>
              <option>DevOps Engineer</option>
              <option>Data Scientist</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='techProficiency' value='Tech Proficiency' />
            </div>
            <Select
              id='techProficiency'
              value={techProficiency}
              onChange={e => setTechProficiency(e.target.value)}
              required
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
              <option>Expert</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='location' value='Location' />
            </div>
            <TextInput
              id='location'
              type='text'
              placeholder='Enter location'
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='region' value='Region' />
            </div>
            <Select
              id='region'
              value={region}
              onChange={e => setRegion(e.target.value)}
              required
            >
              <option>North</option>
              <option>South</option>
              <option>East</option>
              <option>West</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='workExperience' value='Work Experience' />
            </div>
            <TextInput
              id='workExperience'
              type='text'
              placeholder='Enter work experience (e.g., 4 years)'
              value={workExperience}
              onChange={e => setWorkExperience(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='inctureId' value='Incture ID' />
            </div>
            <TextInput
              id='inctureId'
              type='text'
              placeholder='Enter Incture ID'
              value={inctureId}
              onChange={e => setInctureId(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='email' value='Email' />
            </div>
            <TextInput
              id='email'
              type='email'
              placeholder='Enter email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='mobileNumber' value='Phone' />
            </div>
            <TextInput
              id='mobileNumber'
              type='tel'
              placeholder='Enter mobileNumber number'
              value={mobileNumber}
              onChange={e => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='prevBatches' value='Previous Batches' />
            </div>
            <TextInput
              id='prevBatches'
              type='text'
              placeholder='Enter previous batches (comma-separated)'
              value={prevBatches.join(', ')}
              onChange={e => setPrevBatches(e.target.value.split(',').map(batch => batch.trim()))}
              required
            />
          </div>
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Interviewer
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}