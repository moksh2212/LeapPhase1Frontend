import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Header from './component/Header'
import EmpAssignment from './component/EmpAssignment'
import Signin from './pages/Sigin'
import Signup from './pages/Signup'
import Home from './pages/Home'
import AdminRoutes from './pages/AdminRoutes'
import { useSelector } from 'react-redux'

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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
