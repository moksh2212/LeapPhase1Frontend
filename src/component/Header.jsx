import { Avatar, Dropdown, Navbar } from 'flowbite-react'
import { TbLogout } from 'react-icons/tb'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice'
import { useState } from 'react'
export default function Header() {
  const path = useLocation().pathname
  const { currentUser } = useSelector(state => state.user)
  console.log(currentUser)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [imageSrc, setImageSrc] = useState('')

  // const imageBlob = new Blob([currentUser.profileImage], { type: 'image/jpeg' }) // Adjust type as necessary
  // const imageUrl = URL.createObjectURL(imageBlob)
  // setImageSrc(imageUrl)


  const handleSignout = async () => {
    dispatch(signoutSuccess('Signed out successfully'))
    navigate('/signin')
  }
  return (
    <>
      <Navbar
        fluid
        rounded
        className='shadow-md sticky top-0 left-0 right-0 z-50'
      >
        <Navbar.Brand as={'div'}>
          <Link to={'/'}>
            <img
              src='https://incture.com/wp-content/uploads/2022/02/Incture-Logo-Blue-150x34-px.svg'
              className='mr-3 h-6 sm:h-8 p-1'
              alt='Incture Logo'
            />
          </Link>
          <span className='self-center whitespace-nowrap text-xl text-gray-700 font-semibold hidden lg:block'>
            {' '}
            | Campus Program Management
          </span>
        </Navbar.Brand>
        <div className='flex md:order-2'>
          {currentUser && (
            <span className='text-md my-auto mr-2'>
              {'Hi, ' + currentUser.talentName}
            </span>
          )}
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='User settings'
                img='https://img.freepik.com/free-vector/user-circles-set_78370-4704.jpg?t=st=1714456930~exp=1714460530~hmac=7615ea45a09625b4c166c6233ece24749c78362f76d29e1429e3b5d3b035156f&w=740'
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>
                {currentUser && currentUser.inctureId}
              </span>
              <span className='block truncate text-sm font-medium'>
                {currentUser && currentUser.email}
              </span>
            </Dropdown.Header>
            <Dropdown.Item
              icon={TbLogout}
              className='text-red-500 font-medium cursor-pointer z-50'
              onClick={handleSignout}
            >
              Sign out
            </Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
      </Navbar>
    </>
  )
}
