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
          Accueil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue sur l'application Fullstack Starter avec Material UI.
        </Typography>
      </Box>

      {/* Contenu de la page */}
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Contenu de la page
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Le contenu principal de votre page d'accueil s'affiche ici.
        </Typography>
      </Paper>
    </Box>
  )
}
