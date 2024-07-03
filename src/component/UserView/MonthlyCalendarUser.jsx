import React, { useEffect, useState } from 'react';
 
import { Calendar, Badge, Typography, Button } from 'antd';
 
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux'
import axios from 'axios';
 
import { format } from 'date-fns';
import {Card} from 'antd';

const MonthlyCalendarUser = () => {
 
    const months = [
 
        'January', 'February', 'March', 'April', 'May', 'June',
 
        'July', 'August', 'September', 'October', 'November', 'December'
 
    ];
 
    const [mode, setMode] = useState('month');
    const {currentUser } = useSelector(state=>state.user)
    const [startDate, setStartDate] = useState(() => {
 
      const today = new Date();
 
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
 
    });
 
    const [attendanceData, setAttendanceData] = useState([]);
 
    const perBaseUrl = 'http://192.168.0.141:8080'

    const token = useSelector(state=>state.user.token)
 
    useEffect(() => {
 
      const fetchAttendanceData = async () => {
 
        try {
 
          // it is talentid from attendance table on front edn to give your own value directly give in fetched
 
            const urlParams = new URLSearchParams(window.location.search);
 
            const fetched = urlParams.get('talentId');
 
            const start = new Date(startDate);
 
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 0); // Calculate the last day of the month
 
            const formattedStartDate = format(start, 'yyyy-MM-dd');
            
            const formattedEndDate = format(end, 'yyyy-MM-dd');
 
            console.log(`${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formattedStartDate}&endDate=${formattedEndDate}&talentId=${currentUser.talentId}`)
 
            const response = await axios.get(`${perBaseUrl}/cpm/attendance/getAttendanceByDateRangeAndTalent?startDate=${formattedStartDate}&endDate=${formattedEndDate}&talentId=${currentUser.talentId}`, {
              headers:{
                Authorization: `Basic ${token}`
              }
            });
 
            setAttendanceData(response.data);
 
        } catch (error) {
 
            console.error('Error fetching attendance data:', error);
 
        }
 
    };
 
 
        
 
            fetchAttendanceData();
 
 
    }, [startDate, currentUser]);
 
    const onPanelChange = (value, mode) => {
 
        setMode(mode);
 
    };
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
 
    const getListData = (value) => {
        const listData = attendanceData.filter((data) => data.date === value.format('YYYY-MM-DD'));
        return listData.map((data, index) => (
            <div key={index} style={{ display: 'flex',flexDirection:'column', alignItems: 'center', gap: '10px' }}>
            <Badge status={data.status === 'Present' ? 'success' : 'error'} text={data.status} />
            <Typography.Text>{data.totalHours}</Typography.Text>
        </div>
        ));
    };
    
 
    const cellRender = (value) => {
 
        const listData = getListData(value);
 
        return <ul>{listData}</ul>;
 
    };
 
    const renderHeader = ({ value, onChange, type }) => {
 
        const year = value.year();
 
        const month = value.month();
 
        const headerText = `${months[month]}, ${year}`;
 
        const prevMonth = () => {
 
            const newValue = value.clone().subtract(1, 'month');
 
            onChange(newValue, 'month');
 
            setStartDate(newValue.clone().startOf('month').format('YYYY-MM-01'));
 
        };
 
        const nextMonth = () => {
 
            const newValue = value.clone().add(1, 'month');
 
            onChange(newValue, 'month');
 
            setStartDate(newValue.clone().startOf('month').format('YYYY-MM-01'));
 
        };
 
        return (
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 8, color: 'white', gap: 15 }}>
 
                <Button shape="square" icon={<LeftOutlined />}  style={{ backgroundColor: '#a1b4b5', color: '#ffffff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={prevMonth} />
 
                <Typography.Text style={{ fontWeight: 'bold' }} className='text-gray p-2 rounded-full'>{headerText}</Typography.Text>
 
                <Button shape="square" icon={<RightOutlined />}  style={{ backgroundColor: '#a1b4b5', color: '#ffffff', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)' }} onClick={nextMonth} />
 
            </div>
 
        );
 
    };
 
    return (
       
        <div>
             <div
        className='flex flex-row justify-center'
        style={{ margin: '10px 90px',height:'147px',width: '30%',border: '2px solid #ccc', borderRadius: '8px', padding: '16px' }}
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
                    width: '50px',
                    height: '50px',
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
              style={{ padding: '2px' }}
            >
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
            <Calendar cellRender={cellRender} mode={mode} onPanelChange={onPanelChange} headerRender={renderHeader} />
 
        </div>
 
    );
 
};
 
export default MonthlyCalendarUser; 