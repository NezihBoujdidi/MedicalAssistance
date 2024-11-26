'use client';
import { useState } from 'react'; // Import useState
import { Button, TextField, Typography, Card, CardContent, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useRouter } from 'next/navigation'; // Import useRouter
import { URLPORT } from '../URLPORT';

const AddPatientPage = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter(); // Initialize the router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const patientData = { name, id, description };

    try {
      const response = await fetch(URLPORT + 'api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });

      if (!response.ok) {
        throw new Error('Failed to add patient');
      }

      // Redirect to the home page after successful addition
      alert('Patient added successfully!');
      router.push('/'); // Redirect to home page

      // Optionally, reset the form
      setName('');
      setId('');
      setDescription('');
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/app.jpeg)', // Reference the image from the public folder
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '100vh', // Full viewport height
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      borderRadius: '16px', // Add rounded corners
      overflow: 'hidden', // Ensure the corners are rounded by hiding overflow
      }}
    >
      <Card elevation={3} sx={{ borderRadius: 2, padding: 2, maxWidth: 600, width: '100%' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Add Patient
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="ID"
              variant="outlined"
              fullWidth
              margin="normal"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                width: '100%', // Full width
                borderRadius: '8px', // Custom border radius
                marginTop: '16px', // Optional: space above the button
              }}
            >
              Add Patient
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddPatientPage;
