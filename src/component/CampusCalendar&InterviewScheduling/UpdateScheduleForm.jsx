import { useState, useEffect } from 'react'
import { Label, TextInput, Button, Modal, Select } from 'flowbite-react'
import { addDays, subDays, format } from 'date-fns'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material'
import WarningIcon from '@mui/icons-material/Warning'
import { useSelector } from 'react-redux'

export function UpdateScheduleForm({
  openModal,
  setOpenModal,
  updateSchedule,
  currentSchedule,
}) {
  const [college, setCollege] = useState(currentSchedule.college || {})
  const [pptDate, setPptDate] = useState(currentSchedule.pptDate || '')
  const [assessmentDate, setAssessmentDate] = useState(
    currentSchedule.assessmentDate || '',
  )
  const [designDate, setDesignDate] = useState(currentSchedule.designDate || '')
  const [interviewDate, setInterviewDate] = useState(
    currentSchedule.interviewDate || '',
  )
  const [interviewer, setInterviewer] = useState(
    currentSchedule.interviewer || '',
  )
  const [collegeList, setCollegeList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  // const [interviewerList, setInterviewerList] = useState([
  //   {
  //     interviewerId: 1,
  //     interviewerName: 'Alice Johnson',
  //     grade: 'A',
  //     techRole: 'Frontend Developer',
  //     techProficiency: 'Advanced',
  //     location: 'New York',
  //     region: 'North America',
  //     workExperience: '5 years',
  //     scheduleDetails: [
  //       {
  //         collegeName: 'Harvard University',
  //         startDate: '2016-08-01',
  //         endDate: '2020-05-15',
  //       },
  //       {
  //         collegeName: 'Stanford University',
  //         startDate: '2015-08-01',
  //         endDate: '2016-05-15',
  //       },
  //       {
  //         collegeName: 'MIT',
  //         startDate: '2014-08-01',
  //         endDate: '2015-05-15',
  //       },
  //       {
  //         collegeName: 'UC Berkeley',
  //         startDate: '2013-08-01',
  //         endDate: '2014-05-15',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 2,
  //     interviewerName: 'Bob Smith',
  //     grade: 'B',
  //     techRole: 'Backend Developer',
  //     techProficiency: 'Intermediate',
  //     location: 'San Francisco',
  //     region: 'North America',
  //     workExperience: '4 years',
  //     scheduleDetails: [
  //       {
  //         collegeName: 'University of California, San Diego',
  //         startDate: '2017-08-01',
  //         endDate: '2021-05-15',
  //       },
  //       {
  //         collegeName: 'University of Southern California',
  //         startDate: '2016-08-01',
  //         endDate: '2017-05-15',
  //       },
  //       {
  //         collegeName: 'UCLA',
  //         startDate: '2015-08-01',
  //         endDate: '2016-05-15',
  //       },
  //       {
  //         collegeName: 'UC Irvine',
  //         startDate: '2014-08-01',
  //         endDate: '2015-05-15',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 3,
  //     interviewerName: 'Carol Williams',
  //     grade: 'A',
  //     techRole: 'Full Stack Developer',
  //     techProficiency: 'Advanced',
  //     location: 'Chicago',
  //     region: 'North America',
  //     workExperience: '6 years',
  //     scheduleDetails: [
  //       {
  //         collegeName: 'University of Chicago',
  //         startDate: '2018-08-01',
  //         endDate: '2022-05-15',
  //       },
  //       {
  //         collegeName: 'Northwestern University',
  //         startDate: '2017-08-01',
  //         endDate: '2018-05-15',
  //       },
  //       {
  //         collegeName: 'University of Illinois',
  //         startDate: '2016-08-01',
  //         endDate: '2017-05-15',
  //       },
  //       {
  //         collegeName: 'DePaul University',
  //         startDate: '2015-08-01',
  //         endDate: '2016-05-15',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 4,
  //     interviewerName: 'David Brown',
  //     grade: 'C',
  //     techRole: 'DevOps Engineer',
  //     techProficiency: 'Intermediate',
  //     location: 'Seattle',
  //     region: 'North America',
  //     workExperience: '3 years',
  //     scheduleDetails: [
  //       {
  //         collegeName: 'University of Washington',
  //         startDate: '2019-08-01',
  //         endDate: '2023-05-15',
  //       },
  //       {
  //         collegeName: 'Seattle University',
  //         startDate: '2018-08-01',
  //         endDate: '2019-05-15',
  //       },
  //       {
  //         collegeName: 'Washington State University',
  //         startDate: '2017-08-01',
  //         endDate: '2018-05-15',
  //       },
  //       {
  //         collegeName: 'Gonzaga University',
  //         startDate: '2016-08-01',
  //         endDate: '2017-05-15',
  //       },
  //     ],
  //   },
  //   {
  //     interviewerId: 5,
  //     interviewerName: 'Eva Green',
  //     grade: 'B',
  //     techRole: 'Data Scientist',
  //     techProficiency: 'Advanced',
  //     location: 'Boston',
  //     region: 'North America',
  //     workExperience: '7 years',
  //     scheduleDetails: [
  //       {
  //         collegeName: 'Harvard University',
  //         startDate: '2015-08-01',
  //         endDate: '2019-05-15',
  //       },
  //       {
  //         collegeName: 'MIT',
  //         startDate: '2014-08-01',
  //         endDate: '2015-05-15',
  //       },
  //       {
  //         collegeName: 'Boston University',
  //         startDate: '2013-08-01',
  //         endDate: '2014-05-15',
  //       },
  //       {
  //         collegeName: 'Northeastern University',
  //         startDate: '2012-08-01',
  //         endDate: '2013-05-15',
  //       },
  //     ],
  //   },
  // ])
  const [interviewerList, setInterviewerList] = useState([])
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false)
  const [conflictingDates, setConflictingDates] = useState([])

  const token = useSelector(state=>state.user.token)

  const baseUrl = process.env.BASE_URL

  const checkDateConflicts = (formData, currentCollegeName) => {
    const newDates = [
      { date: formData.pptDate, type: 'Pre Placement Talk' },
      { date: formData.assessmentDate, type: 'Assessment' },
      { date: formData.designDate, type: 'Design Exercise' },
      { date: formData.interviewDate, type: 'Interview' },
    ]
    const conflictMap = new Map()
    const interviewer = formData.interviewer

    newDates.forEach(({ date, type }) => {
      if (date) {
        const dateObj = new Date(date)
        const dayBefore = subDays(dateObj, 1)
        const dayAfter = addDays(dateObj, 1)

        interviewer.scheduleDetails.forEach(schedule => {

          if (schedule.collegeTPO.collegeName === currentCollegeName) {
            return;
          }
          const scheduleDates = [
            { date: new Date(schedule.pptDate), type: 'Pre Placement Talk' },
            { date: new Date(schedule.assessmentDate), type: 'Assessment' },
            { date: new Date(schedule.designDate), type: 'Design Exercise' },
            { date: new Date(schedule.interviewDate), type: 'Interview' },
          ]

          scheduleDates.forEach(
            ({ date: scheduleDate, type: scheduleType }) => {
              if (scheduleDate >= dayBefore && scheduleDate <= dayAfter) {
                const conflictDate = format(scheduleDate, 'yyyy-MM-dd')
                const collegeKey = `${conflictDate}-${schedule.collegeTPO.collegeName}`

                if (!conflictMap.has(collegeKey)) {
                  conflictMap.set(collegeKey, {
                    date: conflictDate,
                    collegeName: schedule.collegeTPO.collegeName,
                    location: schedule.collegeTPO.location,
                    events: new Set(),
                  })
                }
                conflictMap.get(collegeKey).events.add(scheduleType)
              }
            },
          )
        })
      }
    })

    // Convert Set to Array for each conflict's events and group by date
    const conflicts = Array.from(conflictMap.values()).map(conflict => ({
      ...conflict,
      events: Array.from(conflict.events),
    }))

    // Group conflicts by date
    const groupedConflicts = conflicts.reduce((acc, conflict) => {
      if (!acc[conflict.date]) {
        acc[conflict.date] = []
      }
      acc[conflict.date].push(conflict)
      return acc
    }, {})

    // Convert to array format
    return Object.entries(groupedConflicts).map(([date, collegeConflicts]) => ({
      date,
      colleges: collegeConflicts,
    }))
  }

  useEffect(() => {
    const selectedCollegeObject = collegeList.find(
      college => college.collegeName === currentSchedule.collegeName,
    )
    setCollege(selectedCollegeObject || {})

    const selectedInterviewerObject = interviewerList.find(
      interviewer =>
        interviewer.interviewerName === currentSchedule.interviewerName,
    )
    setInterviewer(selectedInterviewerObject || {})

    setPptDate(currentSchedule.pptDate || '')
    setAssessmentDate(currentSchedule.assessmentDate || '')
    setDesignDate(currentSchedule.designDate || '')
    setInterviewDate(currentSchedule.interviewDate || '')
  }, [currentSchedule, collegeList, interviewerList])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/admin/viewData`, {
          headers:{
            Authorization: `Basic ${token}`,
          }
        })
        const data = await response.json()
        setCollegeList(data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${baseUrl}/api/interviewer/read`, {
          headers:{
            Authorization: `Basic ${token}`,
          }
        })
        if (response.ok) {
          const data = await response.json()
          setInterviewerList(data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      college,
      pptDate,
      assessmentDate,
      designDate,
      interviewDate,
      interviewer,
    }
    console.log(formData)
    const conflicts = checkDateConflicts(formData, formData.college.collegeName)
    if (conflicts.length > 0) {
      setConflictingDates(conflicts)
      setConflictDialogOpen(true)
    } else {
      updateSchedule(formData, currentSchedule.scheduleId)
    }
  }
  const handleConfirmConflict = () => {
    setConflictDialogOpen(false)
    const formData = {
      college,
      pptDate,
      assessmentDate,
      designDate,
      interviewDate,
      interviewer,
    }
    updateSchedule(formData, currentSchedule.scheduleId)
  }

  return (
    <>
      <Modal
        show={openModal}
        size='md'
        onClose={() => setOpenModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <form
            onSubmit={handleSubmit}
            className='flex max-w-md flex-col gap-4'
          >
            {/* Interviewer Selection */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='interviewerId' value='Interviewer' />
              </div>
              <Select
                id='interviewer'
                value={interviewer.interviewerName || 'Not assigned'}
                onChange={e => {
                  if (e.target.value === 'Not assigned') {
                    setInterviewer({})
                  } else {
                    const selectedInterviewerObject = interviewerList.find(
                      interviewer =>
                        interviewer.interviewerName === e.target.value,
                    )
                    setInterviewer(selectedInterviewerObject || {})
                  }
                }}
                required
              >
                <option value='Not assigned'>---Select Interviewer---</option>
                {interviewerList.map(interviewer => (
                  <option
                    key={interviewer.interviewerId}
                    value={interviewer.interviewerName}
                  >
                    {interviewer.interviewerName}
                  </option>
                ))}
              </Select>
            </div>

            {/* Pre Placement Talk Date */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='pptDate' value='Pre Placement Talk Date' />
              </div>
              <TextInput
                id='pptDate'
                type='date'
                value={pptDate}
                onChange={e => setPptDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Assessment Date */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='assessmentDate' value='Assessment Date' />
              </div>
              <TextInput
                id='assessmentDate'
                type='date'
                value={assessmentDate}
                onChange={e => setAssessmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Design Exercise Date */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='designDate' value='Design Exercise Date' />
              </div>
              <TextInput
                id='designDate'
                type='date'
                value={designDate}
                onChange={e => setDesignDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Interview Date */}
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='interviewDate' value='Interview Date' />
              </div>
              <TextInput
                id='interviewDate'
                type='date'
                value={interviewDate}
                onChange={e => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <Button type='submit' color={'blue'} size={'sm'}>
              Update Schedule
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Dialog
        open={conflictDialogOpen}
        onClose={() => setConflictDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: 'warning.light',
            color: 'warning.contrastText',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <WarningIcon color='warning' />
          <Typography variant='h6' component='span' sx={{ fontWeight: 700 }}>
            Schedule Conflict
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant='body1'
            gutterBottom
            sx={{ mt: 2, fontWeight: 500 }}
          >
            The interviewer already has conflicting events:
          </Typography>
          <List>
            {conflictingDates.map((dateConflict, dateIndex) => (
              <ListItem
                key={dateIndex}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  mb: 2,
                  p: 2,
                  boxShadow: 1,
                }}
              >
                <Typography
                  variant='subtitle1'
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  On {dateConflict.date}:
                </Typography>
                {dateConflict.colleges.map((collegeConflict, collegeIndex) => (
                  <Box key={collegeIndex} sx={{ mb: 1, width: '100%' }}>
                    <Typography variant='body1' sx={{ fontWeight: 600 }}>
                      {collegeConflict.collegeName}
                    </Typography>
                    <Typography
                      variant='body2'
                      color='textSecondary'
                      gutterBottom
                      sx={{ fontWeight: 500 }}
                    >
                      Location: {collegeConflict.location}
                    </Typography>
                    <List
                      sx={{
                        width: '100%',
                        bgcolor: 'background.default',
                        borderRadius: 1,
                        p: 1,
                      }}
                    >
                      {collegeConflict.events.map((event, eventIndex) => (
                        <ListItem key={eventIndex} sx={{ py: 0.5, px: 1 }}>
                          <ListItemText
                            primary={event}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Typography variant='body1' sx={{ fontWeight: 500 }}>
              Do you want to proceed with creating this new schedule?
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConflictDialogOpen(false)} color='primary'>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmConflict}
            color='warning'
            variant='contained'
          >
            Proceed Anyway
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
