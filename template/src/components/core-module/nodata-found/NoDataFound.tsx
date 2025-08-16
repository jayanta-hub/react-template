import { Box, Typography } from '@mui/material';


const NoDataFound = ({ imageSrc, message, description }: { message?: string, imageSrc: string, description?: string }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
      }}
    >
      <Box
        component="img"
        src={imageSrc}
        alt={message} // Use dynamic text for the alt attribute
        sx={{
          width: '30vw',
          display: 'block',


        }}
      />
      <Typography variant="h5" gutterBottom sx={{ fontSize: '18px', color: '#000000', fontWeight: '600' }}>
        {message}
      </Typography>
      <Box sx={{ width: '65%' }}>
        <Typography variant="h6" gutterBottom sx={{ fontSize: '14px', color: '#555', fontWeight: '300' }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

export default NoDataFound;