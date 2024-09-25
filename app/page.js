'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import CircularProgress from '@mui/material/CircularProgress';

const PLAY_STATES = {
  NO_AUDIO: 'no_audio',
  LOADING: 'loading',
  PLAYING: 'playing',
};

const sampleTexts = [
  {
    title: 'Medical Reception Interaction',
    text: `Hello, I have an appointment scheduled with Dr. Smith at 10 AM today. Could you please confirm my appointment and let me know if there's any paperwork I need to complete before my visit? Thank you.`,
  },
  {
    title: 'Customer Support Call',
    text: `Hi, I'm having trouble connecting to the internet. I've tried restarting my router and checking all cables, but I'm still unable to access any websites. Could you please help me resolve this issue as soon as possible? Thank you.`,
  },
  {
    title: 'Fast Food Ordering',
    text: `I'd like to order a cheeseburger combo, please. Could I have that with extra pickles and no onions? Also, I'd like a medium fries and a large cola to go with my meal. Thank you!`,
  },
  {
    title: 'Hotel Booking Inquiry',
    text: `Hello, I'd like to book a double room for two nights starting tomorrow, April 30th. Do you have any available rooms with a sea view? Also, could you please provide information on your check-in and check-out times? Thank you.`,
  },
  {
    title: 'Job Interview Question',
    text: `Certainly! In my previous role, we had a tight deadline on a major project that required coordinating with multiple departments. I took the initiative to organize daily stand-up meetings, streamline our workflow, and ensure clear communication. As a result, we successfully completed the project on time and exceeded our client's expectations.`,
  },
];

const models = [
  { label: 'Asteria', attr: 'Female US English', value: 'aura-asteria-en' },
  { label: 'Luna', attr: 'Female US English', value: 'aura-luna-en' },
  { label: 'Stella', attr: 'Female US English', value: 'aura-stella-en' },
  { label: 'Athena', attr: 'Female UK English', value: 'aura-athena-en' },
  { label: 'Hera', attr: 'Female US English', value: 'aura-hera-en' },
  { label: 'Orion', attr: 'Male US English', value: 'aura-orion-en' },
  { label: 'Arcas', attr: 'Male US English', value: 'aura-arcas-en' },
  { label: 'Perseus', attr: 'Male US English', value: 'aura-perseus-en' },
  { label: 'Angus', attr: 'Male Irish English', value: 'aura-angus-en' },
  { label: 'Orpheus', attr: 'Male US English', value: 'aura-orpheus-en' },
  { label: 'Helios', attr: 'Male UK English', value: 'aura-helios-en' },
  { label: 'Zeus', attr: 'Male US English', value: 'aura-zeus-en' },
];

