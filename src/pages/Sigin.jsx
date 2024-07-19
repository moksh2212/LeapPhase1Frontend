import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  TextInput,
  Button,
  Checkbox,
  Label,
  Spinner,
  Alert,
} from 'flowbite-react'
import {jwtDecode} from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice'

function Signin() {
  const navigate = useNavigate()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const signBaseUrl = process.env.BASE_URL2
  const dispatch = useDispatch()


  const decodeToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Invalid token", error);
      return null;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault()

    const formData = {
      email: email,
      password: password,
    }
    if (!formData.email || !formData.password) {
      setErrorMessage('All fields are required.')
      return
    }
    
    setIsLoading(true)
    try {
      dispatch(signInStart())
      const response = await fetch(`${signBaseUrl}/security/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        // credentials: 'include'
      })

      if (response.ok) {
        const token = await response.text();
        const data = decodeToken(token);
        const user = data.user;
        dispatch(signInSuccess({ user: user, token: token }))
        if (
          user.roles &&
          user.roles.includes('USER') &&
          !user.roles.includes('ADMIN') &&
          !user.roles.includes('SUPERADMIN')
        ) {
          navigate('/user')
        } else {
          navigate('/')
        }
      } else if (response.status === 401 || response.status===400) {
        setErrorMessage('Email or Password not correct or your account is pending from admin approval')
      } else {
        dispatch(signInFailure())
      }
    } catch (error) {
      setErrorMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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
            Sign in to your account
          </h4>
        </div>
        <form className='mt-8 mb-10' onSubmit={handleSubmit}>
          <div className='rounded-md'>
            <div>
              <Label value='Email address' />
              <TextInput
                type='email'
                placeholder='Email address'
                id='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
                className='appearance-none rounded-none relative block w-full placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-3'
              />
            </div>
            <div>
              <Label value='Password' />
              <TextInput
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder='Password'
                id='password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className='appearance-none rounded-none relative block w-full placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
              />
            </div>
          </div>

          <div className='flex items-center mt-1'>
            <Checkbox
              onChange={() => setIsPasswordVisible(!isPasswordVisible)}
              checked={isPasswordVisible}
              className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
            />
            <Label
              value='Show password'
              className='ml-2 text-sm text-gray-600'
            />
          </div>

          <div>
            <Button
              gradientDuoTone={['#657DE9', '#C23BD7']}
              type='submit'
              disabled={isLoading}
              className='w-full flex justify-center px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-2'
            >
              {isLoading ? <Spinner /> : 'Signin'}
            </Button>
          </div>

          <p className='text-end text-sm mt-1 space-y-[-8]'>
              <Link
                to='/forgotpassword'
                className='text-indigo-600 hover:text-indigo-500'
              >
                Forgot Password?{' '}
              </Link>
            </p>
        </form>

        {errorMessage && (
          <Alert
            className='mt-1'
            color={'failure'}
            onDismiss={() => setErrorMessage(null)}
          >
            {errorMessage}
          </Alert>
        )}

        <p className='text-sm text-gray-600 text-center'>
          Don&apos;t have an account?{' '}
          <Link
            to='/signup'
            className='font-medium text-indigo-600 hover:text-indigo-500'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signin
