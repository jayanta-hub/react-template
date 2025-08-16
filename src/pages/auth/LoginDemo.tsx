import React from 'react';
import { Box, Container, Typography, Paper, Button } from '@mui/material';
import { LoginForm } from '../../components/auth/LoginForm';
import { SSOLogin } from '../../components/auth/SSOLogin';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utility/constant';

export const LoginDemo: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    console.log('Login successful!');
    // In a real app, you would redirect to dashboard
    // navigate(ROUTES.DASHBOARD);
  };

  const handleError = (error: string) => {
    console.error('Login error:', error);
  };

  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Login Components Demo
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 4 }}>
          This page demonstrates the new login components with SSO functionality
        </Typography>

        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {/* Traditional Login Form */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Traditional Login Form
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Email and password authentication with validation
            </Typography>
            <LoginForm
              onSuccess={handleLoginSuccess}
              onForgotPassword={handleForgotPassword}
            />
          </Paper>

          {/* SSO Login */}
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              SSO Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Single Sign-On with multiple providers
            </Typography>
            <SSOLogin
              onSuccess={handleLoginSuccess}
              onError={handleError}
            />
          </Paper>
        </Box>

        {/* Demo Instructions */}
        <Paper elevation={2} sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Demo Instructions
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Traditional Login:</strong> Enter any valid email format (e.g., user@example.com) and any password with 8+ characters.
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>SSO Login:</strong> Click any provider button to simulate SSO authentication. This is a demo - no actual authentication occurs.
          </Typography>
          <Typography variant="body2">
            <strong>Note:</strong> All authentication is simulated for demonstration purposes. In a real application, these components would integrate with actual authentication services.
          </Typography>
        </Paper>

        {/* Navigation */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Home
          </Button>
          <Button
            variant="contained"
            onClick={() => navigate(ROUTES.DASHBOARD)}
          >
            Go to Dashboard
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
