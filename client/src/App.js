import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
          <Routes>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/passwordChange" element={<ChangePassword />}/>
            <Route path="/" element={<Main />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
