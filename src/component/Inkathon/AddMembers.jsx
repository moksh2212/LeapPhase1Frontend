import { useEffect, useState, useCallback } from 'react'
import { Label, TextInput, Button, Modal, Select } from 'flowbite-react'
import { ImCross } from 'react-icons/im'
import { useSelector } from 'react-redux'
export function AddMembers({ openModal, setOpenModal, createMember }) {
  const [talentId, setTalentId] = useState('')
  const [role, setRole] = useState('')
  const [selectedto, setSelectedTo] = useState('')
  const [ekYear, setEkYear] = useState('')
  const [talentList, setTalentList] = useState([])
  const [filteredTalentList, setFilteredTalentList] = useState([])
  const [selectedTalents, setSelectedTalents] = useState([])

  const tanBaseUrl = process.env.BASE_URL
  const token = useSelector(state => state.user.token)
  useEffect(() => {
    fetchTalentList()
  }, [])

  useEffect(() => {
    if (!ekYear) {
      setFilteredTalentList(talentList)
      return
    } // Exit if technology is not selected

    const filteredList = talentList.filter(talent => {
      if (!talent.ekYear) return false // Skip talents with no skills
      const requiredYear = talent.ekYear
      return requiredYear.includes(ekYear)
    })
    setFilteredTalentList(filteredList)
  }, [ekYear, talentList])

  const handleSubmit = async e => {
    e.preventDefault()

    // Iterate over each talent in the selectedTalents list
    for (const talent of selectedTalents) {
      // Create a new FormData object for each talent
      const formData = new FormData()

      // Append the talentId and role to the FormData
      formData.append('talentId', talent.talentId)
      formData.append('role', role)

      // Log the FormData entries for debugging purposes
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }

      try {
        // Call the createMember function and handle the submission
        await createMember(formData)
        console.log(
          `Form submitted successfully for talentId: ${talent.talentId}`,
        )
      } catch (error) {
        console.error(
          `Error submitting form for talentId: ${talent.talentId}`,
          error,
        )
      }
    }
  }

  const fetchTalentList = async () => {
    try {
      const response = await fetch(`${tanBaseUrl}/cpm/talents/alltalent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error('Failed to fetch talent list')
      }
      const data = await response.json()
      setTalentList(data)
      setFilteredTalentList(data)
      console.log('Talent list:', data)
    } catch (error) {
      console.error('Error fetching talent list:', error)
    }
  }
  const handleSelectedTalent = (talent, index) => {
    const newselectedtalent = selectedTalents.filter((tal, i) => tal != talent)
    setSelectedTalents(newselectedtalent)
  }
  const handleSelectChange = useCallback(
    e => {
      const selectedValues = Array.from(
        e.target.selectedOptions,
        option => option.value,
      )

      const newSelectedTalents = filteredTalentList.filter(talent =>
        selectedValues.includes(talent.email),
      )
      setSelectedTalents(prevSelected => [
        ...prevSelected.filter(
          talent => !selectedValues.includes(talent.email),
        ),
        ...newSelectedTalents,
      ])
    },
    [filteredTalentList],
  )

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='memberRole' value='Member Role' />
            </div>
            <Select
              id='role'
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              size='sm'
            >
              {' '}
              <option value='' selected>
                Select Role
              </option>
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='filterOptionS' value='Filters:' />
            </div>
            <Select
              id='ekYearFiltered'
              value={ekYear}
              onChange={e => setEkYear(e.target.value)}
              size='sm'
            >
              <option value='' selected>
                Select EkYear
              </option>
              <option>2024</option>
              <option>2023</option>
            </Select>
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='selectedto' value='Select members for team' />
            </div>
            <Select
              id='selectedto'
              value={selectedto}
              onChange={handleSelectChange}
              multiple
              size='sm'
            >
              {filteredTalentList.map(talent => (
                <option key={talent.talentId} value={talent.email}>
                  INC{talent.talentId} - {talent.ekYear} - {talent.talentName} -{' '}
                  {talent.email}
                </option>
              ))}
            </Select>
            {selectedTalents.length > 0 && (
              <div>
                <label className='block text-sm font-medium text-gray-700'>
                  Selected Talents:
                </label>
                <div className='mt-2 flex flex-wrap'>
                  {selectedTalents.map((talent, index) => (
                    <span
                      key={index}
                      className='inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white'
                    >
                      {talent.talentId}-{talent.talentName} - {talent.email}
                      <div
                        onClick={() => handleSelectedTalent(talent)}
                        className='ml-2 cursor-pointer'
                      >
                        <ImCross />
                      </div>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button type='submit' color={'blue'} size={'sm'}>
            Add Member
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
