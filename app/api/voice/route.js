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

const getAudio = async (text, model) => {
  console.log('getaudio text: ', text, ' model: ', model)
  // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
  const response = await deepgram.speak.request({text: text}, {model: 'aura-asteria-en'});

  console.log('deepgram: ', deepgram)
  console.log('Getting response from deepgram: ', response)

  // STEP 3: Get the audio stream and headers from the response
  if (response.result.ok) {
    const stream = await response.getStream();
    console.log('Getting incoming stream: ', stream)
    const headers = await response.getHeaders();

    if (headers) {
      console.log('Headers: ', headers)
    }

    if (stream) {
      // STEP 4: Convert the stream to an audio buffers
      const buffer = await getAudioBuffer(stream);
  
      console.log('Getting buffer: ', buffer)
  
      // STEP 5: Write the audio buffer to a file
      const filename = await writeAudioFile(buffer)
      return NextResponse.json({audioUrl: filename})
    } else {
      console.error('Error:', response.result.statusText);
      return NextResponse.json({ error: 'Error generating audio' }, { status: response.result.status });
    }
  } else {
    console.log('No response from deepgram: ', response.result)
  }
}

// helper function to write audio file to 'audio' directory
const writeAudioFile = async(buffer) => {
  try {
    // Create 'audio' directory if it doesn't exist
    const audioDirectory = path.join(process.cwd(), 'public', "audio");

    if (!fs.existsSync(audioDirectory)) {
        fs.mkdirSync(audioDirectory);
    }

    // Write audio file to 'audio' directory
    const filename = `audio_${Date.now()}.wav`
    const filePath = path.join(audioDirectory, filename);

    await fs.promises.writeFile(filePath, buffer)

    console.log("Audio file saved successfully at: ${filePath}")

    return `/audio/${filename}`

    // await new Promise( (resolve, reject) => {
    //     fs.writeFile(filePath, buffer, (err) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             console.log("Audio file saved successfully.");
    //             resolve();
    //         }
    //     })
    // })

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