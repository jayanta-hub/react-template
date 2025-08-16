import { Box, Button, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import accessDeniedImg from '../assets/images/access_denied.png';
import { theme } from '../theme';

const NotAuthorized: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor={theme?.palette?.customColors?.white[23]} p={3}>
      <Box mb={4}>
        <img
          src={accessDeniedImg}
          alt="Access Denied - You do not have permission to view this page."
          style={{
            maxWidth: '400px',
            width: '100%',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
          }}
        />
      </Box>
      <Typography variant="h3" color="error" gutterBottom>
        403
      </Typography>
      <Typography variant="body1" gutterBottom>
        You do not have permission to view this page. Kindly refer to your administrator.
      </Typography>
      <Button sx={{
        backgroundColor: theme?.palette?.customColors?.blue?.[10],
        textTransform: "none",
        fontSize: "14px",
      }} variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotAuthorized; 