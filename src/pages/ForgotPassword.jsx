import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TextInput, Button, Label, Spinner } from 'flowbite-react'
import { Alert, Snackbar } from '@mui/material'
import OtpInput from '../component/OTPInput'



function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordMatchError, setPasswordMatchError] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(null)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const baseUrl = process.env.BASE_URL2

  const handleOtpComplete = (completedOtp) => {
    setOtp(completedOtp)
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setOpenSnackbar(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      setPasswordMatchError(true)
      return
    }
    setPasswordMatchError(false)

    if (!otpSent || !otp) {
      setErrorMessage('Please verify your email with OTP first')
      return
    }

    setIsLoading(true)

    try {
      const formdata = new FormData()
      formdata.append('email', email)
      formdata.append('password', newPassword)
      formdata.append('otp', otp)
      const response = await fetch(`${baseUrl}/security/forgotPassword`, {
        method: 'POST',
        body: formdata,
        credentials: 'include',
      })

      if (response.ok) {
        setOpenSnackbar('Password reset successfully. Redirecting to signin')
        setTimeout(() => {
          navigate('/signin')
        }, 3000)
      } else {
        setErrorMessage(await response.text() || 'Could not reset password. Please try again.')
      }
    } catch (error) {
      console.error('Error', error)
      setErrorMessage('Could not reset password. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter an email address')
      return
    }
    setIsLoading(true)
    try {
      const formdata = new FormData()
      formdata.append('email', email)
      const response = await fetch(`${baseUrl}/security/generateOtp`, {
        method: 'POST',
        body: formdata,
      })

      if (response.ok) {
        setOtpSent(true)
        setOpenSnackbar('OTP sent successfully. Please check your email.')
      } else {
        setErrorMessage('Failed to send OTP. Please try again.')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setErrorMessage('Could not send OTP. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = email && password && newPassword && confirmNewPassword 

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <img
            className='mx-auto h-12 w-auto'
            src='https://incture.com/wp-content/uploads/2022/02/Incture-Logo-Blue-150x34-px.svg'
            alt='Incture Logo'
          />
          <h4 className='mt-4 text-center text-xl text-gray-900'>
            Reset your password
          </h4>
        </div>
        <form className='mt-4' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <div>
              <Label value='Email Address' />
              <TextInput
                type='email'
                placeholder='Email Address'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                required
                autoFocus
              />
            </div>
           
            <div>
              <Label value='New Password' />
              <TextInput
                type='password'
                placeholder='New Password'
                id='newPassword'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={otpSent}
                required
              />
            </div>
            <div>
              <Label value='Confirm New Password' />
              <TextInput
                type='password'
                placeholder='Confirm New Password'
                id='confirmNewPassword'
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={otpSent}
                required
              />
            </div>
            {passwordMatchError && (
              <p className='text-red-500 text-sm'>New passwords do not match.</p>
            )}
          </div>

          <div>
            <Button
              type='button'
              disabled={!email || isLoading || otpSent}
              onClick={handleSendOtp}
              className='w-full flex justify-center rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-3'
            >
              {isLoading ? <Spinner /> : 'Send OTP'}
            </Button>
          </div>

          {otpSent && (
            <>
              <div className='mt-4'>
                <Label value='Enter OTP' />
                <OtpInput onComplete={handleOtpComplete} />
              </div>
              <div>
                <Button
                  type='submit'
                  disabled={isLoading || !otpSent || otp.length !== 6}
                  className='w-full flex justify-center rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-gradient-to-r focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-3'
                >
                  {isLoading ? <Spinner /> : 'Reset Password'}
                </Button>
              </div>
            </>
          )}
        </form>

        {errorMessage && (
          <p className='mt-2 text-sm text-red-600 text-center'>
            {errorMessage}
          </p>
        )}

        <p className='mt-2 text-sm text-gray-600 text-center'>
          Remember your password?{' '}
          <Link
            to='/signin'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            Sign in
          </Link>
        </p>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert
            onClose={handleClose}
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}
          >
            {openSnackbar}
          </Alert>
        </Snackbar>
      </div>
    </div>
  )
}

export default ForgotPassword