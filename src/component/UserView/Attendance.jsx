import React, { useState } from 'react';
import { Tabs, Card, Button, Modal, Form, Input, DatePicker, TimePicker, message } from 'antd';
import axios from 'axios';
import WeeklyCalendar from './WeeklyCalendarUser';
import MonthlyCalendar from './MonthlyCalendarUser';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { TabPane } = Tabs;

const Attendance = () => {
  const [isLeaveModalVisible, setIsLeaveModalVisible] = useState(false);
  const [isRegularizeModalVisible, setIsRegularizeModalVisible] = useState(false);
  const [leaveForm] = Form.useForm();
  const [regularizeForm] = Form.useForm();
  const { currentUser } = useSelector(state => state.user);

  const showLeaveModal = () => {
    setIsLeaveModalVisible(true);
  };

  const showRegularizeModal = () => {
    setIsRegularizeModalVisible(true);
  };

  const handleLeaveCancel = () => {
    setIsLeaveModalVisible(false);
  };

  const handleRegularizeCancel = () => {
    setIsRegularizeModalVisible(false);
  };

  const handleLeaveOk = () => {
    leaveForm.validateFields()
      .then(values => {
        leaveForm.resetFields();
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];
        const formattedStartDate = values.startDate.format('YYYY-MM-DD');
        const formattedEndDate = values.endDate.format('YYYY-MM-DD');
        const dataToSend = {
          ...values,
          date: todayDate,
          talentId: currentUser.talentId,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        };

        axios.post('http://192.168.0.141:8080/cpm/leaves/addLeave', dataToSend)
          .then(response => {
            message.success('Leave request submitted successfully');
            setIsLeaveModalVisible(false);
          })
          .catch(error => {
            console.error('There was an error submitting the leave request:', error);
            message.error('Failed to submit leave request');
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const handleRegularizeOk = () => {
    regularizeForm.validateFields()
      .then(values => {
        regularizeForm.resetFields();
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        const formattedAttendanceDate = values.attendanceDate.format('YYYY-MM-DD');
        const formattedCheckin = values.checkin.format('HH:mm:ss');
        const formattedCheckout = values.checkout.format('HH:mm:ss');

        const dataToSend = {
          ...values,
          talentId: currentUser.talentId,
          regularizeDate: todayDate,
          attendanceDate: formattedAttendanceDate,
          checkin: formattedCheckin,
          checkout: formattedCheckout,
        };

        axios.post('http://192.168.0.141:8080/cpm/regularize/addRegularize', dataToSend)
          .then(response => {
            message.success('Attendance regularization submitted successfully');
            setIsRegularizeModalVisible(false);
          })
          .catch(error => {
            console.error('There was an error submitting the regularization:', error);
            message.error('Failed to submit regularization');
          });
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div className='mt-4'>
      <Card
        title={<span style={{ fontWeight: 'bold', fontSize: '30px', color: '#a1b4b5' }}>Attendance</span>}
        bordered={false}
        style={{ width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        extra={
          <>
            <Button type="primary" style={{ backgroundColor: 'green', borderColor: 'green', marginRight: '10px' }} onClick={showLeaveModal}>Apply for Leave</Button>
            <Button type="primary" style={{ backgroundColor: '#f07575', borderColor: 'black' }} onClick={showRegularizeModal}>Regularize Attendance</Button>
          </>
        }
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Weekly" key="1"><WeeklyCalendar /></TabPane>
          <TabPane tab="Monthly" key="2"><MonthlyCalendar /></TabPane>
        </Tabs>
      </Card>
      
      <Modal
        title="Leave Request"
        visible={isLeaveModalVisible}
        onOk={handleLeaveOk}
        onCancel={handleLeaveCancel}
      >
        <Form
          form={leaveForm}
          layout="vertical"
          name="leave_request_form"
        >
          <Form.Item
            name="startDate"
            label="Start Date"
            rules={[{ required: true, message: 'Please select the start date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="endDate"
            label="End Date"
            rules={[{ required: true, message: 'Please select the end date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please input the subject of the leave!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Reason"
            rules={[{ required: true, message: 'Please input the reason for leave!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      
      <Modal
        title="Regularize Attendance"
        visible={isRegularizeModalVisible}
        onOk={handleRegularizeOk}
        onCancel={handleRegularizeCancel}
      >
        <Form
          form={regularizeForm}
          layout="vertical"
          name="regularize_attendance_form"
        >
          <Form.Item
            name="attendanceDate"
            label="Date"
            rules={[{ required: true, message: 'Please select the date!' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="checkin"
            label="Check-In Time"
            rules={[{ required: true, message: 'Please select the check-in time!' }]}
          >
            <TimePicker format='HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="checkout"
            label="Check-Out Time"
            rules={[{ required: true, message: 'Please select the check-out time!' }]}
          >
            <TimePicker format='HH:mm:ss' style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Reason"
            rules={[{ required: true, message: 'Please input the reason for regularization!' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Attendance;
