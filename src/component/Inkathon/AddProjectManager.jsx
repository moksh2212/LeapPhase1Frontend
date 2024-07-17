  import { useEffect, useState, useCallback } from 'react'
  import { Label, TextInput, Button, Modal, Select } from 'flowbite-react'
  import { useSelector } from 'react-redux'
  export function AddProjectManager({ openModal, setOpenModal, createPm }) {
    const [selectedTalentId, setSelectedTalentId] = useState(null)

    const [ekYear, setEkYear] = useState('')
    const [talentList, setTalentList] = useState([])
    const [filteredTalentList, setFilteredTalentList] = useState([])

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
      const formData = new FormData()

      // Append the talentId and role to the FormData
      formData.append('talentId', selectedTalentId)

        try {
          // Call the createMember function and handle the submission
          await createPm(formData)
          console.log(
          )
        } catch (error) {
          console.error(
            error,
          )
        }
      
    }

    const fetchTalentList = async () => {
      try {
        const response = await fetch(`${tanBaseUrl}/cpm/talents/alltalent`, {
          headers: {
            Authorization: `Basic ${token}`,
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
    return (
      <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
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
                <Label htmlFor='selectedto' value='Select Project Manager for team' />
              </div>
              <Select
                id='selectedto'
                value={selectedTalentId}
                onChange={e => setSelectedTalentId(e.target.value)}
                size='sm'
              >
                            <option value='' disabled selected>
              Select a member
            </option>
                {filteredTalentList.map(talent => (
                  <option key={talent.talentId} value={talent.talentId}>
                    INC{talent.talentId} - {talent.ekYear} - {talent.talentName} -{' '}
                    {talent.email}
                  </option>
                ))}
              </Select>
            </div>
            <Button type='submit' color={'blue'} size={'sm'}>
              Add Member
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    )
  }
