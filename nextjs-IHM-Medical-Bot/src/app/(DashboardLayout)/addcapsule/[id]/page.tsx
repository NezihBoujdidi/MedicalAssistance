'use client';

import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import { Patient } from '../../types'; // Adjust the import path accordingly
import { URLPORT } from '../../URLPORT';

const AddCapsule = () => {
  const router = useRouter();
  const pathname = usePathname();
  const capsuleId = pathname.split('/').pop(); // Get capsule ID from URL
  
  // State variables for capsule details and patients
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]); // Use Patient type here
  const [selectedPatientId, setSelectedPatientId] = useState<string>(''); // Use string type here

  // Fetch patients on component mount
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(URLPORT + 'api/patients');
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }
        const data: Patient[] = await response.json(); // Specify the expected type
        setPatients(data); // Set the fetched patients
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };

    fetchPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    const newCapsule = {
      id: capsuleId, // Use the capsuleId from the URL
      date,
      time,
      content,
      patient: selectedPatientId, // Include the selected patient ID
    };

    try {
      const response = await fetch(URLPORT + 'api/capsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCapsule),
      });

      if (!response.ok) {
        throw new Error('Failed to add capsule');
      }

      // Redirect to /remplir after successful submission
      router.push('/remplir'); // Navigate to the /remplir page
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a message)
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: 'url(/app.jpeg)', // Reference the image from the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Cover the full viewport height
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '15px', // Make the edges rounded
      }}
    >
      <Card sx={{ borderRadius: '15px', boxShadow: 3, width: '100%', maxWidth: 600 }}>
        <CardContent>
          <Typography margin={5} variant="h2" gutterBottom sx={{ textAlign: 'center' }}>
            {capsuleId}
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              variant="outlined"
              margin="normal"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Time"
              type="time"
              variant="outlined"
              margin="normal"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="patient-select-label">Select Patient</InputLabel>
              <Select
                labelId="patient-select-label"
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                label="Select Patient"
                required
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Content"
              variant="outlined"
              margin="normal"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={4}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ marginTop: 2, width: '100%', boxShadow: 3, borderRadius: '15px' }}
            >
              Add Capsule
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddCapsule;
