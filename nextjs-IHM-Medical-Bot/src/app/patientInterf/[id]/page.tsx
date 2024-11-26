'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Box, Card, CardContent, Typography, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { URLPORT } from '../../(DashboardLayout)/URLPORT';

const CapsuleDetail = () => {
  const pathname = usePathname();
  const capsuleId = pathname.split('/').pop(); // Get capsule ID from URL
  const [capsuleData, setCapsuleData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [soundActive, setSoundActive] = useState(false);
  
  const soundRef = useRef<HTMLAudioElement | null>(null);

  const router = useRouter();

  

  useEffect(() => {
    const fetchCapsuleData = async () => {
      try {
        const response = await fetch(URLPORT + `api/capsules/${capsuleId}`);
        if (!response.ok) throw new Error('Failed to fetch capsule data');
        const data = await response.json();
        setCapsuleData(data);
        calculateRemainingTime(data.time);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsuleData();
  }, [capsuleId]);

  const calculateRemainingTime = (capsuleTime: string) => {
    const [capsuleHours, capsuleMinutes] = capsuleTime.split(':').map(Number);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const capsuleMinutesTotal = capsuleHours * 60 + capsuleMinutes;

    let remainingMinutes = capsuleMinutesTotal - currentMinutes;
    if (remainingMinutes < 0) remainingMinutes += 24 * 60;

    const nowInSeconds = now.getSeconds();
    const remainingSeconds = (60 - nowInSeconds) % 60;

    const hours = Math.floor(remainingMinutes / 60);
    const minutes = remainingMinutes % 60;

    setRemainingTime({ hours, minutes, seconds: remainingSeconds });

    
    if (hours === 0 && minutes === 0 && remainingSeconds === 1 && !soundActive) {
      setSoundActive(true);  
    }
  };

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      if (capsuleData) calculateRemainingTime(capsuleData.time);
    }, 1000);

    return () => clearInterval(timer);
  }, [capsuleData]);

  
  const handleMedicationTaken = async () => {
    setSoundActive(false);  

    
    if (soundRef.current) {
      soundRef.current.pause();
      soundRef.current.currentTime = 0;  
    }

    const emptyCapsule = {
      content: '',
      time: '',
      date: '',
      patient: '',
      id: capsuleId, 
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
      
      const updatedData = await response.json();
      setCapsuleData(updatedData);
    } catch (error) {
      console.error(error);
    }
  };

  // Sonar sound alert
  useEffect(() => {
    
    if (soundActive) {
      /* const sound = new Audio('/assets/Gunner D.mp3'); 
      sound.loop = true;
      
     
      sound.play();
    } */
      if (!soundRef.current) {
        soundRef.current = new Audio('/assets/Gunner D.mp3'); // Initialize sound only once
        soundRef.current.loop = true;
      }
      soundRef.current.play().catch((error) => {
        console.error('Audio play error:', error);
      });
    }
  }, [soundActive]);
  
  if (loading) return <Typography>Loading...</Typography>;
  if (!capsuleData) return <Typography>Capsule not found</Typography>;

  return (
    <Box sx={{ padding: 4, display: 'flex'}}>
      <Card sx={{ borderRadius: '20px', boxShadow: 3, padding: 4, justifyContent: 'center', width: '150%', maxWidth: 1400 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: 0, fontSize: '36px' }}>
            Capsule Reminder
          </Typography>

          {/* Animated Countdown */}
          <Box sx={{ textAlign: 'center', marginBottom: 4, display: 'flex', justifyContent: 'center' }}>
            {/* Container for each circle and its label */}
            <Box sx={{ marginRight: 4 }}>
              {/* Hours Circle */}
              <motion.svg
                className="circle-animation"
                fill="transparent"
                viewBox="0 0 506 506"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '350px', height: '350px' }}
              >
                <motion.circle
                  cx="253"
                  cy="253"
                  r="150"  
                  stroke='#007FFF'
                  strokeWidth="10"  
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: '24 10 0 0' }}
                  animate={{
                    strokeDasharray: ['15 120 25 25', '16 25 92 72', '4 250 22 22'],
                    rotate: [120, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />
                <text x="253" y="253" textAnchor="middle" dy="10" fill="#6CB4EE" fontSize="90">  
                  {remainingTime.hours}
                </text>
              </motion.svg>
              <Typography variant="body1" sx={{ marginTop: 0, fontSize: '42px' }}>  
                Hours
              </Typography>
            </Box>

            <Box sx={{ marginRight: 4 }}>
              {/* Minutes Circle */}
              <motion.svg
                className="circle-animation"
                fill="transparent"
                viewBox="0 0 506 506"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '350px', height: '350px' }}
              >
                <motion.circle
                  cx="253"
                  cy="253"
                  r="150"  
                  stroke="#ff6600"
                  strokeWidth="10"  
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: '24 10 0 0' }}
                  animate={{
                    strokeDasharray: ['15 120 25 25', '16 25 92 72', '4 250 22 22'],
                    rotate: [120, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />
                <text x="253" y="253" textAnchor="middle" dy="10" fill="#ff6600" fontSize="90">  
                  {remainingTime.minutes}
                </text>
              </motion.svg>
              <Typography variant="body1" sx={{ marginTop: 0, fontSize: '42px' }}>  
                Minutes
              </Typography>
            </Box>

            <Box>
              {/* Seconds Circle */}
              <motion.svg
                className="circle-animation"
                fill="transparent"
                viewBox="0 0 506 506"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '350px', height: '350px' }}
              >
                <motion.circle
                  cx="253"
                  cy="253"
                  r="150"  
                  stroke="#ff6600"
                  strokeWidth="10"  
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ strokeDasharray: '24 10 0 0' }}
                  animate={{
                    strokeDasharray: ['15 120 25 25', '16 25 92 72', '4 250 22 22'],
                    rotate: [120, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'loop',
                  }}
                />
                <text x="253" y="253" textAnchor="middle" dy="10" fill="#ff6600" fontSize="90">  
                  {remainingTime.seconds}
                </text>
              </motion.svg>
              <Typography variant="body1" sx={{ marginTop: 0, fontSize: '42px' }}>  
                Seconds
              </Typography>
            </Box>
          </Box>

          {/* Capsule Information */}
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h4" sx={{ fontSize: '28px' , marginBottom: 0}}>  
              Scheduled Time:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '24px' }}>{capsuleData.time}</Typography>  
          </Box>
          <Box sx={{ marginBottom: 4 }}>
            <Typography variant="h4" sx={{ fontSize: '28px' , marginBottom: 0 }}>  
              Patient:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '24px' }}>{capsuleData.patient}</Typography>  
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontSize: '28px' , marginBottom: 0 }}>  
              Medication:
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '24px' }}>Type: {capsuleData.content}</Typography>  
          </Box>
          {/* Medication Taken Button */}
          {soundActive && (
            <Box sx={{ textAlign: 'center', marginTop: 4 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ width: '600px', height: '80px', fontSize: '28px' }}
                onClick={handleMedicationTaken}
              >
                Medication Taken
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CapsuleDetail;