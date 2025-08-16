import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import noResultFoundImg from '../assets/images/404-error.svg';
import { theme } from '../theme';
import { ROUTES } from '../utility/constant';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#f8f9fa">
      <Box mb={4}>
        <img
          src={noResultFoundImg}
          alt="404 - Page Not Found"
          style={{
            maxWidth: '400px',
            width: '60%',
            height: 'auto',
            display: 'block',
            margin: '0 auto',
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))',
            borderRadius:'50%'
          }}
        />
      </Box>
      <Typography variant="h3" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="body1" gutterBottom>
        The page you are looking for does not exist or has been moved.
      </Typography>
      <Button sx={{
        backgroundColor: theme?.palette?.customColors?.blue?.[10],
        textTransform: "none",
        fontSize: "14px",
      }} variant="contained" color="primary" onClick={() => navigate(ROUTES.DASHBOARD)}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound; 