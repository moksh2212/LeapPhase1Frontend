import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
} from 'flowbite-react'

export function UpdateTeamForm({ openModal, setOpenModal, updateTeam ,teamForm, projectTitles }) {
  const [teamId, setTeamId] = useState(teamForm.teamId)
  const [projectId, setProjectId] = useState(teamForm.projects.projectId)
  const [teamName, setTeamName] = useState(teamForm.teamName)



  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      projectId,
      teamId,
      teamName
    }
    console.log(formData)
    updateTeam(formData);
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
            ID - {teamForm.projectId}
            </option>
            {projectTitles.map(project => (
              <option key={project.projectId} value={project.projectId}>
                ID - {project.projectId}  - {project.projectTitle}
              </option>
            ))}
          </Select>
          <Button type='submit' color={'blue'} size={'sm'}>
            Update Team
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  )
}
