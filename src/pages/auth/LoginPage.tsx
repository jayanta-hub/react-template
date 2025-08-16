import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Alert,
  Fade,
} from '@mui/material';
import { LoginForm } from '../../components/auth/LoginForm';
import { SSOLogin } from '../../components/auth/SSOLogin';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utility/constant';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
  };
}

export const LoginPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleLoginSuccess = () => {
    setSuccess('Login successful! Redirecting...');
    setTimeout(() => {
      navigate(ROUTES.DASHBOARD);
    }, 1500);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    setError('Forgot password functionality not implemented yet.');
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: '100%',
            maxWidth: 600,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              p: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9 }}>
              Sign in to your account to continue
            </Typography>
          </Box>

          {/* Success/Error Messages */}
          <Box sx={{ p: 3, pb: 0 }}>
            {success && (
              <Fade in={true}>
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              </Fade>
            )}
            
            {error && (
              <Fade in={true}>
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </Fade>
            )}
          </Box>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="login tabs"
              variant="fullWidth"
            >
              <Tab
                label="Email & Password"
                {...a11yProps(0)}
                disabled={isLoading}
              />
              <Tab
                label="Single Sign-On (SSO)"
                {...a11yProps(1)}
                disabled={isLoading}
              />
            </Tabs>
          </Box>

          {/* Tab Panels */}
          <TabPanel value={tabValue} index={0}>
            <LoginForm
              onSuccess={handleLoginSuccess}
              onForgotPassword={handleForgotPassword}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Container maxWidth="sm">
              <SSOLogin
                onSuccess={handleLoginSuccess}
                onError={handleError}
                isLoading={isLoading}
              />
            </Container>
          </TabPanel>

          {/* Footer */}
          <Box
            sx={{
              bgcolor: 'grey.50',
              p: 3,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Typography
                component="span"
                variant="body2"
                color="primary.main"
                sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => setError('Sign up functionality not implemented yet.')}
              >
                Sign up here
              </Typography>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
