import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
 
export default function AdminRoutes() {
  const { currentUser } = useSelector(state => state.user);

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (currentUser.roles.includes('ADMIN') ) {
    return <Outlet />;
  }

  if (currentUser.roles.includes('USER') && !currentUser.roles.includes('ADMIN')) {
    return <Navigate to="/user" />;
  }


  return <Navigate to="/signin" />;
}