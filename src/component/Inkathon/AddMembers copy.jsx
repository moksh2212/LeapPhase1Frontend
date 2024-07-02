import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'
import { ImCross } from 'react-icons/im';

export function AddMembers({ openModal, setOpenModal, createMember }) {
  const [talentId, setTalentId] = useState('')
  const [role, setRole] = useState('')
  const [assignedTo, setAssignedTo] = useState('');

  const [talentList, setTalentList] = useState([]);
  const [selectedTalents, setSelectedTalents] = useState([]);
  const [filteredTalentList, setFilteredTalentList] = useState([]);

  const tanBaseUrl = process.env.BASE_URL

  useEffect(() => {
    fetchTalentList()
  }, [])
  
  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData()
      // Append the string to the FormData
      formData.append('talentId', talentId )
      formData.append('role', role )
    console.log(formData);
    createMember(formData);
  }

  const fetchTalentList = async () => {
    try {
      const response = await fetch(`${tanBaseUrl}/cpm/talents/alltalent`);
      if (!response.ok) {
        throw new Error('Failed to fetch talent list');
      }
      const data = await response.json();
      setTalentList(data);
      console.log('Talent list:', data);
    } catch (error) {
      console.error('Error fetching talent list:', error);
    }
  }
  const handleSelectedTalent = (talent, index) => {
    const newselectedtalent = selectedTalents.filter((tal, i) => tal != talent)
    setSelectedTalents(newselectedtalent)
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='talentId' value='Talent Id' />
            </div>
            <TextInput
              id='talentId'
              type='text'
              placeholder='Enter Talent Id'
              value={talentId}
              onChange={e => setTalentId(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="memberRole" value="Member Role" />
            </div>
            <Select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              size="sm"
            >
              <option>Backend Developer</option>
              <option>Frontend Developer</option>
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="assignedTo" value="Assigned To" />
            </div>
            <Select
              id='assignedTo'
              value={assignedTo}
              onChange={(e) => {
                const selectedValues = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                const uniqueSelectedValues = selectedValues.filter(
                  (value) => !selectedTalents.includes(value)
                );
                setSelectedTalents((prevSelected) => [
                  ...prevSelected,
                  ...uniqueSelectedValues,
                ]);
              }}
              multiple
              size="sm"
            >
              {filteredTalentList.map((talent) => (
                <option key={talent.talentId} value={talent.email}>
                  {talent.talentName} - {talent.email}
                </option>
              ))}
            </Select>
            {selectedTalents.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Selected Talents:
                </label>
                <div className="mt-2 flex flex-wrap">
                  {selectedTalents.map((talent, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 mr-2 mb-2 rounded-md text-sm font-medium bg-blue-500 text-white"
                    >
                      {talent}
                      <div
                        onClick={() => handleSelectedTalent(talent)}
                        className="ml-2 cursor-pointer"
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
            Create Member
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
