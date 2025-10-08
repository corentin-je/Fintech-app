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
  Alert,
  Drawer,
  IconButton,
  Divider,
  Grid,
  Card,
  CardContent,
  Link
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import WarningIcon from '@mui/icons-material/Warning'

export default function Opportunites() {
  const [opportunites, setOpportunites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedOpportunite, setSelectedOpportunite] = useState(null)

  useEffect(() => {
    fetchOpportunites()
  }, [])

  const fetchOpportunites = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:8000/opportunites/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des opportunités')
      }

      const data = await response.json()
      setOpportunites(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyse = (opportunite) => {
    setSelectedOpportunite(opportunite)
    setDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerOpen(false)
    setSelectedOpportunite(null)
  }

  const parseJSON = (jsonString) => {
    try {
      return JSON.parse(jsonString)
    } catch (e) {
      return null
    }
  }

  const renderSection = (title, data, icon, color) => {
    if (!data) return null

    const renderMetrics = (metrics, parentKey = '') => {
      const elements = []
      
      Object.entries(metrics).forEach(([key, value]) => {
        const fullKey = parentKey ? `${parentKey}_${key}` : key
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Si c'est un objet imbriqué, afficher un titre de catégorie
          elements.push(
            <Grid item xs={12} key={fullKey}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2, mb: 1, color: 'text.secondary' }}>
                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Typography>
            </Grid>
          )
          // Puis afficher les sous-éléments
          Object.entries(value).forEach(([subKey, subValue]) => {
            elements.push(
              <Grid item xs={12} sm={6} md={4} key={`${fullKey}_${subKey}`}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {subValue !== null && subValue !== undefined 
                        ? (typeof subValue === 'number' ? subValue.toFixed(2) : String(subValue))
                        : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })
        } else {
          // Valeur simple
          elements.push(
            <Grid item xs={12} sm={6} md={4} key={fullKey}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {value !== null && value !== undefined 
                      ? (typeof value === 'number' ? value.toFixed(2) : String(value))
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )
        }
      })
      
      return elements
    }

    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          {icon}
          <Typography variant="h5" sx={{ ml: 1, fontWeight: 'bold', color }}>
            {title}
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {renderMetrics(data)}
        </Grid>
      </Box>
    )
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

  // Détecter automatiquement les colonnes du parquet
  const allColumns = opportunites.length > 0 ? Object.keys(opportunites[0]) : []
  
  // Exclure certaines colonnes
  const excludedColumns = ['resultat_charlie', 'resultat_warren', 'resultat_risk']
  const columns = allColumns.filter(col => !excludedColumns.includes(col))
  
  // Essayer de trouver la colonne "marché" (différentes variantes possibles)
  const marcheKey = columns.find(col => 
    col.toLowerCase().includes('marche') || 
    col.toLowerCase().includes('marché') || 
    col.toLowerCase().includes('market')
  )

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
          Opportunités
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Liste des opportunités disponibles
        </Typography>
      </Box>

      {/* Tableau des opportunités */}
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
              <TableCell sx={{ color: 'text.primary', fontWeight: 'bold', border: 'none' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {opportunites.map((opp, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  bgcolor: 'white',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                }}
              >
                {columns.map((col) => (
                  <TableCell key={col} sx={{ border: 'none' }}>
                    {opp[col] !== null && opp[col] !== undefined ? String(opp[col]) : '-'}
                  </TableCell>
                ))}
                <TableCell sx={{ border: 'none' }}>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => handleAnalyse(opp)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 500,
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Analyse
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {opportunites.length === 0 && (
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Aucune opportunité disponible pour le moment.
          </Typography>
        </Paper>
      )}

      {/* Drawer d'analyse */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: '80%', md: '60%' },
            p: 3
          }
        }}
      >
        {selectedOpportunite && (
          <Box>
            {/* En-tête du drawer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {selectedOpportunite.nom_entreprise || 'N/A'}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {selectedOpportunite.symbol || 'N/A'}
                </Typography>
              </Box>
              <IconButton onClick={handleCloseDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Section Charlie - Analyse de croissance */}
            {selectedOpportunite.resultat_charlie && renderSection(
              'Analyse Charlie - Croissance',
              parseJSON(selectedOpportunite.resultat_charlie),
              <TrendingUpIcon sx={{ fontSize: 30, color: 'success.main' }} />,
              'success.main'
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Section Warren - Analyse de valeur */}
            {selectedOpportunite.resultat_warren && renderSection(
              'Analyse Warren - Valeur',
              parseJSON(selectedOpportunite.resultat_warren),
              <MonetizationOnIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
              'primary.main'
            )}

            <Divider sx={{ mb: 4 }} />

            {/* Section Risk - Analyse de risque */}
            {selectedOpportunite.resultat_risk && renderSection(
              'Analyse de Risque',
              parseJSON(selectedOpportunite.resultat_risk),
              <WarningIcon sx={{ fontSize: 30, color: 'error.main' }} />,
              'error.main'
            )}
          </Box>
        )}
      </Drawer>
    </Box>
  )
}

