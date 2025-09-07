import React from 'react';
import Box from '@mui/material/Box';


const FormItem = ({ children }) => {
  return (
    <Box sx={{ mb: 2, width: '100%' }}>
      {children}
    </Box>
  );
};

export default FormItem;