export default function Home() {
  const [model, setModel] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [playState, setPlayState] = useState(PLAY_STATES.NO_AUDIO);
  const audioRef = useRef(null);



  const getButtonIcon = () => {
    switch (playState) {
      case PLAY_STATES.NO_AUDIO:
        return <PlayArrowIcon sx={{ fontSize: '1.5rem', color: '#13ef95' }} />;
      case PLAY_STATES.LOADING:
        return <CircularProgress size={24} />;
      case PLAY_STATES.PLAYING:
        return <StopIcon sx={{ fontSize: '1.5rem', color: '#13ef95' }} />;
      default:
        return <PlayArrowIcon sx={{ fontSize: '1.5rem', color: '#13ef95' }} />;
    }
  };

  const playAudio = (audioUrl) => {
    console.log('Initializing playAudio with URL:', audioUrl);

    if (!audioRef.current) {
      audioRef.current = new Audio();
    } else {
      // Stop any existing audio before playing new
      stopAudio();
    }

    const cacheBustedUrl = `${audioUrl}?t=${new Date().getTime()}`;
    audioRef.current.src = cacheBustedUrl;

    // Remove any existing event listeners to prevent duplicates
    audioRef.current.removeEventListener('ended', handleAudioEnded);

    audioRef.current.play();

    audioRef.current.addEventListener('ended', handleAudioEnded);

    setPlayState(PLAY_STATES.PLAYING);
  };

  const stopAudio = () => {
    if (audioRef.current) {
      console.log('Stopping audio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      // Do not set audioRef.current to null
      setPlayState(PLAY_STATES.NO_AUDIO);
    } else {
      console.log('No audio to stop');
    }
  };

  const handleAudioEnded = () => {
    console.log('Audio finished playing');
    setPlayState(PLAY_STATES.NO_AUDIO);
  };

  const clearText = () => {
    setText('');
  };

  const generateAudio = async () => {
    setPlayState(PLAY_STATES.LOADING);
    setErrorMessage('');
    try {
      const response = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          text: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const audioUrl = data.audioUrl;

      console.log('Returned audioUrl from the API call:', audioUrl);
      playAudio(audioUrl);
    } catch (error) {
      console.error('Error generating audio:', error);
      setErrorMessage(`An error occurred: ${error.message}`);
      setPlayState(PLAY_STATES.NO_AUDIO);
    }
  };

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handlePlayButtonClick = () => {
    console.log('handlePlayButtonClick called with playState:', playState);
    switch (playState) {
      case PLAY_STATES.NO_AUDIO:
        if (!model || !text.trim()) {
          setErrorMessage('Please select a model and enter text.');
          return;
        }
        setErrorMessage('');
        generateAudio();
        break;
      case PLAY_STATES.PLAYING:
        console.log('Stopping audio from handlePlayButtonClick');
        stopAudio();
        break;
      default:
        break;
    }
  };

  const handleSampleTextClick = (sampleText) => { 
    setText(sampleText);
  }

  useEffect(() => {
    // Clear error message
    if (model && text) {
      setErrorMessage('')
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
      }
    };
  }, [model, text]);

  return (
    <>
    <Box
      sx={{
        backgroundColor: '#101014',
        color: '#fff',
        minHeight: '100vh', // Set the minHeight to 100vh to cover the full viewport height
        display: 'flex', // Use flexbox layout
        flexDirection: 'column', // Column direction for content stacking
        justifyContent: 'space-between', // Ensure footer stays at the bottom
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          py: { xs: '1.5rem', sm: '2rem' },
          flex: 1, // This allows the content area to take up remaining space
        }}
      >
        {/* Title Section */}
        <Box
          className="title"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            gap: '0.5rem',
            mb: '4rem',
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: 'transparent',
              backgroundClip: 'text',
              backgroundImage: 'linear-gradient(90deg, #201cff -91.5%, #13ef95 120.05%)',
              fontSize: { xs: '1.5rem', sm: '3.5rem' },
              margin: 0,
              fontWeight: 800,
              fontFamily: 'Arimo, sans-serif',
            }}
          >
            Talkie: Text-to-Speech
          </Typography>
        </Box>

        <Grid container spacing={4} className="grid-container">
          
          {/* Text-to-Speech Section */}
          <Grid item xs={12} md={6}>
            <Box
              className="tts-section"
              sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              {/* Model Selection */}
              <FormControl variant="outlined" fullWidth>
                <InputLabel sx={{ color: '#fff' }}>Choose a model</InputLabel>
                <Select
                  id="models"
                  value={model}
                  onChange={handleModelChange}
                  label="Choose a model"
                  sx={{
                    height: '54px',
                    borderRadius: '4px',
                    borderWidth: '1px',
                    borderColor: 'rgba(44, 44, 51, 1)',
                    backgroundColor: 'rgba(16, 16, 20, 1)',
                    color: '#fff',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(44, 44, 51, 1)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#13ef95',
                    },
                    '.MuiSvgIcon-root': {
                      color: '#fff',
                    },
                  }}
                >
                  {models.map(({ label, value, attr }, index) => (
                    <MenuItem
                      key={index}
                      value={value}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography color= '#1976D2'>{label}</Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: 'gray', fontSize: '12px', marginLeft: 'auto' }}
                      >
                        {attr}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Text Input */}
              <TextField
                id="text-input"
                placeholder="Add text to be synthesized..."
                multiline
                minRows={8}
                value={text}
                onChange={handleTextChange}
                variant="outlined"
                sx={{
                  color: '#fff',
                  backgroundColor: 'rgba(16, 16, 20, 1)',
                  borderRadius: '4px',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(44, 44, 51, 1)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#13ef95',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#13ef95',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: '#fff',
                    fontFamily: 'Fira Code, monospace',
                  },
                }}
              />

              {/* Buttons section */}
              <Box
                className="button-container"
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {/* Play button */}
                <Button
                  variant="outlined"
                  id="play-button"
                  onClick={handlePlayButtonClick}
                  sx={{
                    background: `linear-gradient(#000, #000) padding-box,
                        linear-gradient(90deg, #201cff -91.5%, #13ef95 80.05%) border-box`,
                    height: '48px',
                    width: '113px',
                    border: '1px solid transparent',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    '&:hover': {
                      background: '#13ef95', // Changed to a plain background color
                    },
                    '&:hover svg': {
                      color: '#101014', // Makes the icon transparent on hover
                    },
                  }}
                >
                  {getButtonIcon()}
                </Button>

                {/* Display error message */}
                {errorMessage && (
                  <Typography
                    id="error-message"
                    sx={{ color: 'rgb(255, 74, 93)', fontWeight: 100 }}
                  >
                    {errorMessage}
                  </Typography>
                )}

                {/* Clear button */}
                <Button
                  disabled={!text}
                  onClick={clearText}
                >
                  clear
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Information Section */}
          <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
        
            }}
          >
            <Typography variant="h4" sx={{ marginTop: '0' }}>
              Suggestions
            </Typography>
            <Typography  sx={{ marginTop: '0', fontWeight: 300 }}>
              Pick a sample text to generate audio
            </Typography>
            {sampleTexts.map(({title, text}, index) => (
              <Button
                key={index}
                variant="outlined"
                onClick={() => handleSampleTextClick(text)}
                sx={{
                  color: '#13ef95',
                  background: `linear-gradient(#000, #000) padding-box,
                        linear-gradient(90deg, #201cff -91.5%, #13ef95 80.05%) border-box`,
                  textTransform: 'none',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  '&:hover': {
                    backgroundColor: 'rgba(19, 239, 149, 0.1)',
                    borderColor: '#13ef95',
                  },
                }}
              >
                <Typography  sx={{ fontWeight: 100, color: 'white' }} gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#888' }} gutterBottom>
                  {text.substring(0, 80)}...
                </Typography>
              </Button>
            ))}
          </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
      
    </Box>
    
    </>
  );
}
