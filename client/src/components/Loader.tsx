import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

interface LoaderProps {
  size?: number;
  thickness?: number;
}

const Loader: React.FC<LoaderProps> = ({ size = 40, thickness = 8 }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        m: 1
      }}
    >
      <CircularProgress size={size} thickness={thickness} />
    </Box>
  );
};

export default Loader;
