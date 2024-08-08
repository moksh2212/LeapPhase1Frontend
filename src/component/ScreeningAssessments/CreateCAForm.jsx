import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { useSelector } from 'react-redux'

const CreateCAForm = ({ open, setOpen, onSubmit }) => {
  const [collegeList, setCollegeList] = useState([])
  const [selectedCollege, setSelectedCollege] = useState('')
  const [error, setError] = useState(null)
  const baseUrl = process.env.BASE_URL
  const token = useSelector(state => state.user.token)

  const handleChange = event => {
    setSelectedCollege(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/viewData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setCollegeList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      }
    }

    fetchData()
  }, [])
  const handleSubmit = () => {
    setOpen(false)
    console.log(selectedCollege);
    onSubmit(selectedCollege)

  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
      <DialogTitle>Select College</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id='college-select-label'>College</InputLabel>
          <Select
            labelId='college-select-label'
            value={selectedCollege}
            onChange={handleChange}
          >
            {collegeList.map(college => (
              <MenuItem key={college.collegeId} value={college.collegeId}>
                {college.collegeName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>setOpen(false)}>Cancel</Button>
        <Button onClick={handleSubmit} color='primary'>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateCAForm
