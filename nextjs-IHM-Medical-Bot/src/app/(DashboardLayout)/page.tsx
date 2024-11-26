'use client';
import { useEffect, useState } from 'react';
import { Grid, Box, Card, CardContent, Typography, Divider, Button, Slide, Skeleton, Fade } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useRouter } from 'next/navigation';
import { Capsule } from './types';
import { Patient } from './types';
import { URLPORT } from './URLPORT';

const Dashboard = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loadingCapsules, setLoadingCapsules] = useState<boolean>(true);
  const [loadingPatients, setLoadingPatients] = useState<boolean>(true);
  const router = useRouter();

  const handleAddPatient = () => {
    router.push('/addpatient');
  };

  const handleDisconnect = () => {
    // Implement your disconnect logic here
    console.log("Disconnected");
    // For example, you could navigate the user to a logout page or clear session data
  };

  const handleCapsuleClick = (id: string) => {
    const capsule = capsules.find((capsule) => capsule.id === id);
    if (capsule && capsule.content) {
      router.push(`/capsules/${id}`);
    } else {
      router.push(`/addcapsule/${id}`);
    }
  };

  const handlePatientClick = (id: string) => {
    router.push(`/patients/${id}`);
  };

  const getColorBasedOnName = (name: string) => {
    const firstLetter = name.charAt(0).toLowerCase(); // Convert first letter to lowercase
    if (firstLetter === 'a') return '#4CAF50'; // Green for names starting with 'A' or 'a'
    if (firstLetter === 'm') return '#f44336'; // Red for names starting with 'M' or 'm'
    if (firstLetter === 'n') return '#FFEB3B'; // Yellow for names starting with 'N' or 'n'
    return '#2196F3'; // Default Blue
  };

  useEffect(() => {
    const fetchCapsules = async () => {
      try {
        const response = await fetch(URLPORT + 'api/capsules');
        if (!response.ok) {
          throw new Error('Failed to fetch capsules');
        }
        const data: Capsule[] = await response.json();
        setCapsules(data);
      } catch (error) {
        console.error('Error fetching capsules:', error);
      } finally {
        setLoadingCapsules(false);
      }
    };

    const fetchPatients = async () => {
      try {
        const response = await fetch(URLPORT + 'api/patients');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoadingPatients(false);
      }
    };

    fetchCapsules();
    fetchPatients();
  }, []);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
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
          <Grid item xs={12}>
            <Card
              aria-labelledby="capsules-list-heading"
              sx={{
                flex: 1,
                borderRadius: '15px',
                boxShadow: 3,
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography id="capsules-list-heading" variant="h5" gutterBottom>
                      Capsules List
                    </Typography>
                  </Grid>

                  {/* Capsules Section */}
                  <Grid item xs={12} marginTop={2}>
                    <Grid container spacing={2}>
                      {loadingCapsules ? (
                        Array.from(new Array(4)).map((_, index) => (
                          <Grid item xs={6} key={index}>
                            <Skeleton variant="rectangular" height={200} animation="wave" />
                          </Grid>
                        ))
                      ) : (
                        capsules.map((capsule, index) => (
                          <Grid item xs={6} key={capsule.id}>
                            <Slide in={!loadingCapsules} direction="up" timeout={index * 200}>
                              <Card
                                onClick={() => handleCapsuleClick(capsule.id)}
                                tabIndex={0}
                                role="button"
                                sx={{
                                  borderRadius: '15px',
                                  boxShadow: 3,
                                  cursor: 'pointer',
                                  transition: '0.3s',
                                  padding: '16px',
                                  height: '200px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  textAlign: 'center',
                                  backgroundColor: getColorBasedOnName(capsule.patient),
                                }}
                              >
                                <CardContent>
                                  <Typography
                                    variant="h1"
                                    sx={{ fontSize: '5rem', lineHeight: 1, padding: '10px' }}
                                  >
                                    {index + 1}
                                  </Typography>
                                  {capsule.content ? (
                                    <>
                                      <Typography variant="h6" gutterBottom>
                                        {capsule.patient}
                                      </Typography>
                                      <Button
                                        sx={{
                                          backgroundColor: 'white',
                                          color: getColorBasedOnName(capsule.patient),
                                          borderRadius: '20px',
                                          padding: '5px 15px',
                                          textTransform: 'none',
                                          marginBottom: '5px',
                                        }}
                                      >
                                        {capsule.content}
                                      </Button>
                                      <Divider />
                                      <Typography variant="body2" sx={{ marginTop: '8px' }}>
                                        {capsule.date} - {capsule.time}
                                      </Typography>
                                    </>
                                  ) : null}
                                </CardContent>
                              </Card>
                            </Slide>
                          </Grid>
                        ))
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Patients List Section */}
          <Grid item xs={12}>
            <Card sx={{ borderRadius: '15px', boxShadow: 3, padding: '16px' }}>
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography variant="h5">Patient List</Typography>
                  <Fade in={!loadingPatients} timeout={500}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleAddPatient}
                        sx={{
                          borderRadius: '50px',
                          textTransform: 'none',
                          '&:hover': {
                            boxShadow: 6,
                          },
                        }}
                      >
                        Add Patient
                      </Button>

                    </Box>
                  </Fade>
                </Grid>
                <Grid container spacing={2} marginTop={2}>
                  {loadingPatients ? (
                    Array.from(new Array(4)).map((_, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Skeleton variant="rectangular" height={100} />
                      </Grid>
                    ))
                  ) : (
                    patients.map((patient, index) => (
                      <Grid item xs={12} sm={6} md={4} key={patient.id}>
                        <Slide in={!loadingPatients} direction="left" timeout={index * 200}>
                          <Card
                            onClick={() => handlePatientClick(patient.id)}
                            tabIndex={0}
                            role="button"
                            sx={{
                              borderRadius: '15px',
                              boxShadow: 3,
                              padding: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              transition: '0.3s',
                              '&:hover': {
                                boxShadow: 6,
                              },
                            }}
                          >
                            <PersonIcon sx={{ marginRight: 2, color: 'primary.main' }} />
                            <CardContent>
                              <Typography variant="body1">{patient.name}</Typography>
                            </CardContent>
                          </Card>
                        </Slide>
                      </Grid>
                    ))
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
