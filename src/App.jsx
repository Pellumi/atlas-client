import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ThemeProvider"
import Dashboard from "./components/Dashboard"
import Chat from "./components/Chat"
import Home from "./components/Home"
import "./App.css"
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Register from './components/Register'


function App() {
  return (
    <ThemeProvider defaultTheme="light">
     <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/chat" element={
                    <ProtectedRoute>
                    <Chat /></ProtectedRoute>} />
                    <Route
            path="/chat/:conversationId"
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/Login" element={<Login />} />
            <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
