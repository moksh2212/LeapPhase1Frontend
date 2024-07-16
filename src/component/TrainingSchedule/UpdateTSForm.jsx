import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  FormHelperText,
} from '@mui/material'
import { styled } from '@mui/system'
import Select, { components } from 'react-select'
import { useSelector } from 'react-redux'

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
}))

const StyledSelect = styled(Select)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}))

const Option = props => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type='checkbox'
          checked={
            props.isSelected ||
            (props.value === 'all' &&
              props.selectProps.value.length ===
                props.selectProps.options.length - 1)
          }
          onChange={() => null}
        />{' '}
        <label>{props.label}</label>
      </components.Option>
    </div>
  )
}

const TrainingScheduleUpdateForm = ({ open, setOpen, currentSchedule }) => {

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'delayed', label: 'Delayed' },
  ]
  const [trainingDate, setTrainingDate] = useState(
    currentSchedule.trainingDate || '',
  )
  const [actualTrainingDate, setActualTrainingDate] = useState(
    currentSchedule.actualTrainingDate || '',
  )
  const [startTime, setStartTime] = useState(currentSchedule.startTime || '')
  const [endTime, setEndTime] = useState(currentSchedule.endTime || '')
  const [trainingTopic, setTrainingTopic] = useState(
    currentSchedule.trainingTopic || '',
  )
  const [trainingTech, setTrainingTech] = useState(
    currentSchedule.trainingTech || null,
  )
  const [trainer, setTrainer] = useState(currentSchedule.trainer || null)
  const [selectedEmployees, setSelectedEmployees] = useState(
    currentSchedule.selectedEmployees || [],
  )
  const [weekNumber, setWeekNumber] = useState(currentSchedule.weekNumber || '')
  const [trainingStatus, setTrainingStatus] = useState(() => {
    const status = currentSchedule.trainingStatus || ''
    return (
      statusOptions.find(option => option.label === status ||
      null
    ))
  })
  const [comments, setComments] = useState(currentSchedule.comments || '')
  const [trainerList, setTrainerList] = useState([])
  const [talentList, setTalentList] = useState([])
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const baseUrl = process.env.BASE_URL2
  const token = useSelector(state => state.user.token)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/trainers/getAll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setTrainerList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/cpm/talents/alltalent`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setTalentList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      }
    }

    fetchData()
  }, [])

  const employees = talentList.map(talent => ({
    value: talent.talentId,
    label: talent.talentName,
    ...talent,
  }))

  const employeeOptions = [{ value: 'all', label: 'Select All' }, ...employees]

  const techOptions = [
    { value: 'java', label: 'Java' },
    { value: 'react', label: 'React' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'ui5', label: 'UI 5' },
    { value: 'integration', label: 'Integration' },
    { value: 'solidworks', label: 'SolidWorks' },
    { value: 'autocad', label: 'AutoCAD' },
    { value: 'ansys', label: 'ANSYS' },
  ]

  const trainerOptions = trainerList.map(trainer => ({
    value: trainer.trainerId,
    label: trainer.trainerName,
    ...trainer,
  }))

  

  const handleSelectChange = selectedOptions => {
    if (!selectedOptions) {
      setSelectedEmployees([])
      return
    }

    const normalOptions = selectedOptions.filter(
      option => option.value !== 'all',
    )
    const allOption = selectedOptions.find(option => option.value === 'all')
    const allSelected = normalOptions.length === employees.length

    if (allOption && !allSelected) {
      setSelectedEmployees(employees)
    } else if (allOption && allSelected) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(normalOptions)
    }
  }

  const validateForm = () => {
    const errors = {}
    if (!trainingDate) errors.trainingDate = 'Training date is required'
    if (!startTime) errors.startTime = 'Start time is required'
    if (!endTime) errors.endTime = 'End time is required'
    if (!trainingTopic) errors.trainingTopic = 'Training topic is required'
    if (!trainingTech) errors.trainingTech = 'Training tech is required'
    if (!trainer) errors.trainer = 'Trainer is required'
    if (selectedEmployees.length === 0)
      errors.selectedEmployees = 'Select at least one trainee'
    if (!weekNumber) errors.weekNumber = 'Week number is required'
    if (!trainingStatus) errors.trainingStatus = 'Training status is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (validateForm()) {
      const submissionData = {
        trainingDate,
        actualTrainingDate,
        startTime,
        endTime,
        trainingTopic,
        trainingTech: trainingTech ? trainingTech.value : null,
        trainerId: trainer ? trainer.trainerId : null,
        traineesIds: selectedEmployees.map(employee => employee.value),
        weekNumber,
        trainingStatus: trainingStatus ? trainingStatus.label : null,
        comments,
      }
      console.log(submissionData)
      // Add your submission logic here
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby='form-dialog-title'
    >
      <DialogTitle id='form-dialog-title'>Update Training Schedule</DialogTitle>
      <DialogContent>
        <StyledForm onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Week Number'
                type='String'
                value={weekNumber}
                required
                onChange={e => setWeekNumber(e.target.value)}
                error={!!formErrors.weekNumber}
                helperText={formErrors.weekNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Training Date'
                type='date'
                value={trainingDate}
                required
                onChange={e => setTrainingDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!formErrors.trainingDate}
                helperText={formErrors.trainingDate}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Actual Training Date'
                type='date'
                value={actualTrainingDate}
                onChange={e => setActualTrainingDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Start Time'
                type='time'
                value={startTime}
                required
                onChange={e => setStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!formErrors.startTime}
                helperText={formErrors.startTime}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='End Time'
                type='time'
                value={endTime}
                required
                onChange={e => setEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={!!formErrors.endTime}
                helperText={formErrors.endTime}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Training Topic'
                value={trainingTopic}
                required
                onChange={e => setTrainingTopic(e.target.value)}
                error={!!formErrors.trainingTopic}
                helperText={formErrors.trainingTopic}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Comments'
                multiline
                rows={2}
                value={comments}
                onChange={e => setComments(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.trainingStatus}>
                <StyledSelect
                  options={statusOptions}
                  value={trainingStatus}
                  onChange={setTrainingStatus}
                  placeholder='Select Training Status'
                />
                {formErrors.trainingStatus && (
                  <FormHelperText>{formErrors.trainingStatus}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.trainingTech}>
                <StyledSelect
                  value={trainingTech}
                  options={techOptions}
                  onChange={setTrainingTech}
                  placeholder='Select Training Tech'
                />
                {formErrors.trainingTech && (
                  <FormHelperText>{formErrors.trainingTech}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.trainer}>
                <StyledSelect
                  options={trainerOptions}
                  value={trainer}
                  onChange={selectedTrainer => setTrainer(selectedTrainer)}
                  placeholder='Select Trainer'
                />
                {formErrors.trainer && (
                  <FormHelperText>{formErrors.trainer}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.selectedEmployees}>
                <StyledSelect
                  isMulti
                  name='employees'
                  options={employeeOptions}
                  classNamePrefix='select'
                  onChange={handleSelectChange}
                  closeMenuOnSelect={false}
                  hideSelectedOptions={false}
                  components={{ Option }}
                  value={selectedEmployees.map(emp => ({
                    value: emp.value,
                    label: emp.label,
                  }))}
                  placeholder='Select Trainees'
                />
                {formErrors.selectedEmployees && (
                  <FormHelperText>
                    {formErrors.selectedEmployees}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </StyledForm>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color='primary'>
          Cancel
        </Button>
        <Button onClick={handleSubmit} color='primary' variant='contained'>
          Update Training
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default TrainingScheduleUpdateForm
