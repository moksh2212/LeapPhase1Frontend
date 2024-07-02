import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Header from './component/Header'
import Signin from './pages/Sigin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AdminRoutes from './pages/AdminRoutes'

import { useSelector } from 'react-redux'
import DashboardUser from './component/UserView/DashboardUser'
import Attendance from './component/UserView/Attendance'
import Skills from './component/UserView/Skills'
import PerformanceUser from './component/UserView/PerformanceUser'
import AssignmentUser from './component/UserView/AssignmentUser'
import UserRoutes from './pages/UserRoutes'


function App() {
  const {currentUser } = useSelector(state=>state.user)
  return (
    <BrowserRouter>
      <div className='min-h-screen'>
        {currentUser && <Header />}

        <Routes>
          <Route path={'/signin'} element={<Signin />} />
          <Route path={'/signup'} element={<Signup />} />

          <Route element={<AdminRoutes />}>
            <Route path={'/'} element={<Home />} />
            <Route path={'/dashboard'} element={<Dashboard />} />          
          </Route>

          <Route element = {<UserRoutes/>}>
        
            <Route path={'/user'} element={<DashboardUser />} />
            <Route path={'/attendance'} element={<Attendance />} />
            <Route path={'/performance'} element={<PerformanceUser />} />
            <Route path={'/skills'} element={<Skills />} />
            <Route path={'/assignments'} element={<AssignmentUser />} />
          </Route>
        </Routes>
        
      </div>
    </BrowserRouter>
  )
}

export default App
