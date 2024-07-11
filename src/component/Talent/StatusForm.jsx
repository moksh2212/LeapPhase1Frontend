import { useEffect, useState } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,
  ModalBody,
  ModalHeader,
} from 'flowbite-react'

export function StatusForm({ openModal, setOpenModal, updateStatus, statusUp  }) {
  const [editMode, setEditMode] = useState(false)
  const [projectId, setProjectId] = useState('')
  const [teamName, setTeamName] = useState('')
  const [talentStatus, setTalentStatus] = useState(statusUp.talentStatus)
  const [exitReason, setExitReason] = useState(statusUp.exitReason)
  const [otherReason, setOtherReason] = useState(statusUp.exitComment)
  const [exitDate, setExitDate] = useState(statusUp.exitDate)
  const handleSubmit = async e => {
    e.preventDefault()
    const talentId = statusUp.talentId
    
    const formData = new FormData();

    formData.append('talentId', talentId);
    formData.append('talentStatus', talentStatus);
    formData.append('exitReason', exitReason);
    formData.append('exitDate', exitDate);
    formData.append('otherReason', otherReason);
    
    console.log(formData)
    updateStatus(formData)
  }

  return (
    <div>
      {editMode == false && (
        <>
          <Modal
            show={openModal}
            size='md'
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header>
              <h6 className='modal'>Talent Status</h6>
            </Modal.Header>

            <Modal.Body>
              <form
                onSubmit={handleSubmit}
                className='flex max-w-md flex-col gap-4'
              >
                <h6>Status : {talentStatus}</h6>
                {talentStatus !== 'ACTIVE' && (
                  <>
                  <h6>Exit Date: {exitDate}</h6>
                  <h6>Exit Reason: {exitReason}</h6>
                  {exitReason == 'Others' && (
                  <>
                  <h6>Reason: {otherReason}</h6>
                  
                  </>
                )}
                  </>
                )}

                <Button
                  color={'blue'}
                  size={'sm'}
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </>
      )}
      {editMode == true && (
        <div>
          <Modal
            show={openModal}
            size='md'
            onClose={() => setOpenModal(false)}
            popup
          >
            <Modal.Header>
              <h6 className='modal'>Talent Status Edit</h6>
            </Modal.Header>

            <Modal.Body>
              <form
                onSubmit={handleSubmit}
                className='flex max-w-md flex-col gap-4'
              >
                <div>
                  <div className='mb-2 block'>
                    <Label htmlFor='status' value='Status:' />
                  </div>
                  <Select
                    id='talentStatus'
                    value={talentStatus}
                    onChange={e => {
                      setTalentStatus(e.target.value)
                      setExitReason('')
                    }}
                    required
                    size={'sm'}
                  >
                    <option>ACTIVE</option>
                    <option>RESIGNED</option>
                    <option>REVOKED</option>
                    <option>DECLINED</option>
                  </Select>
                </div>

                {talentStatus !== 'ACTIVE' && (
                  <div>
                    <div>
                      <div className='mb-2 block'>
                        <Label htmlFor='exitDate' value='Exit Date' />
                      </div>
                      <TextInput
                        id='exitDate'
                        type='date'
                        value={exitDate}
                        onChange={e => setExitDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className='mb-2 block'>
                      <Label htmlFor='reason' value='Reason:' />
                    </div>
                    <Select
                      id='reason'
                      value={exitReason}
                      onChange={e => setExitReason(e.target.value)}
                      required
                      size={'sm'}
                    >
                      <option>Better Offer</option>
                      <option>Pursuing Higher Studies</option>
                      <option>Family Reasons</option>
                      <option>Health Reasons</option>
                      <option>Performance Issues</option>
                      <option>Others</option>
                    </Select>
                  </div>
                )}
                {exitReason == 'Others' && (
                  <TextInput
                    id='otherReason'
                    value={otherReason}
                    onChange={e => setOtherReason(e.target.value)}
                    placeholder='Enter other reason'
                    size={'sm'}
                  />
                )}

                <Button type='submit' color={'blue'} size={'sm'}>
                  UPDATE
                </Button>
              </form>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  )
}
