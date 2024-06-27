import moment from 'moment'
import React, { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'

const localizer = momentLocalizer(moment)


const InterviewerCalendarView = () => {
    const [interviewerList, setInterviewerList] = useState([
        {
          interviewerId: 1,
          interviewerName: 'Alice Johnson',
          grade: 'A',
          techRole: 'Frontend Developer',
          techProficiency: 'Advanced',
          location: 'New York',
          region: 'North America',
          workExperience: '5 years',
          scheduleDetails: [
            {
              collegeName: 'Harvard University',
              startDate: '2016-08-01',
              endDate: '2020-05-15',
            },
            {
              collegeName: 'Stanford University',
              startDate: '2015-08-01',
              endDate: '2016-05-15',
            },
            {
              collegeName: 'MIT',
              startDate: '2014-08-01',
              endDate: '2015-05-15',
            },
            {
              collegeName: 'UC Berkeley',
              startDate: '2013-08-01',
              endDate: '2014-05-15',
            },
          ],
        },
        {
          interviewerId: 2,
          interviewerName: 'Bob Smith',
          grade: 'B',
          techRole: 'Backend Developer',
          techProficiency: 'Intermediate',
          location: 'San Francisco',
          region: 'North America',
          workExperience: '4 years',
          scheduleDetails: [
            {
              collegeName: 'University of California, San Diego',
              startDate: '2017-08-01',
              endDate: '2021-05-15',
            },
            {
              collegeName: 'University of Southern California',
              startDate: '2016-08-01',
              endDate: '2017-05-15',
            },
            {
              collegeName: 'UCLA',
              startDate: '2015-08-01',
              endDate: '2016-05-15',
            },
            {
              collegeName: 'UC Irvine',
              startDate: '2014-08-01',
              endDate: '2015-05-15',
            },
          ],
        },
        {
          interviewerId: 3,
          interviewerName: 'Carol Williams',
          grade: 'A',
          techRole: 'Full Stack Developer',
          techProficiency: 'Advanced',
          location: 'Chicago',
          region: 'North America',
          workExperience: '6 years',
          scheduleDetails: [
            {
              collegeName: 'University of Chicago',
              startDate: '2018-08-01',
              endDate: '2022-05-15',
            },
            {
              collegeName: 'Northwestern University',
              startDate: '2017-08-01',
              endDate: '2018-05-15',
            },
            {
              collegeName: 'University of Illinois',
              startDate: '2016-08-01',
              endDate: '2017-05-15',
            },
            {
              collegeName: 'DePaul University',
              startDate: '2015-08-01',
              endDate: '2016-05-15',
            },
          ],
        },
        {
          interviewerId: 4,
          interviewerName: 'David Brown',
          grade: 'C',
          techRole: 'DevOps Engineer',
          techProficiency: 'Intermediate',
          location: 'Seattle',
          region: 'North America',
          workExperience: '3 years',
          scheduleDetails: [
            {
              collegeName: 'University of Washington',
              startDate: '2019-08-01',
              endDate: '2023-05-15',
            },
            {
              collegeName: 'Seattle University',
              startDate: '2018-08-01',
              endDate: '2019-05-15',
            },
            {
              collegeName: 'Washington State University',
              startDate: '2017-08-01',
              endDate: '2018-05-15',
            },
            {
              collegeName: 'Gonzaga University',
              startDate: '2016-08-01',
              endDate: '2017-05-15',
            },
          ],
        },
        {
          interviewerId: 5,
          interviewerName: 'Eva Green',
          grade: 'B',
          techRole: 'Data Scientist',
          techProficiency: 'Advanced',
          location: 'Boston',
          region: 'North America',
          workExperience: '7 years',
          scheduleDetails: [
            {
              collegeName: 'Harvard University',
              startDate: '2015-08-01',
              endDate: '2019-05-15',
            },
            {
              collegeName: 'MIT',
              startDate: '2014-08-01',
              endDate: '2015-05-15',
            },
            {
              collegeName: 'Boston University',
              startDate: '2013-08-01',
              endDate: '2014-05-15',
            },
            {
              collegeName: 'Northeastern University',
              startDate: '2012-08-01',
              endDate: '2013-05-15',
            },
          ],
        },
      ])
  const events = interviewerList.flatMap(interviewer =>
    interviewer.scheduleDetails.map(schedule => ({
      title: `${schedule.collegeName} (${interviewer.techRole})`,
      start: new Date(schedule.startDate),
      end: new Date(schedule.endDate),
    })),
  )

  return (
    <div>
      <h2>Interviewer Schedules</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor='start'
        endAccessor='end'
        style={{ height: 600 }}
      />
    </div>
  )
}

export default InterviewerCalendarView
