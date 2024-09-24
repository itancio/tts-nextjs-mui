'use client'

import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CircularProgress from '@mui/material/CircularProgress';

const PLAY_STATES = {
  NO_AUDIO: 'no_audio',
  LOADING: 'loading',
  PLAYING: 'playing',
};

export default function Home() {
  const [model, setModel] = useState('');
  const [text, setText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [playState, setPlayState] = useState(PLAY_STATES.NO_AUDIO);
  const [audio, setAudio] = useState(null);

  const models = [
    { 'label': 'Asteria',
      'attr': 'Female US English',
      'value': 'aura-asteria-en'
    },
    { 'label': 'Luna',
      'attr': 'Female US English',
      'value': 'aura-luna-en'
    },
    {
      'label': 'Stella',
      'attr': 'Female US English',
      'value': 'aura-stella-en'
    },
    {
      'label': 'Athena',
      'attr': 'Female UK English',
      'value': 'aura-athena-en'
    },
    {
      'label': 'Hera',
      'attr': 'Female US English',
      'value': 'aura-hera-en'
    },
    {
      'label': 'Orion',
      'attr': 'Male US English',
      'value': 'aura-orion-en'
    },
    {
      'label': 'Arcas',
      'attr': 'Male US English',
      'value': 'aura-arcas-en'
    },
    {
      'label': 'Perseus',
      'attr': 'Male US English',
      'value': 'aura-perseus-en'
    },
    {
      'label': 'Angus',
      'attr': 'Male Irish English',
      'value': 'aura-angus-en'
    },
    {
      'label': 'Orpheus',
      'attr': 'Male US English',
      'value': 'aura-orpheus-en'
    },
    {
      'label': 'Helios',
      'attr': 'Male UK English',
      'value': 'aura-helios-en'
    },
    {
      'label': 'Zeus',
      'attr': 'Male US English',
      'value': 'aura-zeus-en'
    },
  ];


  const playAudio = (audioUrl) => {
    console.log('initializing playAudio in url: ', audioUrl);
    if (audio) {
      stopAudio();
    }

    // Create a new Audio object
    const currentAudio = new Audio(audioUrl) 
    setAudio(currentAudio);

    // Play the audio
    currentAudio.play();

    // Update the play state
    setPlayState(PLAY_STATES.PLAYING);
  }

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setPlayState(PLAY_STATES.NO_AUDIO);
    }
  }



  const generateAudio = async () => {
    setLoading(true)
    try {
      // const params = {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //   voice: model,
      //   text: text,
      //   }),
      // }

      // const response = await fetch(`api/voice`, params)

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const {audioUrl} = await response.json()
      const audioUrl = 'audio/default.mp3'
      console.log('Returned audioUrl from the API call: ', audioUrl)
      playAudio(audioUrl);
      // playState = PLAY_STATES.PLAYING;
      // updatePlayButton();
    } catch (error) {
      setErrorMessage(`An error occurred: ${error.message}`);
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  const handleModelChange = (event) => {
    setModel(event.target.value);
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handlePlayButtonClick = () => {
    if (!model || !text.trim()) {
      setErrorMessage('Please select a model and enter text.');
      return;
    }
    setErrorMessage('');
    
    generateAudio();
  };

  return (
    <Box
      sx={{
        backgroundColor: '#101014',
        color: '#fff',
        minHeight: '100vh',
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
            Text-to-Speech
          </Typography>
        </Box>

        <Grid container spacing={4} className="grid-container">
          {/* Text-to-Speech Section */}
          <Grid item xs={12} md={6}>
            <Box className="tts-section" sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                  {models.map(({label, value, attr}, index) => (
                  <MenuItem key={index} value={value} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography color='#201cff'>{label}</Typography>
                    <Typography variant="body2" sx={{ color: 'gray', fontSize: '12px', marginLeft: 'auto' }}>
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

              {/* Button and Error Message */}
              <Box className="button-container" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {errorMessage && (
                  <Typography id="error-message" sx={{ color: 'rgb(255, 74, 93)', fontWeight: 800 }}>
                    {errorMessage}
                  </Typography>
                )}
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
                    color: '#13ef95',
                    '&:hover': {
                      backgroundColor: '#13ef95',
                      color: '#101014',
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ): (
                    <PlayArrowIcon className="button-icon" sx={{ fontSize: '1.5rem', color: 'inherit' }} />
                  )}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Information Section */}
          <Grid item xs={12} md={6}>
            <Box
              className="information-section"
              sx={{
                marginLeft: { md: '120px' },
                color: 'rgb(237, 237, 242)',
              }}
            >
              <Typography variant="h2" sx={{ fontWeight: 700, fontSize: '2rem', lineHeight: '3.75rem', letterSpacing: '-0.02em' }}>
                Sample texts:
              </Typography>
              <List sx={{ fontFamily: 'Arimo, sans-serif', paddingLeft: 0, gap: '16px' }}>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', marginLeft: '1em' }}>
                This is a sample text
                </ListItem>
                <ListItem sx={{ display: 'list-item', listStyleType: 'disc', marginLeft: '1em' }}>
                Hello World, my name is Gaffy. Nice to meet you.
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
