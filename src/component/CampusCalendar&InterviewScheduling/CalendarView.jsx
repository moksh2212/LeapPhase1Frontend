import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'


const localizer = momentLocalizer(moment)

const CollegeCalendarView = () => {
  // const [scheduleList, setScheduleList] = useState([
  //   {
  //     scheduleId: 'SCH2037',
  //     collegeName: 'University of Pretoria',
  //     location: 'Pretoria',
  //     region: 'Africa',
  //     pptDate: '2024-07-31',
  //     assessmentDate: '2024-08-01',
  //     designDate: '2024-08-02',
  //     interviewDate: '2024-08-03',
  //     interviewerName: 'Isabelle Taylor',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH2038',
  //     collegeName: 'Stellenbosch University',
  //     location: 'Stellenbosch',
  //     region: 'Africa',
  //     pptDate: '2024-08-01',
  //     assessmentDate: '2024-08-02',
  //     designDate: '2024-08-03',
  //     interviewDate: '2024-08-04',
  //     interviewerName: 'John Doe',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH2039',
  //     collegeName: 'University of Cape Town',
  //     location: 'Cape Town',
  //     region: 'Africa',
  //     pptDate: '2024-08-02',
  //     assessmentDate: '2024-08-03',
  //     designDate: '2024-08-04',
  //     interviewDate: '2024-08-05',
  //     interviewerName: 'Jane Smith',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH2040',
  //     collegeName: 'University of the Witwatersrand',
  //     location: 'Johannesburg',
  //     region: 'Africa',
  //     pptDate: '2024-08-03',
  //     assessmentDate: '2024-08-04',
  //     designDate: '2024-08-05',
  //     interviewDate: '2024-08-06',
  //     interviewerName: 'Michael Brown',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH2041',
  //     collegeName: 'University of Nairobi',
  //     location: 'Nairobi',
  //     region: 'Africa',
  //     pptDate: '2024-08-04',
  //     assessmentDate: '2024-08-05',
  //     designDate: '2024-08-06',
  //     interviewDate: '2024-08-07',
  //     interviewerName: 'Emily Davis',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH2042',
  //     collegeName: 'Makerere University',
  //     location: 'Kampala',
  //     region: 'Africa',
  //     pptDate: '2024-08-05',
  //     assessmentDate: '2024-08-06',
  //     designDate: '2024-08-07',
  //     interviewDate: '2024-08-08',
  //     interviewerName: 'Daniel Wilson',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH2043',
  //     collegeName: 'University of Ghana',
  //     location: 'Accra',
  //     region: 'Africa',
  //     pptDate: '2024-08-06',
  //     assessmentDate: '2024-08-07',
  //     designDate: '2024-08-08',
  //     interviewDate: '2024-08-09',
  //     interviewerName: 'Sarah Johnson',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH2044',
  //     collegeName: 'University of Lagos',
  //     location: 'Lagos',
  //     region: 'Africa',
  //     pptDate: '2024-08-07',
  //     assessmentDate: '2024-08-08',
  //     designDate: '2024-08-09',
  //     interviewDate: '2024-08-10',
  //     interviewerName: 'Chris Martin',
  //     grade: 'B',
  //   },
  //   {
  //     scheduleId: 'SCH2045',
  //     collegeName: 'University of Dar es Salaam',
  //     location: 'Dar es Salaam',
  //     region: 'Africa',
  //     pptDate: '2024-08-08',
  //     assessmentDate: '2024-08-09',
  //     designDate: '2024-08-10',
  //     interviewDate: '2024-08-11',
  //     interviewerName: 'Anna Moore',
  //     grade: 'A',
  //   },
  //   {
  //     scheduleId: 'SCH2046',
  //     collegeName: 'University of Botswana',
  //     location: 'Gaborone',
  //     region: 'Africa',
  //     pptDate: '2024-08-09',
  //     assessmentDate: '2024-08-10',
  //     designDate: '2024-08-11',
  //     interviewDate: '2024-08-12',
  //     interviewerName: 'Peter White',
  //     grade: 'B',
  //   },
  // ])
  const [scheduleList, setScheduleList] = useState([])
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const baseUrl = process.env.BASE_URL

  const token = useSelector(state=>state.user.token)

  const handleEventClick = event => {
    setSelectedEvent(event)
    setShowEventPopup(true)
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseUrl}/api/interviewschedule/read`, {
            headers:{
              Authorization: `Basic ${token}`,
            }
          })
          if (response.ok) {
            const data = await response.json()
            setScheduleList(data)
          }
        } catch (error) {
          console.error('Error fetching data:', error)
          setError(error.message)
        } finally {
          setIsLoading(false)
        }
      }

      fetchData()
    }, 1000)
  }, [])
  const events = scheduleList.flatMap(schedule => [
    {
      id: `${schedule.scheduleId}-ppt`,
      title: `${schedule.collegeName} - Pre Placement Talk`,
      start: new Date(schedule.pptDate + 'T09:00:00'),
      end: new Date(schedule.pptDate + 'T18:00:00'),
      location: schedule.location,
      region: schedule.region,
      interviewer: {
        name: schedule.interviewerName,
        grade: schedule.grade,
      },
      dates: {
        pptDate: schedule.pptDate,
        assessmentDate: schedule.assessmentDate,
        designDate: schedule.designDate,
        interviewDate: schedule.interviewDate,
      },
    },
    {
      id: `${schedule.scheduleId}-assessment`,
      title: `${schedule.collegeName} - Assessment`,
      start: new Date(schedule.assessmentDate + 'T09:00:00'),
      end: new Date(schedule.assessmentDate + 'T18:00:00'),
      location: schedule.location,
      region: schedule.region,
      interviewer: {
        name: schedule.interviewerName,
        grade: schedule.grade,
      },
      dates: {
        pptDate: schedule.pptDate,
        assessmentDate: schedule.assessmentDate,
        designDate: schedule.designDate,
        interviewDate: schedule.interviewDate,
      },
    },
    {
      id: `${schedule.scheduleId}-design`,
      title: `${schedule.collegeName} - Design Exercise`,
      start: new Date(schedule.designDate + 'T09:00:00'),
      end: new Date(schedule.designDate + 'T18:00:00'),
      location: schedule.location,
      region: schedule.region,
      interviewer: {
        name: schedule.interviewerName,
        grade: schedule.grade,
      },
      dates: {
        pptDate: schedule.pptDate,
        assessmentDate: schedule.assessmentDate,
        designDate: schedule.designDate,
        interviewDate: schedule.interviewDate,
      },
    },
    {
      id: `${schedule.scheduleId}-interview`,
      title: `${schedule.collegeName} - Interview`,
      start: new Date(schedule.interviewDate + 'T09:00:00'),
      end: new Date(schedule.interviewDate + 'T18:00:00'),
      location: schedule.location,
      region: schedule.region,
      interviewer: {
        name: schedule.interviewerName,
        grade: schedule.grade,
      },
      dates: {
        pptDate: schedule.pptDate,
        assessmentDate: schedule.assessmentDate,
        designDate: schedule.designDate,
        interviewDate: schedule.interviewDate,
      },
    },
  ])

  return (
    <div className='container p-4'>
      <h2 className='text-2xl font-bold mb-4'>College Schedules</h2>
      {isLoading && <div className='h-[10rem] font-medium flex justify-center items-center'>Loading...</div>}
      {!isLoading && (
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 700 }}
          defaultView='month'
          defaultDate={new Date()}
          onSelectEvent={event => handleEventClick(event)}
          className='bg-white shadow-lg rounded-lg'
        />
      )}
      {showEventPopup && (
        <EventPopup
          event={selectedEvent}
          onClose={() => setShowEventPopup(false)}
        />
      )}
    </div>
  )
}


const EventPopup = ({ event, onClose }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>

      <div className='absolute inset-0 bg-black opacity-50'></div>

      {/* Popup Container */}
      <div className='relative bg-white rounded-lg shadow-lg p-6 max-w-md z-10'>
        <h3 className='text-2xl font-semibold mb-4'>{event.title}</h3>

        <div className='mb-4'>
          <p className='text-gray-700'>
            <b>Location: </b>
            {event.location}
          </p>
          <p className='text-gray-700'>
            <b>Region: </b>
            {event.region}
          </p>
          <p className='text-gray-700'>
            <b>Pre Placement Talk: </b>
            {event.dates.pptDate}
          </p>
          <p className='text-gray-700'>
            <b>Assessment: </b>
            {event.dates.assessmentDate}
          </p>
          <p className='text-gray-700'>
            <b>Design Exercise: </b>
            {event.dates.designDate}
          </p>
          <p className='text-gray-700'>
            <b>Interview: </b>
            {event.dates.interviewDate}
          </p>
          <p className='text-gray-700'>
            <b>Interviewer: </b>
            {event.interviewer.name} (Grade: {event.interviewer.grade})
          </p>
        </div>

        <button
          className='bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300'
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default CollegeCalendarView
