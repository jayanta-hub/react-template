import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { theme } from '../../../theme';

interface CircularProgressWithLabelProps {
  value: number;
  total: number;
  size?: number;
  thickness?: number;
  width?: string;
  height?: string;
  labelFontSize?: string;
  labelFontWeight?: string;
  labelColor?: string;
}

const CircularProgressWithLabel: React.FC<CircularProgressWithLabelProps> = ({
  value,
  total,
  size = 40,
  thickness = 4,
  width = '38px',
  height = '38px',
  labelFontSize = '12px',
  labelFontWeight = 600,
  labelColor = theme.palette.customColors?.blue[22] || '#0083FF',
}) => {
  const progress = total > 0 ? (value / total) * 100 : 0;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={progress}
        size={size}
        thickness={thickness}
        sx={{
          width,
          height,
          color: theme.palette.customColors?.blue[22] || '#0083FF',
          '& .MuiCircularProgress-circle': {
            strokeLinecap: 'butt',
          },
          background: 'white !important',
          borderRadius: '50% !important',
          boxShadow:
            (typeof width === 'string'
              ? parseFloat(width)
              : typeof size === 'number'
                ? size
                : 38) > 50
              ? 'inset 0 0 0 5px white, inset 0 0 0px 7px #E5E5E5'
              : 'inset 0 0 0 3.5px white, inset 0 0 0px 4.6px #E5E5E5',
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{
            fontSize: labelFontSize,
            fontWeight: labelFontWeight,
            lineHeight: 1,
          }}
        >
          <span style={{ color: labelColor }}>{value}</span>
          <span style={{ color: value === total ? labelColor : '#A7A7A7' }}>/</span>
          <span style={{ color: value === total ? labelColor : '#A7A7A7' }}>{total}</span>
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithLabel; 