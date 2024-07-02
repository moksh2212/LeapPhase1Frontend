import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'

export function AddMembers({ openModal, setOpenModal, createMember }) {
  const [talentId, setTalentId] = useState('')
  const [role, setRole] = useState('')



  const handleSubmit = async e => {
    e.preventDefault()

    const formData = new FormData()
      // Append the string to the FormData
      formData.append('talentId', talentId )
      formData.append('role', role )
    console.log(formData);
    createMember(formData);
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
          
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Member
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
