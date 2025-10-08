import { Typography, Paper, Box, CircularProgress, Alert, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

export default function Analyse() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  // Composants personnalisés pour ReactMarkdown sans gras
  const componentsWithoutBold = {
    strong: ({ children }) => <span>{children}</span>
  }

  useEffect(() => {
    const fetchAnalyse = async () => {
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:8000/analyse/', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`)
        }
        
        const result = await response.json()
        setData(result)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchAnalyse()
  }, [])

  // Fonction pour séparer le contenu en sections
  const parseContent = (content) => {
    if (!content) return { classement: '', analyse: '', recommandation: '' }
    
    const sections = content.split('### ')
    let classement = ''
    let analyse = ''
    let recommandation = ''
    
    sections.forEach(section => {
      if (section.startsWith('Classement des meilleures opportunités')) {
        classement = '### ' + section
      } else if (section.startsWith('Analyse des investissements')) {
        analyse = '### ' + section
      } else if (section.startsWith('Recommandation finale')) {
        recommandation = '### ' + section
      }
    })
    
    return { classement, analyse, recommandation }
  }

  const markdownStyles = {
    '& h1': { fontSize: '1.5rem', fontWeight: 600, mt: 2, mb: 1.5 },
    '& h2': { fontSize: '1.25rem', fontWeight: 600, mt: 2, mb: 1.5 },
    '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 1.5, mb: 1 },
    '& p': { mb: 1.5, lineHeight: 1.6, fontSize: '0.875rem' },
    '& ul, & ol': { mb: 1.5, pl: 2.5 },
    '& li': { mb: 0.3, fontSize: '0.875rem', lineHeight: 1.5 },
    '& code': { 
      bgcolor: '#f5f5f5', 
      px: 0.5, 
      py: 0.25, 
      borderRadius: 0.5,
      fontSize: '0.8125rem'
    },
    '& pre': { 
      bgcolor: '#f5f5f5', 
      p: 2, 
      borderRadius: 1, 
      overflow: 'auto',
      mb: 1.5
    },
    '& blockquote': {
      borderLeft: '4px solid #1976d2',
      pl: 2,
      ml: 0,
      fontStyle: 'italic',
      color: 'text.secondary',
      fontSize: '0.875rem'
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
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
          Analyse
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Dernière analyse générée
        </Typography>
      </Box>

      {/* Contenu de la page */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Erreur lors du chargement de l'analyse : {error}
        </Alert>
      )}

      {data && !loading && (() => {
        const { classement, analyse, recommandation } = parseContent(data.content)
        
        return (
          <Grid container spacing={3}>
            {/* Colonne de gauche : Classement + Recommandation */}
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                <Box sx={markdownStyles}>
                  <ReactMarkdown components={componentsWithoutBold}>{classement}</ReactMarkdown>
                </Box>
                
                <Box sx={{ ...markdownStyles, mt: 3 }}>
                  <ReactMarkdown>{recommandation}</ReactMarkdown>
                </Box>
              </Paper>
            </Grid>

            {/* Colonne de droite : Analyse des investissements */}
            <Grid item xs={12} md={7}>
              <Paper elevation={2} sx={{ p: 2.5, borderRadius: 2, height: '100%' }}>
                <Box sx={markdownStyles}>
                  <ReactMarkdown components={componentsWithoutBold}>{analyse}</ReactMarkdown>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )
      })()}
    </Box>
  )
}

