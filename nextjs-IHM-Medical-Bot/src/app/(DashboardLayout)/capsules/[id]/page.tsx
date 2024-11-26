'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Box, Card, CardContent, Grid, Typography, Divider, CircularProgress, Button } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useEffect, useState } from 'react';
import { URLPORT } from '../../URLPORT';

const CapsuleDetail = () => {
  const pathname = usePathname();
  const capsuleId = pathname.split('/').pop(); // Get capsule ID from URL
  const [capsuleData, setCapsuleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [remainingTime, setRemainingTime] = useState<string>('00:00'); // Initial remaining time
  const router = useRouter();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = parseInt(event.key, 10);
      if (!isNaN(key) && key > 0 && key.toString() == "0") {
        // Select the capsule corresponding to the number pressed
        router.push('/'); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  useEffect(() => {
    // Fetch capsule data based on the capsuleId from the URL
    const fetchCapsuleData = async () => {
      try {
        const response = await fetch(URLPORT + `api/capsules/${capsuleId}`); 
        if (!response.ok) {
          throw new Error('Failed to fetch capsule data');
        }
        const data = await response.json();
        setCapsuleData(data);
        calculateRemainingTime(data.time); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchCapsuleData(); // Call the fetch function
  }, [capsuleId]);

  // Function to calculate the remaining time
  const calculateRemainingTime = (capsuleTime: string) => {
    const [capsuleHours, capsuleMinutes] = capsuleTime.split(':').map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Convert everything to minutes for easier calculation
    const totalCapsuleMinutes = capsuleHours * 60 + capsuleMinutes;
    const totalCurrentMinutes = currentHours * 60 + currentMinutes;

    let remainingMinutes = totalCapsuleMinutes - totalCurrentMinutes;

    if (remainingMinutes < 0) remainingMinutes += 24 * 60; // If it's past the capsule time, assume it's for the next day

    const hoursLeft = Math.floor(remainingMinutes / 60);
    const minutesLeft = remainingMinutes % 60;

    setRemainingTime(`${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}`);
  };

  // -------------------------
  const handleClearCapsule = async () => {
    const emptyCapsule = {
      content: '',
      time: '',
      date: '',
      patient: '',
      id: capsuleId, // Set the id to the capsuleId from the URL
    };

    try {
      const response = await fetch(URLPORT + `api/capsules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emptyCapsule),
      });

      if (!response.ok) {
        throw new Error('Failed to clear the capsule');
      }

      // Optionally: Fetch the updated capsule data
      const updatedData = await response.json();
      setCapsuleData(updatedData);
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };
  //-------------------------------

  if (loading) {
    return <CircularProgress />; // Show loading spinner while fetching data
  }

  if (!capsuleData) {
    return <Typography variant="h5">Capsule not found</Typography>;
  }

  return (
    <Box
    sx={{
    backgroundImage: 'url(/app.jpeg)', // Reference the image from the public folder
    backgroundSize: 'cover',
    backgroundPosition: 'center',

    display: 'flex',

    alignItems: 'center',
    padding: '10px',
    borderRadius: '16px', // Add rounded corners
    
    }}
  >
      <Grid container spacing={3}>
        {/* Capsule Content */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: '20px', boxShadow: 3 }}>
            <CardContent>
              <Typography margin={5} variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
                {capsuleId}
              </Typography>
            
           
              {/* Delivery Time Section */}
              <Grid container spacing={2} marginTop={2}>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderRadius: '20px',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Time remaining
                    </Typography>
                    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
                      <CircularProgress variant="determinate" value={80} size={120} thickness={4} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 10,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography variant="h4" component="div" color="textPrimary">
                          {remainingTime}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                <Grid item xs={6}>
                  <Card
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      height: '180px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      borderRadius: '20px',
                    }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      Scheduled Time
                    </Typography>
                    <Typography variant="h4" color="error">
                      {capsuleData.time}
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
              {/* Patient Section */}
              <Box marginTop={4}>
                <Typography variant="body1" color="textSecondary">
                  Patient
                </Typography>
                <Card sx={{ padding: 2, display: 'flex', alignItems: 'center', borderRadius: '20px' }}>
                  <PersonIcon sx={{ marginRight: 2, color: 'primary.main' }} />
                  <Typography variant="h6">{capsuleData.patient}</Typography>
                </Card>
              </Box>
              {/* Medications Section */}
              <Box marginTop={4}>
                <Typography variant="body1" color="textSecondary">
                  Medications
                </Typography>
                <Card sx={{ padding: 2, marginTop: 1, borderRadius: '20px' }}>
                  <Typography variant="body2" color="textSecondary">
                    Type Medicament: {capsuleData.content}
                  </Typography>
                </Card>
              </Box>
              {/* Vider la capsule Button */}
              <Box marginTop={4} display="flex" justifyContent="center">
                <Button variant="contained" color="secondary" onClick={handleClearCapsule} fullWidth
                sx={{ marginTop: 2, width: '100%', boxShadow: 3, borderRadius: '15px' }}>
                  Vider la capsule
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CapsuleDetail;
