import React from 'react'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import { Button } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Card } from 'antd'
import { useSelector } from 'react-redux'

const columns = [
  { id: 'talentName', label: 'Talent Name', minWidth: 170 },
  { id: 'date', label: 'Date', minWidth: 170 },
  { id: 'checkin', label: 'Check In', minWidth: 170 },
  { id: 'checkout', label: 'Check Out', minWidth: 170 },
  { id: 'totalHours', label: 'Working Hours', minWidth: 150 },
  { id: 'status', label: 'Status', minWidth: 170 },
  { id: 'officeLocation', label: 'Office Location', minWidth: 170 },
  { id: 'ekYear', label: 'Ek Year', minWidth: 170 },
]

function createData(
  talentName,
  talentCategory,
  officeLocation,
  ekYear,
  status,
  date,
  checkin,
  checkout,
  totalHours,
) {
  return {
    talentName,
    talentCategory,
    officeLocation,
    ekYear,
    status,
    date,
    checkin,
    checkout,
    totalHours,
  }
}

export default function WeeklyCalendar() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [startDate, setStartDate] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState([])
  const perBaseUrl = process.env.BASE_URL2
  const token = useSelector((state) => state.user.token)

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const fetched = urlParams.get('talentId')

        // Calculate start and end of week
        const currentDate = new Date(startDate)
        const start = new Date(currentDate)
        start.setDate(currentDate.getDate() - currentDate.getDay())
        const end = new Date(currentDate)
        end.setDate(currentDate.getDate() + (6 - currentDate.getDay()))

        console.log(
          `${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formatDate(
            start,
          )}&endDate=${formatDate(end)}&talentId=${fetched}`,
        )

        const response = await axios.get(
          `${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formatDate(
            start,
          )}&endDate=${formatDate(end)}&talentId=${fetched}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          },
        )
        setAttendanceData(response.data)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      }
    }

    fetchAttendanceData()
  }, [startDate, token, perBaseUrl])

  const rows = attendanceData.map((attendance) =>
    createData(
      attendance.talentName,
      attendance.talentCategory,
      attendance.officeLocation,
      attendance.ekYear,
      attendance.status,
      attendance.date,
      attendance.checkin,
      attendance.checkout,
      attendance.totalHours,
    ),
  )

  const totalWorkingMinutes = attendanceData.reduce((acc, curr) => {
    const totalHoursComponents = curr.totalHours.split(':') // Splitting hours and minutes
    const hours = parseInt(totalHoursComponents[0])
    const minutes = parseInt(totalHoursComponents[1])

    // Adding hours and minutes to the accumulator
    return acc + (hours * 60 + minutes) // Convert hours to minutes
  }, 0)

  // Convert total minutes to hours and remaining minutes
  const totalHours = Math.floor(totalWorkingMinutes / 60)
  const remainingMinutes = totalWorkingMinutes % 60

  const formattedTotalHours = `${totalHours}hrs ${remainingMinutes}mins`

  const decreaseWeek = () => {
    const newStartDate = new Date(startDate)
    newStartDate.setDate(newStartDate.getDate() - 7)
    newStartDate.setDate(newStartDate.getDate() - newStartDate.getDay()) // Set to start of week
    setStartDate(newStartDate)
    console.log("decrease=", newStartDate)
  }

  const increaseWeek = () => {
    const newStartDate = new Date(startDate)
    newStartDate.setDate(newStartDate.getDate() + 7)
    newStartDate.setDate(newStartDate.getDate() - newStartDate.getDay()) // Set to start of week
    setStartDate(newStartDate)
    console.log("increase=", newStartDate)
  }

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const currentDate = new Date(startDate) // Your input date
  const startOfWeek = new Date(currentDate)
  const endOfWeek = new Date(currentDate)

  // Adjust to the start of the week (Sunday)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  // Adjust to the end of the week (Saturday)
  endOfWeek.setDate(currentDate.getDate() + (6 - currentDate.getDay()))

  console.log("Start of week:", startOfWeek)
  console.log("End of week:", endOfWeek)

  return (
    <div>
      <div
        className='flex flex-row justify-center'
        style={{ margin: '10px 90px', height: '167px' }}
      >
        <div
          className='flex flex-row justify-between'
          style={{ margin: '10px 90px' }}
        >
          <Card
            title={
              <div className='flex items-center'>
                <svg
                  className='MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-ua0iu'
                  focusable='false'
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  data-testid='AvTimerIcon'
                  style={{
                    width: '60px',
                    height: '60px',
                    fill: 'orange',
                    marginRight: '8px',
                  }}
                >
                  <path d='M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1m0-14v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9zm7 9c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1M6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1'></path>
                </svg>
                <div style={{ fontWeight: 'bold', color: '#919195' }}>
                  Total Working Hours
                </div>
              </div>
            }
            style={{ width: 300, border: '1px  blue' }}
          >
            <div
              className='flex flex-col items-center justify-center'
              style={{ padding: '10px' }}
            >
              {' '}
              {/* Decreased padding */}
              <div
                style={{
                  fontSize: '25px',
                  fontWeight: 'bold',
                  color: '#919195',
                }}
              >
                {formattedTotalHours}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Paper sx={{ width: '100%' }}>
        <div className='flex flex-row mt-4 justify-center items-center gap-4'>
          <Button
            shape='circle'
            icon={<LeftOutlined />}
            onClick={decreaseWeek}
          />
          <div className='text-white bg-blue-500 p-4 rounded-full font-bold'>{`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`}</div>
          <Button
            onClick={increaseWeek}
            shape='circle'
            icon={<RightOutlined />}
          />
        </div>
        <TableContainer sx={{ maxHeight: 440, marginTop: 2 }}>
          <Table stickyHeader aria-label='sticky table' className='mt-4'>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <Typography variant='subtitle1' fontWeight='bold'>
                      {column.label}
                    </Typography>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role='checkbox' tabIndex={-1} key={index}>
                      {columns.map((column) => {
                        const value = row[column.id]
                        let cellStyle = {}
                        if (column.id === 'status') {
                          cellStyle = {
                            color: value === 'Present' ? 'green' : 'red',
                          }
                        }
                        if (column.id === 'checkin') {
                          cellStyle = { color: 'green' }
                        }
                        if (column.id === 'checkout') {
                          cellStyle = { color: 'red' }
                        }
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={cellStyle}
                          >
                            {value}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  )
}
