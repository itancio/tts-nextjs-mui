import { NextResponse } from "next/server";
import { createClient } from '@deepgram/sdk';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { put } from '@vercel/blob'

dotenv.config();

// STEP 1: Create a Deepgram client with your API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export async function POST(req) {
  const body = await req.json();
  console.log("Initializing body request: ", body);
  
  const { text, model } = await body
  console.log(`Initializing request with params: {text: ${text}, model: ${model}}`);

  try {
    const filePath = await getAudio(text, model);
    return NextResponse.json({ audioUrl: filePath });
  } catch (error) {
    console.error("Error during API request:", error.message);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: 'Error generating audio' }, { status: 500 });
  }
}

const getAudio = async (text, model) => {
  console.log('getAudio text:', text, ', model:', model);

  // STEP 2: Make a request and configure the request with options
  const response = await deepgram.speak.request({ text: text }, { model: model });

  console.log('Deepgram response:', response);

  // STEP 3: Get the audio stream and headers from the response
  if (response.result.ok) {
    const stream = await response.getStream();
    console.log('Received stream from Deepgram:', stream);
    const headers = await response.getHeaders();

    if (headers) {
      console.log('Headers:', headers);
    }

    if (stream) {
      // STEP 4: Convert the stream to an audio buffer
      const buffer = await getAudioBuffer(stream);

      console.log('Received buffer:', buffer);

      // // STEP 5: Write the audio buffer to a file
      const filename = await writeAudioFile(buffer);

      console.log('Returning audio file named:', filename);
      return filename; // Return the filename string
    } else {
      console.error('Error: Stream is null');
      throw new Error('Error generating audio: Stream is null');
    }
  } else {
    console.error('No response from Deepgram:', response.result);
    throw new Error('No response from Deepgram');
  }
};

// Helper function to convert stream to audio buffer
const getAudioBuffer = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  // Combine all chunks into a single Uint8Array
  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  // Create a Node.js buffer that handles binary data efficiently
  return Buffer.from(dataArray.buffer);
};


// Helper function to write audio file to 'audio' directory
const writeAudioFile = async (buffer) => {
  try {

    // Write audio file to 'audio' directory
    const filename = `audio/output.mp3`;

    // Store audio buffer to the server
    const {url} = await put(filename, buffer, {access: 'public'})

    console.log(`Audio file saved successfully at: ${url}`);

    return url;
  } catch (error) {
    console.error("Error writing audio file:", error.message);
    console.error("Stack trace:", error.stack);
    throw new Error("An error occurred while writing the audio file.");
  }
};