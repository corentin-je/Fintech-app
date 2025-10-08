import { Typography, Paper, Box } from '@mui/material'

export default function Home() {
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
          Bienvenue
        </Typography>
        <Typography variant="body1" color="text.secondary">
          La gestion patrimoniale simplifiée
        </Typography>
      </Box>

      {/* Contenu de la page */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Fonctionnalités :
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gestion portefeuille, analyse des opportunités d'investissement, simulation, recommandations
        </Typography>
      </Paper>
    </Box>
  )
}
