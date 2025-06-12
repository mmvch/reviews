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

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isConfirmationError, setIsConfirmationError] = useState(false);

  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    setIsConfirmationError(false);
    setValidationError(null);

    if (password !== confirmPassword) {
      setIsConfirmationError(true);
      return;
    }

    try {
      const credentials: Credentials = {
        username: username,
        password: password
      };

      const authToken = await AuthService.register(credentials);
      LoginService.login(authToken);
      toast.success('Successful registration');
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
          Sign Up
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

          <TextField
            margin="normal"
            required
            fullWidth
            id="confirmPassword"
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            slotProps={{
              input: {
                sx: { backgroundColor: blue[50] },
                endAdornment: (
                  <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                )
              }
            }}
            error={isConfirmationError}
            helperText={isConfirmationError ? 'Password and Confirm Password does not match' : null}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>

          <Grid container justifyContent="flex-end">
            <Button variant="text" onClick={() => navigate("/login")}>
              Already have an account? Sign In
            </Button>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
