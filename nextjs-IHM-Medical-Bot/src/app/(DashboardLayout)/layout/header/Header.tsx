import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography } from '@mui/material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Link from 'next/link';

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between', // This ensures the left and right content are spaced apart
    alignItems: 'center',
  }));
 
  
  
    const handleDisconnect = () => {
      // Clear the token from localStorage or sessionStorage
      localStorage.removeItem('token'); // or sessionStorage.removeItem('token') if it's stored in sessionStorage
  
      // Redirect to the login page

    };
  
  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Stack spacing={1} direction="row" alignItems="center">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography 
              variant="h4" 
              style={{ 
                fontWeight: 'bold', 
                textAlign: 'center', 
                margin: '20px 0',
              }}
            >
              Medical bot
            </Typography>
          </Link>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />  {/* This creates space between the title and the button */}
        <Link href="/authentication/login" style={{ textDecoration: 'none' }}>
        <Button
          variant="outlined"
          color="error"
          startIcon={<PowerSettingsNewIcon />}
          onClick={handleDisconnect}
          sx={{
            marginRight: '50px',
            borderRadius: '50px',
            textTransform: 'none',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          Disconnect
        </Button></Link>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
