import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const localizer = momentLocalizer(moment)

const TrainingCalendarView = () => {
  const [trainingList, setTrainingList] = useState([
    {
      "startTime": "14:00",
      "endTime": "16:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "987654321012",
          "alternateNumber": "8765432109",
          "candidateId": 10,
          "cgpaMasters": 8.8,
          "cgpaUndergrad": 9.0,
          "collegeName": "IIT Bombay",
          "currentLocation": "Maharashtra",
          "department": "CS",
          "dob": "2000-03-15",
          "ekYear": "2021",
          "email": "neha@gmail.com",
          "fatherName": "Mahesh",
          "label": "Neha",
          "motherName": "Sunita",
          "officeLocation": "MUM",
          "panNumber": "BCDEF4567I",
          "permanentAddress": "Mumbai",
          "phoneNumber": "9212345678",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 8,
          "talentName": "Neha",
          "talentSkills": "Node.js",
          "tenthPercent": 92,
          "twelthPercent": 90,
          "value": 8
        }
      ],
      "trainer": {
        "designation": "DevOps Engineer",
        "email": "rajesh@gmail.com",
        "label": "Rajesh Kumar",
        "location": "Delhi",
        "skills": ["DevOps", "Docker", "Kubernetes"],
        "trainerId": "INC38",
        "trainerName": "Rajesh Kumar",
        "value": "INC38"
      },
      "trainingDate": "2024-07-15",
      "trainingTech": "devops",
      "trainingTopic": "CI/CD Pipelines"
    },
    {
      "startTime": "11:00",
      "endTime": "13:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "123456789012",
          "alternateNumber": "9876543211",
          "candidateId": 11,
          "cgpaMasters": 9.1,
          "cgpaUndergrad": 9.2,
          "collegeName": "IIT Kharagpur",
          "currentLocation": "West Bengal",
          "department": "CS",
          "dob": "2001-11-12",
          "ekYear": "2023",
          "email": "vivek@gmail.com",
          "fatherName": "Srinivas",
          "label": "Vivek",
          "motherName": "Lakshmi",
          "officeLocation": "KOL",
          "panNumber": "BCDEF5678J",
          "permanentAddress": "Kolkata",
          "phoneNumber": "9112345678",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 9,
          "talentName": "Vivek",
          "talentSkills": "AWS",
          "tenthPercent": 94,
          "twelthPercent": 92,
          "value": 9
        }
      ],
      "trainer": {
        "designation": "Cloud Architect",
        "email": "anita@gmail.com",
        "label": "Anita Singh",
        "location": "Hyderabad",
        "skills": ["AWS", "Cloud Computing", "Terraform"],
        "trainerId": "INC39",
        "trainerName": "Anita Singh",
        "value": "INC39"
      },
      "trainingDate": "2024-07-16",
      "trainingTech": "aws",
      "trainingTopic": "AWS Solutions Architect"
    },
    {
      "startTime": "08:00",
      "endTime": "10:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "789456123012",
          "alternateNumber": "9876543212",
          "candidateId": 12,
          "cgpaMasters": 8.3,
          "cgpaUndergrad": 8.4,
          "collegeName": "IIT Kanpur",
          "currentLocation": "Uttar Pradesh",
          "department": "ME",
          "dob": "2001-06-14",
          "ekYear": "2022",
          "email": "sameer@gmail.com",
          "fatherName": "Kamal",
          "label": "Sameer",
          "motherName": "Nirmala",
          "officeLocation": "LKO",
          "panNumber": "BCDEF6789K",
          "permanentAddress": "Lucknow",
          "phoneNumber": "9123456789",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 10,
          "talentName": "Sameer",
          "talentSkills": "Database",
          "tenthPercent": 91,
          "twelthPercent": 89,
          "value": 10
        }
      ],
      "trainer": {
        "designation": "DBA",
        "email": "manoj@gmail.com",
        "label": "Manoj Patel",
        "location": "Ahmedabad",
        "skills": ["Database", "SQL", "Oracle"],
        "trainerId": "INC40",
        "trainerName": "Manoj Patel",
        "value": "INC40"
      },
      "trainingDate": "2024-07-17",
      "trainingTech": "database",
      "trainingTopic": "Advanced SQL"
    },
    {
      "startTime": "15:00",
      "endTime": "17:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "789456123013",
          "alternateNumber": "9876543213",
          "candidateId": 13,
          "cgpaMasters": 8.9,
          "cgpaUndergrad": 9.1,
          "collegeName": "IIT Madras",
          "currentLocation": "Tamil Nadu",
          "department": "CS",
          "dob": "2002-05-18",
          "ekYear": "2023",
          "email": "gaurav@gmail.com",
          "fatherName": "Anil",
          "label": "Gaurav",
          "motherName": "Meena",
          "officeLocation": "CHN",
          "panNumber": "BCDEF7890L",
          "permanentAddress": "Chennai",
          "phoneNumber": "9123456790",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 11,
          "talentName": "Gaurav",
          "talentSkills": "Big Data",
          "tenthPercent": 93,
          "twelthPercent": 90,
          "value": 11
        }
      ],
      "trainer": {
        "designation": "Data Engineer",
        "email": "vivek@gmail.com",
        "label": "Vivek Rao",
        "location": "Bangalore",
        "skills": ["Big Data", "Hadoop", "Spark"],
        "trainerId": "INC41",
        "trainerName": "Vivek Rao",
        "value": "INC41"
      },
      "trainingDate": "2024-07-18",
      "trainingTech": "bigdata",
      "trainingTopic": "Hadoop Ecosystem"
    },
    {
      "startTime": "12:00",
      "endTime": "14:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "123456789013",
          "alternateNumber": "9876543214",
          "candidateId": 14,
          "cgpaMasters": 9.3,
          "cgpaUndergrad": 9.4,
          "collegeName": "IIT Roorkee",
          "currentLocation": "Uttarakhand",
          "department": "CE",
          "dob": "2001-04-21",
          "ekYear": "2022",
          "email": "ritu@gmail.com",
          "fatherName": "Naveen",
          "label": "Ritu",
          "motherName": "Sunita",
          "officeLocation": "HR",
          "panNumber": "BCDEF8901M",
          "permanentAddress": "Haridwar",
          "phoneNumber": "9112345679",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 12,
          "talentName": "Ritu",
          "talentSkills": "AI",
          "tenthPercent": 95,
          "twelthPercent": 93,
          "value": 12
        }
      ],
      "trainer": {
        "designation": "AI Specialist",
        "email": "rohit@gmail.com",
        "label": "Rohit Gupta",
        "location": "Noida",
        "skills": ["AI", "Machine Learning", "Python"],
        "trainerId": "INC42",
        "trainerName": "Rohit Gupta",
        "value": "INC42"
      },
      "trainingDate": "2024-07-19",
      "trainingTech": "ai",
      "trainingTopic": "Deep Learning"
    },
    {
      "startTime": "09:00",
      "endTime": "11:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "654321789013",
          "alternateNumber": "9876543215",
          "candidateId": 15,
          "cgpaMasters": 8.6,
          "cgpaUndergrad": 8.8,
          "collegeName": "IIT Guwahati",
          "currentLocation": "Assam",
          "department": "EE",
          "dob": "2000-01-10",
          "ekYear": "2021",
          "email": "arjun@gmail.com",
          "fatherName": "Prakash",
          "label": "Arjun",
          "motherName": "Kavita",
          "officeLocation": "GHY",
          "panNumber": "BCDEF9012N",
          "permanentAddress": "Guwahati",
          "phoneNumber": "9123456791",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 13,
          "talentName": "Arjun",
          "talentSkills": "Cybersecurity",
          "tenthPercent": 92,
          "twelthPercent": 89,
          "value": 13
        }
      ],
      "trainer": {
        "designation": "Security Analyst",
        "email": "akash@gmail.com",
        "label": "Akash Mehta",
        "location": "Chandigarh",
        "skills": ["Cybersecurity", "Network Security", "Penetration Testing"],
        "trainerId": "INC43",
        "trainerName": "Akash Mehta",
        "value": "INC43"
      },
      "trainingDate": "2024-07-20",
      "trainingTech": "cybersecurity",
      "trainingTopic": "Network Security"
    },
    {
      "startTime": "14:00",
      "endTime": "16:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "789456123014",
          "alternateNumber": "9876543216",
          "candidateId": 16,
          "cgpaMasters": 9.0,
          "cgpaUndergrad": 9.1,
          "collegeName": "IIT Gandhinagar",
          "currentLocation": "Gujarat",
          "department": "CS",
          "dob": "2001-05-22",
          "ekYear": "2023",
          "email": "manisha@gmail.com",
          "fatherName": "Surya",
          "label": "Manisha",
          "motherName": "Savita",
          "officeLocation": "AHM",
          "panNumber": "BCDEF0123O",
          "permanentAddress": "Ahmedabad",
          "phoneNumber": "9123456792",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "In Person",
          "talentEmploymentType": null,
          "talentId": 14,
          "talentName": "Manisha",
          "talentSkills": "Blockchain",
          "tenthPercent": 94,
          "twelthPercent": 92,
          "value": 14
        }
      ],
      "trainer": {
        "designation": "Blockchain Developer",
        "email": "pankaj@gmail.com",
        "label": "Pankaj Singh",
        "location": "Gurgaon",
        "skills": ["Blockchain", "Solidity", "Ethereum"],
        "trainerId": "INC44",
        "trainerName": "Pankaj Singh",
        "value": "INC44"
      },
      "trainingDate": "2024-07-21",
      "trainingTech": "blockchain",
      "trainingTopic": "Smart Contracts"
    },
    {
      "startTime": "10:00",
      "endTime": "12:00",
      "selectedEmployees": [
        {
          "aadhaarNumber": "987654321014",
          "alternateNumber": "9876543217",
          "candidateId": 17,
          "cgpaMasters": 8.7,
          "cgpaUndergrad": 8.9,
          "collegeName": "IIT Bhubaneswar",
          "currentLocation": "Odisha",
          "department": "ME",
          "dob": "2002-03-13",
          "ekYear": "2022",
          "email": "sushant@gmail.com",
          "fatherName": "Arun",
          "label": "Sushant",
          "motherName": "Rekha",
          "officeLocation": "BBS",
          "panNumber": "BCDEF1234P",
          "permanentAddress": "Bhubaneswar",
          "phoneNumber": "9123456793",
          "plOwner": null,
          "reportingManager": null,
          "talentCategory": "Online",
          "talentEmploymentType": null,
          "talentId": 15,
          "talentName": "Sushant",
          "talentSkills": "IoT",
          "tenthPercent": 90,
          "twelthPercent": 87,
          "value": 15
        }
      ],
      "trainer": {
        "designation": "IoT Specialist",
        "email": "sunil@gmail.com",
        "label": "Sunil Patil",
        "location": "Pune",
        "skills": ["IoT", "Embedded Systems", "Arduino"],
        "trainerId": "INC45",
        "trainerName": "Sunil Patil",
        "value": "INC45"
      },
      "trainingDate": "2024-07-22",
      "trainingTech": "iot",
      "trainingTopic": "IoT Applications"
    }
  ]
  )
  const [showEventPopup, setShowEventPopup] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const baseUrl = process.env.BASE_URL

  const token = useSelector(state => state.user.token)

  const handleEventClick = event => {
    setSelectedEvent(event)
    setShowEventPopup(true)
  }

