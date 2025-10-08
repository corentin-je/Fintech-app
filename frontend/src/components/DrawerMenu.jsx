import { Link } from 'react-router-dom'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Typography,
  Button
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import DescriptionIcon from '@mui/icons-material/Description'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

const DRAWER_WIDTH = 260

export default function DrawerMenu({ userName = 'Utilisateur', onLogout }) {
  const menuItems = [
    { text: 'Accueil', path: '/', icon: <HomeIcon /> },
    { text: 'Portfolio', path: '/portfolio', icon: <AccountBalanceWalletIcon /> },
    { text: 'Opportunités', path: '/opportunites', icon: <AddIcon /> },
    { text: 'Contact', path: '/form', icon: <DescriptionIcon /> }
  ]

  // Fonction pour obtenir les initiales
  const getInitials = (name) => {
    const names = name.trim().split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          borderRight: 'none',
          bgcolor: '#fafafa'
        }
      }}
    >
      {/* Section utilisateur au début du drawer */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 3,
          px: 2
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'primary.main',
            fontSize: '2rem',
            fontWeight: 600,
            mb: 2
          }}
        >
          {getInitials(userName)}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: 600, textAlign: 'center' }}>
          {userName}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
          Connecté
        </Typography>
      </Box>

      <List sx={{ pt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton 
              component={Link} 
              to={item.path}
              sx={{
                py: 1.5,
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 500
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bouton Logout fixé en bas */}
      {onLogout && (
        <Box
          sx={{
            p: 2,
            mt: 'auto'
          }}
        >
          <Button
            fullWidth
            variant="text"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              py: 1.5,
              justifyContent: 'flex-start',
              textTransform: 'none'
            }}
          >
            Déconnexion
          </Button>
        </Box>
      )}
    </Drawer>
  )
}
