'use client';
import { useEffect, useState } from 'react'; // Import useState and useEffect
import { Typography, Button, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { usePathname, useRouter } from 'next/navigation';
import { URLPORT } from '../../URLPORT';


const SamplePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const patientId = pathname.split('/').pop(); // Get patient ID from URL
  const [patient, setPatient] = useState<{ name: string; id: string; description?: string } | null>(null); // State to hold patient data

  useEffect(() => {
    if (!patientId) return; // Exit if ID is not available

    const fetchPatient = async () => {
      try {
        const response = await fetch(URLPORT+`api/patients/${patientId}`); // Use the dynamic ID in the URL
        if (!response.ok) {
          throw new Error('Failed to fetch patient');
        }
        const data = await response.json();
        setPatient(data); // Set the fetched patient data to state
      } catch (error) {
        console.error('Error fetching patient:', error);
      }
    };

    fetchPatient(); // Call the fetch function
  }, [patientId]); // Depend on patientId, so it runs when ID changes

 
  const handleDelete = async () => {
    try {
      const response = await fetch(URLPORT+`api/patients/${patientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete patient');
      }

      // Alert the user and redirect to home page
      alert('Patient deleted successfully!');
      router.push('/'); // Redirect to the home page after deletion
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };


  return (
    <PageContainer>
      <DashboardCard>
        {patient ? (
          <>
            <Typography variant="h2" textAlign={'center'} marginBottom={5}>
              {patient.name}
            </Typography>
            <Typography variant="body1">Patient ID: {patient.id}</Typography>
            <Box
              sx={{
                backgroundColor: '#f0f0f0', // Light gray background
                padding: 2,
                borderRadius: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2">Description: {patient.description}</Typography>
            </Box>
            <Button 
              variant="contained" 
              color="error" 
              onClick={handleDelete} 
              fullWidth // Make the button take the full width of the card
              style={{ marginTop: '16px' }} // Optional: add some margin at the top for spacing
            >
              Delete Patient
            </Button>
          </>
        ) : (
          <Typography>Loading patient data...</Typography> // Loading state
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;
