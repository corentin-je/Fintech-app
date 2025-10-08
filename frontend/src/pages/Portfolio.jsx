import { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'

export default function Portfolio() {
  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/portfolio/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement du portfolio')
      }

      const data = await response.json()
      setPortfolio(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }

  // Détecter automatiquement toutes les colonnes du parquet
  const columns = portfolio.length > 0 ? Object.keys(portfolio[0]) : []

  // Calculer le montant total investi
  const calculateTotalInvested = () => {
    if (portfolio.length === 0) return 0
    
    // Chercher une colonne qui pourrait contenir le montant investi
    // Exemples: 'montant_investi', 'montant', 'invested_amount', 'amount', 'total', etc.
    const possibleColumns = Object.keys(portfolio[0]).filter(col => 
      col.toLowerCase().includes('montant') || 
      col.toLowerCase().includes('investi') ||
      col.toLowerCase().includes('invested') ||
      col.toLowerCase().includes('amount') ||
      col.toLowerCase().includes('total')
    )
    
    if (possibleColumns.length > 0) {
      const columnToSum = possibleColumns[0]
      return portfolio.reduce((sum, item) => {
        const value = parseFloat(item[columnToSum])
        return sum + (isNaN(value) ? 0 : value)
      }, 0)
    }
    
    return 0
  }

  const totalInvested = calculateTotalInvested()

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
          {totalInvested.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Montant total investi
        </Typography>
      </Box>

      {/* Tableau du portfolio */}
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table sx={{ '& .MuiTableCell-root': { border: 'none' } }}>
          <TableHead>
            <TableRow sx={{ bgcolor: 'white', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
              {columns.map((col) => (
                <TableCell 
                  key={col} 
                  sx={{ 
                    color: 'text.primary', 
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                    border: 'none'
                  }}
                >
                  {col}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolio.map((item, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col} sx={{ border: 'none' }}>
                    {item[col] !== null && item[col] !== undefined ? String(item[col]) : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {portfolio.length === 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucun élément dans le portfolio pour le moment.
          </Typography>
        </Paper>
      )}
    </Box>
  )
}

