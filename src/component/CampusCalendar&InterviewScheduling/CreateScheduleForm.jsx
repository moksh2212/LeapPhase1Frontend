/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import {
  Label,
  TextInput,
  Button,
  Modal,
  Select,

} from 'flowbite-react'
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
import { addDays, subDays, format } from 'date-fns'
import WarningIcon from '@mui/icons-material/Warning'


export function CreateScheduleForm({
  openModal,
  setOpenModal,
  createSchedule,
}) {
  const [collegeTPO, setCollege] = useState({})
  const [pptDate, setPptDate] = useState('')
  const [assessmentDate, setAssessmentDate] = useState('')
  const [designDate, setDesignDate] = useState('')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewer, setInterviewer] = useState('')
  const [collegeList, setCollegeList] = useState([])
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
  //         pptDate: '2016-08-01',
  //         assessmentDate: '2020-05-15',
  //       },
  //       {
  //         collegeName: 'Stanford University',
  //         pptDate: '2015-08-01',
  //         assessmentDate: '2016-05-15',
  //       },
  //       {
  //         collegeName: 'MIT',
  //         pptDate: '2014-08-01',
  //         assessmentDate: '2015-05-15',
  //       },
  //       {
  //         collegeName: 'UC Berkeley',
  //         pptDate: '2013-08-01',
  //         assessmentDate: '2014-05-15',
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
  //         pptDate: '2017-08-01',
  //         assessmentDate: '2021-05-15',
  //       },
  //       {
  //         collegeName: 'University of Southern California',
  //         pptDate: '2016-08-01',
  //         assessmentDate: '2017-05-15',
  //       },
  //       {
  //         collegeName: 'UCLA',
  //         pptDate: '2015-08-01',
  //         assessmentDate: '2016-05-15',
  //       },
  //       {
  //         collegeName: 'UC Irvine',
  //         pptDate: '2014-08-01',
  //         assessmentDate: '2015-05-15',
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
  //         pptDate: '2018-08-01',
  //         assessmentDate: '2022-05-15',
  //       },
  //       {
  //         collegeName: 'Northwestern University',
  //         pptDate: '2017-08-01',
  //         assessmentDate: '2018-05-15',
  //       },
  //       {
  //         collegeName: 'University of Illinois',
  //         pptDate: '2016-08-01',
  //         assessmentDate: '2017-05-15',
  //       },
  //       {
  //         collegeName: 'DePaul University',
  //         pptDate: '2015-08-01',
  //         assessmentDate: '2016-05-15',
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
  //         pptDate: '2019-08-01',
  //         assessmentDate: '2023-05-15',
  //       },
  //       {
  //         collegeName: 'Seattle University',
  //         pptDate: '2018-08-01',
  //         assessmentDate: '2019-05-15',
  //       },
  //       {
  //         collegeName: 'Washington State University',
  //         pptDate: '2017-08-01',
  //         assessmentDate: '2018-05-15',
  //       },
  //       {
  //         collegeName: 'Gonzaga University',
  //         pptDate: '2016-08-01',
  //         assessmentDate: '2017-05-15',
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
  //         pptDate: '2015-08-01',
  //         assessmentDate: '2019-05-15',
  //       },
  //       {
  //         collegeName: 'MIT',
  //         pptDate: '2014-08-01',
  //         assessmentDate: '2015-05-15',
  //       },
  //       {
  //         collegeName: 'Boston University',
  //         pptDate: '2013-08-01',
  //         assessmentDate: '2014-05-15',
  //       },
  //       {
  //         collegeName: 'Northeastern University',
  //         pptDate: '2012-08-01',
  //         assessmentDate: '2013-05-15',
  //       },
  //     ],
  //   },
  // ])
  const [interviewerList, setInterviewerList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [conflictDialogOpen, setConflictDialogOpen] = useState(false)
  const [conflictingDates, setConflictingDates] = useState([])

  const baseUrl = process.env.BASE_URL

  const checkDateConflicts = formData => {
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
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${baseUrl}/admin/viewData`)
        const data = await response.json()
        setCollegeList(data)
        console.log(data)
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
        const response = await fetch(`${baseUrl}/api/interviewer/read`)
        if (response.ok) {
          const data = await response.json()
          setInterviewerList(data)
          console.log(data)
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
      collegeTPO,
      pptDate,
      assessmentDate,
      designDate,
      interviewDate,
      interviewer,
    }
    console.log(formData)
    const conflicts = checkDateConflicts(formData)
    if (conflicts.length > 0) {
      setConflictingDates(conflicts)
      setConflictDialogOpen(true)
    } else {
      createSchedule(formData)
    }
  }

  const handleConfirmConflict = () => {
    setConflictDialogOpen(false)
    const formData = {
      collegeTPO,
      pptDate,
      assessmentDate,
      designDate,
      interviewDate,
      interviewer,
    }
    createSchedule(formData)
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
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='collegeId' value='Select College' />
              </div>
              <Select
                id='collegeTPO'
                value={collegeTPO.collegeName}
                onChange={e => {
                  const selectedCollegeObject = collegeList.find(
                    collegeTPO => collegeTPO.collegeName === e.target.value,
                  )
                  setCollege(selectedCollegeObject)
                  console.log(selectedCollegeObject)
                }}
                required
              >
                <option value={''}>---Select a college---</option>
                {collegeList.map(collegeTPO => (
                  <option
                    key={collegeTPO.collegeId}
                    value={collegeTPO.collegeName}
                  >
                    {collegeTPO.collegeName}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='interviewerId' value='Select Interviewer' />
              </div>
              <Select
                id='interviewer'
                value={interviewer.interviewerName}
                onChange={e => {
                  const selectedInterviewerObject = interviewerList.find(
                    interviewer =>
                      interviewer.interviewerName === e.target.value,
                  )
                  setInterviewer(selectedInterviewerObject)
                  console.log(selectedInterviewerObject)
                }}
                required
              >
                <option value=''>---Select an interviewer---</option>
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

            <div>
              <div className='mb-2 block'>
                <Label htmlFor='pptDate' value='Pre Placement Talk Date' />
              </div>
            
              <TextInput
                id='pptDate'
                type='date'
                value={pptDate}
                onChange={e => setPptDate(e.target.value)}
                required
                min= { new Date().toISOString().split('T')[0]}
              />
            </div>
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
              Create Schedule
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
