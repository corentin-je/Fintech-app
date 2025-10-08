import { useState } from 'react'
import {
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  CircularProgress,
  Card,
  CardContent
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

const API_URL = import.meta.env.VITE_API_URL

export default function MyFormPage() {
  const [value, setValue] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_URL}/home/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: value })
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header sans encadrement */}
      <Box 
        sx={{ 
          py: 3,
          px: 4,
          mb: 3,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 144
        }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 2 }}>
          Contact
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Contactez-nous pour toute question ou demande.
        </Typography>
      </Box>

      {/* Contenu du formulaire */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            label="Votre texte"
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ minWidth: 120, height: 56 }}
          >
            {loading ? 'Envoi...' : 'Envoyer'}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Card sx={{ mt: 3, borderRadius: 2 }} elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Résultat
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Reçu:</strong> {result.received}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <strong>Traité:</strong> {result.processed}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Box>
  )
}
