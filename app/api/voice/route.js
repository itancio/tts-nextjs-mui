import { NextResponse } from "next/server";
import {createClient, LiveTranscriptionEvents} from '@deepgram/sdk'
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// STEP 1: Create a Deepgram client with your API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

require('dotenv').config()
export async function POST(req){
    const { text, voice } = await req.json();

    console.log("Initializing request: ", text, voice)

    try {
        const filePath = await getAudio(text, voice)
        return NextResponse.json({ audioUrl: filePath });
    } catch (error) {
        console.error("Error during API request:", error.message);
        console.error("Stack trace:", error.stack);
        return NextResponse.json({ error: 'Error generating audio' }, { status: response.result.status });
    }
}

const getAudio = async (text, voice) => {
  // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
  const response = await deepgram.speak.request({ text }, {voice});

  console.log('Getting response from deepgram: ', response.result.ok)

  // STEP 3: Get the audio stream and headers from the response
  if (response.result.ok) {
    const stream = await response.getStream();
    const headers = await response.getHeaders();
    console.log('Getting stream', stream)
  } else {
    console.log('No response from deepgram: ', response.result)
  }


  if (stream) {
    // STEP 4: Convert the stream to an audio buffers
    const buffer = await getAudioBuffer(stream);

    console.log('Getting buffer: ', buffer)

    // STEP 5: Write the audio buffer to a file
    writeAudioFile(buffer)
    return "/audio/audio.wav"
  } else {
    console.log("Error generating audio:", stream)
    throw new Error("Error generating audio: Stream is empty")
  }
}

// helper function to write audio file to 'audio' directory
const writeAudioFile = async(buffer) => {
  try {
    // Create 'audio' directory if it doesn't exist
    const audioDirectory = path.join(__dirname, "audio");
    if (!fs.existsSync(audioDirectory)) {
        fs.mkdirSync(audioDirectory);
    }

    // Write audio file to 'audio' directory
    await new Promise( (resolve, reject) => {
        fs.writeFile(path.join(audioDirectory, 'audio.wav'), buffer, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Audio file saved successfully.");
                resolve();
            }
        })
    })

  } catch (error) {
    console.error("Error writing audio file:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error("An error occurred while writing the audio file.");
  }
}

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    
    chunks.push(value);
  }

  // Combine all chunks into a single Uint8Array
  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  // Create a Node.js buffer that handle binary data efficiently
  return Buffer.from(dataArray.buffer);
}