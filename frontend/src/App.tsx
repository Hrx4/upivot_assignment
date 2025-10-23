import { Route, Routes } from 'react-router-dom'
import './App.css'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Upload from './pages/Upload'
import Chat from './pages/Chat'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute';

function App() {

  return (
    <Routes>
      <Route path="/" element={<h1>Hello World</h1>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/login" element={<Login/>} />
            <Route element={
              <ProtectedRoute>
              <Navbar />
              </ProtectedRoute>
              }>

      <Route path="/upload" element={<Upload/>} />
      <Route path="/chat" element={<Chat/>} />
            </Route>


    </Routes>
  )
}

export default App
