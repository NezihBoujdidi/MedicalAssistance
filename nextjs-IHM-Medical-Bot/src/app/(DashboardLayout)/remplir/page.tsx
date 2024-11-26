'use client';

import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

const Remplir = () => {
  const router = useRouter(); // Initialize the router

  const handleButtonClick = () => {
    router.push('/'); // Navigate to the root path
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/app.jpeg)', // Reference the background image from the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Cover the full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column', // Stack the content vertically
        padding: '20px',
        textAlign: 'center', // Center text horizontally
      }}
    >
      <Card
        sx={{
          borderRadius: '16px', // Add rounded corners
          boxShadow: 3, // Add elevated effect
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              color: 'black',
              fontWeight: 'bold',
              marginBottom: '20px',
            }}
          >
            Fill the robot with the capsule contents
          </Typography>
          <Box
            sx={{
              backgroundImage: 'url(/robot.png)',
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              width: '300px',
              height: '300px',
              backgroundRepeat: 'no-repeat',
              marginBottom: '30px',
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              width: '100%',
              borderRadius: '50px',
              padding: '15px',
              fontSize: '16px',
            }}
            onClick={handleButtonClick} // Attach the click handler
          >
            Capsule filled
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Remplir;
