import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UserRoutes() {
  const { currentUser } = useSelector(state => state.user)
  return currentUser && currentUser.roles.includes('USER') && !currentUser.roles.includes('ADMIN')? (
    <Outlet />
  ) : (
    <Navigate to='/signin' />
  )
}
