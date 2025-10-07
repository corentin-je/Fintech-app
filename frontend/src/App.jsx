import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material'
import DrawerMenu from './components/DrawerMenu.jsx'
import Home from './pages/Home.jsx'
import MyFormPage from './pages/MyFormPage.jsx'
import Login from './pages/Login.jsx'
import Opportunites from './pages/Opportunites.jsx'
import { useEffect, useState } from 'react'

const DRAWER_WIDTH = 260

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
})

export default function App() {
  const [token, setToken] = useState(null)
  const [userName, setUserName] = useState('Utilisateur')

  useEffect(() => {
    const t = localStorage.getItem('token')
    const storedUserName = localStorage.getItem('userName')
    if (t) setToken(t)
    if (storedUserName) setUserName(storedUserName)
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    setToken(null)
    setUserName('Utilisateur')
  }

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login onLoggedIn={(token, name) => {
          setToken(token)
          if (name) setUserName(name)
        }} />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          <DrawerMenu userName={userName} onLogout={logout} />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/form" element={<MyFormPage />} />
              <Route path="/opportunites" element={<Opportunites />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}
