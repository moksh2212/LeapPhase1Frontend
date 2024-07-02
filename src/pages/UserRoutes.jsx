import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UserRoutes() {
  const { currentUser } = useSelector(state => state.user)
  return currentUser && currentUser.roles.includes('ROLE_USER') && !currentUser.roles.includes('ROLE_ADMIN')? (
    <Outlet />
  ) : (
    <Navigate to='/signin' />
  )
}
