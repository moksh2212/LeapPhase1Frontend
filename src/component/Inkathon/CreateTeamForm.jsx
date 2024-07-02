import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'

export function CreateTeamForm({ openModal, setOpenModal, createTeam , projectTitles }) {
  const [projectId, setProjectId] = useState('')
  const [teamName, setTeamName] = useState('')



  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      teamName,
      projectId,
    }
    console.log(formData)
    createTeam(formData);
  }

  return (
    <Modal show={openModal} size='md' onClose={() => setOpenModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <form onSubmit={handleSubmit} className='flex max-w-md flex-col gap-4'>
          <div>
            <div className='mb-2 block'>
              <Label htmlFor='teamName' value='Team Name' />
            </div>
            <TextInput
              id='teamName'
              type='text'
              placeholder='Enter Team name'
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              required
              size={'sm'}
            />
          </div>
          <Select
            id='projectTitle'
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            required
            size={'sm'}
          >
            <option value='' disabled selected>
              Select a project
            </option>
            {projectTitles.map(project => (
              <option key={project.projectId} value={project.projectId}>
                ID - {project.projectId} - {project.projectTitle}
              </option>
            ))}
          </Select>
          <Button type='submit' color={'blue'} size={'sm'}>
            Create Team
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
