import { useState } from 'react'
import { Paper, TextField, Button, Stack, Typography } from '@mui/material'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [me, setMe] = useState('')

  const doLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    if (res.ok) {
      const data = await res.json()
      setToken(data.access_token)
    }
  }

  const getMe = async () => {
    const res = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setMe(data.username)
    }
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h5">Connexion</Typography>
        <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button variant="contained" onClick={doLogin}>Login</Button>
        {token && (
          <>
            <Typography>Token: {token}</Typography>
            <Button onClick={getMe}>Who am I?</Button>
            {me && <Typography>Me: {me}</Typography>}
          </>
        )}
      </Stack>
    </Paper>
  )
}
