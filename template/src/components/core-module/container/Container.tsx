import { Box, useMediaQuery } from '@mui/material'
import { theme } from '../../../theme';
import React from 'react';

const Container = ({ children }: React.PropsWithChildren) => {
    const isMobileView = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Box sx={{ p: isMobileView ? 0 : 4, maxWidth: 1280, m: 'auto' }}>
            {children}
        </Box>
    )
}

export default Container