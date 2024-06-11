import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function AdminRoutes() {
  const { currentUser } = useSelector(state => state.user)
  return currentUser && currentUser.adminCheck ? (
    <Outlet />
  ) : (
    <Navigate to='/signin' />
  )
}
