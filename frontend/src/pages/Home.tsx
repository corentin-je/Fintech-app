import { useEffect, useState } from 'react'
import { Typography, Paper } from '@mui/material'

export default function Home() {
  const [message, setMessage] = useState<string>('loading...')
  const [health, setHealth] = useState<string>('...')

  useEffect(() => {
    fetch('/api/')
      .then(r => r.json())
      .then(d => setMessage(d.message ?? 'no message'))
      .catch(() => setMessage('error'))

    fetch('/api/health')
      .then(r => r.json())
      .then(d => setHealth(d.status))
      .catch(() => setHealth('error'))
  }, [])

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Fullstack Starter</Typography>
      <Typography>Backend message: {message}</Typography>
      <Typography>Health: {health}</Typography>
    </Paper>
  )
}
