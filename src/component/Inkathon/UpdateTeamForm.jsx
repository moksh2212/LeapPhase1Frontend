import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'

export function UpdateTeamForm({ openModal, setOpenModal, createTeam ,teamForm, projectTitles }) {
  const [teamId, setTeamId] = useState(teamForm.teamId)
  const [projectId, setProjectId] = useState('')
  const [teamName, setTeamName] = useState(teamForm.teamName)



  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      teamName,
      teamId,
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
            value={teamId}
            onChange={e => setProjectId(e.target.value)}
            required
            size={'sm'}
          >
            {projectTitles.map(project => (
              <option key={project.teamId} value={project.teamId}>
                ID - {project.teamId}  - {project.projectTitle}
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
