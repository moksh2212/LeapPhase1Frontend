// EditUserModal.js
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Checkbox,
} from '@mui/material'
import Select, { components } from 'react-select'

const roleOptions = [
  { value: 'USER', label: 'USER' },
  { value: 'ADMIN', label: 'ADMIN' },
  { value: 'SUPERADMIN', label: 'SUPERADMIN' },
]

const Option = props => {
    return (
      <div
        style={{
          backgroundColor: props.isSelected ? '#E3F2FD' : 'transparent',
          padding: '8px',
        }}
      >
        <components.Option {...props}>
          <Checkbox
            checked={props.isSelected}
            onChange={() => null}
            color="primary"
          />
          <label>{props.label}</label>
        </components.Option>
      </div>
    )
  }

const EditUserModal = ({ open, onClose, user, onSave }) => {
  const [editingUser, setEditingUser] = React.useState(user)

  React.useEffect(() => {
    setEditingUser(user)
  }, [user])

  const handleChange = (name, value) => {
    setEditingUser(prevUser => ({ ...prevUser, [name]: value }))
  }

  const handleRolesChange = selectedOptions => {
    const selectedRoles = selectedOptions.map(option => option.value)
    handleChange('roles', selectedRoles)
  }

  const handleSave = (e) => {
    e.preventDefault()
    onSave(editingUser)
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        {editingUser && (
          <Box>
            <TextField
              fullWidth
              margin='normal'
              label='Incture ID'
              value={editingUser.inctureId}
              onChange={e => handleChange('inctureId', e.target.value)}
              disabled={true}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Email'
              value={editingUser.email}
              onChange={e => handleChange('email', e.target.value)}
              disabled={true}
            />
            <TextField
              fullWidth
              margin='normal'
              label='Name'
              value={editingUser.talentName}
              onChange={e => handleChange('talentName', e.target.value)}
              disabled={true}
            />
            <Box mt={2}>
              <Select
                isMulti
                options={roleOptions}
                value={roleOptions.filter(option => editingUser.roles.includes(option.value))}
                onChange={handleRolesChange}
                closeMenuOnSelect={false}
                hideSelectedOptions={false}
                components={{ Option }}
                styles={{
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#E3F2FD' : 'white',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: '#F5F5F5',
                    },
                  }),
                }}
              />
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} color='primary'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditUserModal