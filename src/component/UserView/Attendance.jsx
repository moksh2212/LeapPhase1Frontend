import React, { useState } from 'react'
import {
  Tabs,
  Card,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Select,
  Upload,
} from 'antd'
import axios from 'axios'
import { UploadOutlined } from '@ant-design/icons'
import WeeklyCalendar from './WeeklyCalendarUser'
import MonthlyCalendar from './MonthlyCalendarUser'
import { useSelector } from 'react-redux'
import moment from 'moment'

const { TabPane } = Tabs
const { Option } = Select
const Attendance = () => {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false)
  const [isRegularizeModalVisible, setIsRegularizeModalVisible] =
    useState(false)
  const [leaveForm] = Form.useForm()
  const [regularizeForm] = Form.useForm()
  const { currentUser } = useSelector(state => state.user)

  const token = useSelector(state => state.user.token)
  const [isOtherReason, setIsOtherReason] = useState(false)

  const handleReasonChange = value => {
    setIsOtherReason(value === 'other')
  }
  const showLeaveModal = () => {
    setIsLeaveModalVisible(true)
  }

  const showRegularizeModal = () => {
    setIsRegularizeModalVisible(true)
  }

  const handleLeaveCancel = () => {
    setIsLeaveModalVisible(false)
  }

  const handleRegularizeCancel = () => {
    setIsRegularizeModalVisible(false)
  }

  const handleLeaveOk = () => {
    leaveForm
      .validateFields()
      .then(values => {
        leaveForm.resetFields()
        const today = new Date()
        const todayDate = today.toISOString().split('T')[0]
        const formattedStartDate = values.startDate.format('YYYY-MM-DD')
        const formattedEndDate = values.endDate.format('YYYY-MM-DD')
        const formData = new FormData()
        formData.append(
          'leave',
          new Blob(
            [
              JSON.stringify({
                ...values,
                date: todayDate,
                talentId: currentUser.talentId,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
              }),
            ],
            { type: 'application/json' },
          ),
        )

        // Append the PDF file to the FormData object
        if (values.pdfUpload && values.pdfUpload.length > 0) {
          formData.append('file', values.pdfUpload[0].originFileObj)
        }

        axios
          .post('http://192.168.0.147:8080/cpm/leaves/addLeave', formData, {
            headers: {
              Authorization: `Basic ${token}`,
            },
          })
          .then(response => {
            message.success('Leave request submitted successfully')
            setIsLeaveModalVisible(false)
          })
          .catch(error => {
            console.error(
              'There was an error submitting the leave request:',
              error,
            )
            message.error('Failed to submit leave request')
          })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  const handleRegularizeOk = () => {
    regularizeForm
      .validateFields()
      .then(values => {
        regularizeForm.resetFields()
        const today = new Date()
        const todayDate = today.toISOString().split('T')[0]

        const formattedAttendanceDate =
          values.attendanceDate.format('YYYY-MM-DD')
        const formattedCheckin = values.checkin.format('HH:mm:ss')
        const formattedCheckout = values.checkout.format('HH:mm:ss')

        const dataToSend = {
          ...values,
          talentId: currentUser.talentId,
          regularizeDate: todayDate,
          attendanceDate: formattedAttendanceDate,
          checkin: formattedCheckin,
          checkout: formattedCheckout,
        }

        axios
          .post(
            'http://192.168.0.147:8080/cpm/regularize/addRegularize',
            dataToSend,
            {
              headers: {
                Authorization: `Basic ${token}`,
              },
            },
          )
          .then(response => {
            message.success('Attendance regularization submitted successfully')
            setIsRegularizeModalVisible(false)
          })
          .catch(error => {
            console.error(
              'There was an error submitting the regularization:',
              error,
            )
            message.error('Failed to submit regularization')
          })
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }

  return (
    <div className='mt-4'>
      <Card
        title={
          <span
            style={{ fontWeight: 'bold', fontSize: '30px', color: '#a1b4b5' }}
          >
            Attendance
          </span>
        }
        bordered={false}
        style={{ width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        extra={
          <>
            <Button
              type='primary'
              style={{
                backgroundColor: 'green',
                borderColor: 'green',
                marginRight: '10px',
              }}
              onClick={showLeaveModal}
            >
              Apply for Leave
            </Button>
            <Button
              type='primary'
              style={{ backgroundColor: '#f07575', borderColor: 'black' }}
              onClick={showRegularizeModal}
            >
              Regularize Attendance
            </Button>
          </>
        }
      >
        <Tabs defaultActiveKey='1'>
          <TabPane tab='Weekly' key='1'>
            <WeeklyCalendar />
          </TabPane>
          <TabPane tab='Monthly' key='2'>
            <MonthlyCalendar />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title='Leave Request'
        visible={isLeaveModalVisible}
        onOk={handleLeaveOk}
        onCancel={handleLeaveCancel}
      >
        <Form form={leaveForm} layout='vertical' name='leave_request_form'>
          <Form.Item
            name='startDate'
            label='Start Date'
            rules={[
              { required: true, message: 'Please select the start date!' },
            ]}
          >
            <DatePicker
              style={{ width: '100%' }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
            />
          </Form.Item>
          <Form.Item
            name='endDate'
            label='End Date'
            rules={[{ required: true, message: 'Please select the end date!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
            />
          </Form.Item>
          <Form.Item
            name='subject'
            label='Subject'
            rules={[
              {
                required: true,
                message: 'Please input the subject of the leave!',
              },
            ]}
          >
            <Select onChange={handleReasonChange}>
              <Option value='Sick'>Sick Leave</Option>
              <Option value='Vacation'>Vacation</Option>
              <Option value='Wedding'>Wedding</Option>
              <Option value='Personal'>Personal Reasons</Option>
              <Option value='other'>Others</Option>
            </Select>
          </Form.Item>

          {isOtherReason && (
            <Form.Item
              name='otherReason'
              label='Please specify'
              rules={[
                {
                  required: true,
                  message: 'Please specify the reason for the leave!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
          <Form.Item
            name='description'
            label='Reason'
            rules={[
              { required: true, message: 'Please input the reason for leave!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='pdfUpload'
            label='Upload Supporting Document (PDF)'
            valuePropName='fileList'
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[
              {
                required: true,
                message: 'Please upload a supporting document!',
              },
            ]}
          >
            <Upload accept='.pdf' beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            {/* <Button type="primary" htmlType="submit">
    Submit
  </Button> */}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title='Regularize Attendance'
        visible={isRegularizeModalVisible}
        onOk={handleRegularizeOk}
        onCancel={handleRegularizeCancel}
      >
        <Form
          form={regularizeForm}
          layout='vertical'
          name='regularize_attendance_form'
        >
          <Form.Item
            name='attendanceDate'
            label='Date'
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name='checkin'
            label='Check-In Time'
            rules={[
              { required: true, message: 'Please select the check-in time!' },
            ]}
          >
            <TimePicker format='HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name='checkout'
            label='Check-Out Time'
            rules={[
              { required: true, message: 'Please select the check-out time!' },
            ]}
          >
            <TimePicker format='HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name='reason'
            label='Reason'
            rules={[
              {
                required: true,
                message: 'Please input the reason for regularization!',
              },
            ]}
          >
            <Select onChange={handleReasonChange}>
              <Option value='Regularization'>Regularization</Option>
              <Option value='WFH'>Work from Home</Option>
              <Option value='Forgot_ID_Card'>Forgot ID Card</Option>
              <Option value='Personal'>Personal Reasons</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Attendance
