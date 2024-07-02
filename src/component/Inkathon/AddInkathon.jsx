import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
} from 'flowbite-react'

export function AddInkathon({ openModal, setOpenModal, createInkathon }) {
  const [inkathonName, setInkathonName] = useState('')
  const [inkathonDescription, setInkathonDescription] = useState('')



  const handleSubmit = async e => {
    e.preventDefault()


    const formData = new FormData()
      // Append the string to the FormData
      formData.append('inkathonName', inkathonName );
      formData.append('inkathonDesc', inkathonDescription );
    console.log(formData)
    createInkathon(formData);
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='inkathonName' value='Inkathon Name' />
            </div>
            <TextInput
              id='inkathonName'
              type='text'
              placeholder='Enter Inkathon name'
              value={inkathonName}
              onChange={e => setInkathonName(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='inkathonDescription' value='Inkathon Description' />
            </div>
            <TextInput
              id='inkathonDescription'
              type='text'
              placeholder='Enter Inkathon Description'
              value={inkathonDescription}
              onChange={e => setInkathonDescription(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Inkathon
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
