import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuthContext } from './hooks/useAuthContext'
import { useEffect, useState } from 'react';
import { TransparentNavbar } from './TransparentNavbar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import About from './pages/About';
import AddProgram from './pages/AdminPages/AddProgram';
import Error404 from './pages/Error404';
import Programs from './pages/Programs';

function App() {
  const { user } = useAuthContext()
  const [isAdmin, setAdmin] = useState(false)

  useEffect(() =>{
    if (user){
      const decodedToken=jwtDecode(user.token)
      setAdmin(decodedToken.isAdmin)
      console.log(isAdmin);
    }
  },[user])

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <TransparentNavbar />
          <Routes>
            <Route path="/" element={<Main />}/>
            <Route path="*" element={<Error404 />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/programs" element={<Programs />}/>

            {user ? (
              <>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/passwordChange" element={<ChangePassword />}/>
              </>
            ) : (
              <>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
              </>
            )}
            {isAdmin ? (
              <>
                <Route path="/addprogram" element={<AddProgram />}/>
              </>
            ) : (null)}
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
