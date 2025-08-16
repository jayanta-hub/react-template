import React from 'react';
import { Box, CircularProgress, Typography, Fade } from '@mui/material';

interface LoadingProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  message = 'Loading...', 
  size = 40, 
  fullScreen = false 
}) => {
  const content = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight={fullScreen ? '100vh' : '200px'}
    >
      <Fade in={true} style={{ transitionDelay: '200ms' }}>
        <Box textAlign="center">
          <CircularProgress size={size} />
          {message && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 2 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Fade>
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={9999}
        bgcolor="background.default"
      >
        {content}
      </Box>
    );
  }

  return content;
};
