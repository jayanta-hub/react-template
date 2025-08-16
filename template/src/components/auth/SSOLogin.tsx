import React from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Microsoft as MicrosoftIcon,
  Apple as AppleIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface SSOProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  hoverColor: string;
}

interface SSOLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

const SSO_PROVIDERS: SSOProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: <GoogleIcon />,
    color: '#DB4437',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: <MicrosoftIcon />,
    color: '#00A4EF',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
  {
    id: 'apple',
    name: 'Apple',
    icon: <AppleIcon />,
    color: '#000000',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: <GitHubIcon />,
    color: '#333333',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <LinkedInIcon />,
    color: '#0077B5',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: <TwitterIcon />,
    color: '#1DA1F2',
    bgColor: '#ffffff',
    hoverColor: '#f8f9fa',
  },
];

export const SSOLogin: React.FC<SSOLoginProps> = ({
  onSuccess,
  onError,
  isLoading = false,
}) => {
  const { checkAuth } = useAuth();

  const handleSSOLogin = async (provider: SSOProvider) => {
    try {
      // Simulate SSO redirect
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a mock SSO token
      localStorage.setItem('mockAuthToken', JSON.stringify({
        token: `mock-sso-${provider.id}-token`,
        user: { 
          email: `user@${provider.id}.com`,
          provider: provider.id,
          name: `Demo User (${provider.name})`
        }
      }));
      
      await checkAuth();
      onSuccess?.();
    } catch (err) {
      const errorMessage = `SSO login with ${provider.name} failed`;
      onError?.(errorMessage);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom align="center">
        Sign in with Single Sign-On
      </Typography>
      
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
        Choose your preferred authentication provider
      </Typography>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        {SSO_PROVIDERS.map((provider) => (
          <Paper
            key={provider.id}
            elevation={1}
            sx={{
              p: 2,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease-in-out',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                elevation: 3,
                transform: isLoading ? 'none' : 'translateY(-2px)',
                borderColor: provider.color,
                bgcolor: provider.hoverColor,
              },
            }}
            onClick={() => !isLoading && handleSSOLogin(provider)}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                minHeight: 48,
              }}
            >
              <Box
                sx={{
                  color: provider.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {provider.icon}
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: isLoading ? 'text.disabled' : 'text.primary',
                }}
              >
                {provider.name}
              </Typography>
              
              {isLoading && (
                <CircularProgress size={16} sx={{ ml: 'auto' }} />
              )}
            </Box>
          </Paper>
        ))}
      </Box>

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          or
        </Typography>
      </Divider>

      <Alert severity="info" sx={{ mb: 2 }}>
        <Typography variant="body2">
          <strong>Demo Mode:</strong> This is a demonstration of SSO functionality. 
          Click any provider to simulate the authentication flow.
        </Typography>
      </Alert>
    </Box>
  );
};
