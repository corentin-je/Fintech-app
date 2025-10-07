import { AppBar, Toolbar, Typography, Box } from '@mui/material'

export default function Navbar() {
  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
        color: 'text.primary',
        boxShadow: 1
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Fullstack Starter
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
