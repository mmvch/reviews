import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MovieFilterIcon from '@mui/icons-material/MovieFilter';
import MovieIcon from '@mui/icons-material/Movie';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import toast from 'react-hot-toast';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useUser from '../../contexts/user-context/useUser';
import { AppRoles } from '../../utils/AppRoles';
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@mui/material';
import { LoginService } from '../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const ReviewsAppBar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuth } = useUser();

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const adminMenuItems = user?.role === AppRoles.Admin ? [
    <MenuItem
      key="admin-page"
      onClick={() => {
        handleMenuClose();
        navigate('/admin-page');
      }}
    >
      <ListItemIcon>
        <AdminPanelSettingsIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Admin Page</ListItemText>
    </MenuItem>,
    <Divider key="admin-divider" />] : [];

  const userMenuItems = isAuth ? [
    <MenuItem
      key="recommendations"
      onClick={() => {
        handleMenuClose();
        navigate('/movies/recommendations');
      }}
    >
      <ListItemIcon>
        <MovieFilterIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Recommendations</ListItemText>
    </MenuItem>] : [];

  const authMenuItems = isAuth ? [
    <MenuItem key="sign-out" onClick={() => {
      handleMenuClose();
      LoginService.logout();
      toast.success("Successfully sign out");
    }}>
      <ListItemIcon>
        <LogoutIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Sign Out</ListItemText>
    </MenuItem>
  ] : [
    <MenuItem key="sign-in" onClick={() => {
      handleMenuClose();
      navigate('/login');
    }}>
      <ListItemIcon>
        <LoginIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Sign In</ListItemText>
    </MenuItem>,
    <MenuItem key="sign-up" onClick={() => {
      handleMenuClose();
      navigate('/register');
    }}>
      <ListItemIcon>
        <PersonAddIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText>Sign Up</ListItemText>
    </MenuItem>
  ];

  return (
    <AppBar>
      <Toolbar>
        <IconButton
          color="inherit"
          sx={{ mr: 2 }}
          onClick={handleMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          Reviews
        </Typography>
        {user?.name && (<Box sx={{ marginLeft: 'auto' }}>
          <Typography variant="h6">
            {user.name}
          </Typography>
        </Box>)}

      </Toolbar>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        {adminMenuItems}

        <MenuItem
          key="movies"
          onClick={() => {
            handleMenuClose();
            navigate('/movies');
          }}
        >
          <ListItemIcon>
            <MovieIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Movies</ListItemText>
        </MenuItem>

        {userMenuItems}
        <Divider />

        {authMenuItems}
      </Menu>
    </AppBar>
  );
}

export default ReviewsAppBar;
