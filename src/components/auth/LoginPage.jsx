/**
 * LoginPage.js
 * Admin login screen using Material UI components.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StarsIcon from '@mui/icons-material/Stars';
import { useAuth } from '../../context/AuthContext';
import { APP_TITLE, ROUTES } from '../../constants/appConstants';
import logger from '../../utils/logger';

const LoginPage = () => {
  const { login, loginLoading, loginError } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors]   = useState({});

  /** Validate form fields before submit */
  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required';
    if (!password.trim()) errors.password = 'Password is required';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    logger.info('Login form submitted for:', username);
    const success = await login(username.trim(), password);
    if (success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#e3f2fd',
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 400,
          p: 2,
          boxShadow: 3,
        }}
      >
        <CardContent>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <StarsIcon sx={{ fontSize: 48, color: '#1565c0', mb: 1 }} />
            <Typography variant="h5" fontWeight={700} color="primary">
              {APP_TITLE}
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Admin Portal — Sign in to continue
            </Typography>
          </Box>

          {/* API Error */}
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }} id="login-error-alert">
              {loginError}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              id="input-username"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              error={!!fieldErrors.username}
              helperText={fieldErrors.username}
              autoComplete="username"
              autoFocus
            />

            <TextField
              id="input-password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              margin="normal"
              size="small"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      id="btn-toggle-password"
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              id="btn-login"
              type="submit"
              variant="contained"
              fullWidth
              disabled={loginLoading}
              sx={{ mt: 2, py: 1, fontWeight: 600 }}
            >
              {loginLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Sign In'
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
