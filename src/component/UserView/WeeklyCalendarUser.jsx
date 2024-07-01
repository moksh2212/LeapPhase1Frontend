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
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
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

export default function WeeklyCalendarUser() {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(7)
  const [startDate, setStartDate] = useState(new Date())
  const [attendanceData, setAttendanceData] = useState([])
  const { currentUser } = useSelector(state => state.user)
  const perBaseUrl = 'http://192.168.0.141:8080'
  const token = useSelector(state => state.user.token)
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // it is talentid from attendance table on front edn to give your own value directly give in fetched

        const urlParams = new URLSearchParams(window.location.search)
        const fetched = urlParams.get('talentId')
        const start = new Date(startDate)
        const end = new Date(startDate)
        end.setDate(start.getDate() + 6)
        // console.log(
        //   `${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formatDate(
        //     start,
        //   )}&endDate=${formatDate(end)}&talentId=${currentUser.talentId}`,
        // )

        const response = await axios.get(
          `${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formatDate(
            start,
          )}&endDate=${formatDate(end)}&talentId=${currentUser.talentId}`,{
            headers:{
              Authorization: `Basic ${token}`
            }
          }
        );
        setAttendanceData(response.data)
      } catch (error) {
        console.error('Error fetching attendance data:', error)
      }
    }

    fetchAttendanceData()
  }, [startDate, currentUser])

  const rows = attendanceData.map(attendance =>
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

  // Format total working hours
  const formattedTotalHours = `${totalHours}hrs ${remainingMinutes}mins`

  const decreaseWeek = () => {
    const newStartDate = new Date(startDate)
    newStartDate.setDate(newStartDate.getDate() - 7)
    setStartDate(newStartDate)
  }

  const increaseWeek = () => {
    const newStartDate = new Date(startDate)
    newStartDate.setDate(newStartDate.getDate() + 7)
    setStartDate(newStartDate)
  }

  const formatDate = date => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const startOfWeek = new Date(startDate)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  const endOfWeek = new Date(startDate)
  endOfWeek.setDate(startOfWeek.getDate() + 6)

  return (
    <div>
      <div
        className='flex flex-row justify-center'
        style={{
          margin: '10px 90px',
          height: '147px',
          width: '30%',
          border: '2px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
        }}
      >
        <div
          className='flex flex-row justify-between'
          style={{ margin: '10px 90px' }}
        >
          <Card
            title={
              <div className='flex items-center'>
                <svg
                  className='MuiSvgIcon-root MuiSvgIcon-fontSizeSmall css-ua0iu'
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
              style={{ padding: '1px' }}
            >
              <div
                style={{
                  fontSize: '20px',
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
            shape='square'
            style={{
              backgroundColor: '#a1b4b5',
              color: '#ffffff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            icon={<LeftOutlined />}
            onClick={decreaseWeek}
          />
          <div className='text-gray-1000 font-bold'>{`${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`}</div>
          <Button
            onClick={increaseWeek}
            style={{
              backgroundColor: '#a1b4b5',
              color: '#ffffff',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            shape='square'
            icon={<RightOutlined />}
          />
        </div>
        <TableContainer sx={{ maxHeight: 240, marginTop: 2 }}>
          <Table stickyHeader aria-label='sticky table' className='mt-4'>
            <TableHead>
              <TableRow>
                {columns.map(column => (
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
                      {columns.map(column => {
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
