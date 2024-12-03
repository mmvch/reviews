import AuthService from '../../services/AuthService';
import Credentials from '../../models/utils/Credentials';
import Grid from '@mui/material/Grid2';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { blue } from '@mui/material/colors';
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import { LoginService } from '../../services/LoginService';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    try {
      const credentials: Credentials = {
        username: username,
        password: password
      };

      const authToken = await AuthService.login(credentials);
      LoginService.login(authToken);
      toast.success('Successful authorization');
    } catch (error: any) {
      setValidationError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5" mb={1}>
          Sign In
        </Typography>

        {validationError && (
          <Typography color='error' sx={{ mb: 1, textAlign: 'center' }}>
            • {validationError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            slotProps={{
              input: {
                sx: { backgroundColor: blue[50] }
              }
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                sx: { backgroundColor: blue[50] },
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )
              }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>

          <Grid container justifyContent="flex-end">
            <Button variant="text" onClick={() => navigate("/register")}>
              Don't have an account? Sign Up
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
