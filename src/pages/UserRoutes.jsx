import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function UserRoutes() {
  const { currentUser } = useSelector(state => state.user)
  return currentUser && currentUser.roles[0]==='ROLE_USER' ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' />
  )
}
