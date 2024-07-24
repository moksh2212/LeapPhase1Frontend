import { useEffect, useState, useCallback } from 'react'
import { Label, TextInput, Button, Modal, Select } from 'flowbite-react'
import { ImCross } from 'react-icons/im'
import { useSelector } from 'react-redux'
import { Button as Button2, ButtonGroup } from '@mui/material'
export function AddCandidates({ openModal, setOpenModal, handleUpload }) {
  const [collegeId, setCollegeId] = useState('')
  const [role, setRole] = useState('')
  const [selectedto, setSelectedTo] = useState('')
  const [collegeList, setCollegeList] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([])
  const [selectedFile1, setSelectedFile1] = useState(null)
  const [ekYear, setEkYear] = useState('')

  const tanBaseUrl = process.env.BASE_URL

  const token = useSelector(state => state.user.token)

  useEffect(() => {
    fetchTalentList()
  }, [])
  const handleFileChange = event => {
    setSelectedFile1(event.target.files[0])
  }
  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData()
    console.log('that is selected ', selectedFile1.name)
    formData.append('file', selectedFile1)
    formData.append('collegeId', collegeId)
    formData.append('ekbatch', ekYear)
    console.log('college id in form', formData.get('collegeId'))

    try {
      // Call the createMember function and handle the submission
      await handleUpload(formData)
      console.log(`Form submitted successfully for collegeId: ${collegeId}`)
    } catch (error) {
      console.error(`Error submitting form for collegeId: ${collegeId}`, error)
    }
  }

  const fetchTalentList = async () => {
    try {
      const response = await fetch(`${tanBaseUrl}/admin/viewData`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch College list')
      }
      const data = await response.json()
      setCollegeList(data)
      console.log('Talent list:', data)
    } catch (error) {
      console.error('Error fetching talent list:', error)
    }
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='selectedto' value='Enter EK Year' />
            </div>
            <TextInput
              id='otherReason'
              value={ekYear}
              onChange={e => setEkYear(e.target.value)}
              placeholder='Enter EK Year'
              size={'sm'}
            />
            <div className='mb-2 block'>
              <Label
                htmlFor='selectedto'
                value='Select College Of Candidates'
              />
            </div>
            <Select
              id='selectedto'
              value={collegeId}
              onChange={e => setCollegeId(e.target.value)}
              size='sm'
            >
              <option value='' disabled selected>
                Select a College
              </option>
              {collegeList.map(college => (
                <option key={college.collegeId} value={college.collegeId}>
                  CollegeId : {college.collegeId} - {college.collegeName} -{' '}
                  {college.state}
                </option>
              ))}
            </Select>
          </div>
          <Button variant='contained' component='label' size='sm'>
            <label htmlFor='excelFile2' className='excel-file-label2'>
              {selectedFile1
                ? `File Selected: ${selectedFile1.name}`
                : 'Add via Excel'}
              <input
                type='file'
                id='excelFile2'
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </label>
          </Button>
          <Button type='submit' color={'blue'} size={'sm'}>
            Submit
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