//   useEffect(() => {
//     setIsLoading(true)
//     setTimeout(() => {
//       const fetchData = async () => {
//         try {
//           // In a real scenario, you'd fetch data from an API
//           // For this example, we'll use the provided data
//           const data = [
//             // ... (paste the array of training objects here)
//           ]
//           setTrainingList(data)
//         } catch (error) {
//           console.error('Error fetching data:', error)
//           setError(error.message)
//         } finally {
//           setIsLoading(false)
//         }
//       }

//       fetchData()
//     }, 1000)
//   }, [])

  const events = trainingList.map(training => ({
    id: `${training.trainingDate}-${training.trainingTech}`,
    title: `${training.trainingTopic} - ${training.trainingTech}`,
    start: new Date(`${training.trainingDate}T${training.startTime}`),
    end: new Date(`${training.trainingDate}T${training.endTime}`),
    trainer: training.trainer,
    tech: training.trainingTech,
  }))

  return (
    <div className='container p-4'>
      <h2 className='text-2xl font-bold mb-4'>Training Schedules</h2>
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
      <div className='relative bg-white rounded-lg shadow-lg p-6 max-w-3xl z-10'>
        <h3 className='text-2xl font-semibold mb-4'>{event.title}</h3>
        <div className='mb-4'>
          <p className='text-gray-700'><b>Date: </b>{moment(event.start).format('YYYY-MM-DD')}</p>
          <p className='text-gray-700'><b>Time: </b>{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</p>
          <p className='text-gray-700'><b>Technology: </b>{event.tech}</p>
          <p className='text-gray-700'><b>Trainer: </b>{event.trainer.trainerName}</p>
          <p className='text-gray-700'><b>Trainer Location: </b>{event.trainer.location}</p>
          
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

export default TrainingCalendarView