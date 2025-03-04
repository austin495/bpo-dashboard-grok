import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// Extend RequestInit type for Node.js compatibility
declare global {
  interface RequestInit {
    duplex?: 'half';
  }
}

const fetchWithTimeout = async (url: string, options: RequestInit, timeout = 30000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.DEEPGRAM_API_KEY) {
      throw new Error('Deepgram API key missing');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    // Validate file
    const MAX_SIZE = 500 * 1024 * 1024;
    const ALLOWED_TYPES = [
      'audio/mpeg', 'audio/wav', 'audio/m4a',
      'video/mp4', 'video/quicktime', 'video/x-msvideo'
    ];

    if (!file || !ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File exceeds ${MAX_SIZE / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    // Convert to buffer with progress handling
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const readableStream = blob.stream();

    // Configure Deepgram request
    const deepgramParams = new URLSearchParams({
      model: 'nova-3',
      smart_format: 'true',
      diarize: 'true',
      utterances: 'true',
      detect_language: 'true',
      filler_words: 'true'
    });

    let deepgramResponse;
    try {
      deepgramResponse = await fetchWithTimeout(
        `https://api.deepgram.com/v1/listen?${deepgramParams}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'audio/*',
            'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`
          },
          body: readableStream,
          duplex: 'half' // Now recognized by our extended type
        },
        45000
      );
    } catch (error) {
      console.error('Deepgram API connection error:', error);
      throw new Error('Connection to transcription service failed. Please try again.');
    }

    if (!deepgramResponse.ok) {
      const error = await deepgramResponse.json();
      throw new Error(error.message || 'Transcription failed');
    }

    const result = await deepgramResponse.json();
    
    // Process response
    const transcription = result.results.channels[0].alternatives[0].transcript;
    const metadata = {
      duration: result.metadata.duration,
      wordCount: result.results.channels[0].alternatives[0].words?.length || 0,
      speakers: result.results.utterances?.length || 1,
    };

    // Database insertion
    const recordingId = crypto.randomUUID();
    await sql`
      INSERT INTO recordings (
        id, filename, file_size, file_type,
        duration, word_count, speaker_count, transcription
      ) VALUES (
        ${recordingId},
        ${file.name},
        ${file.size},
        ${file.type},
        ${metadata.duration},
        ${metadata.wordCount},
        ${metadata.speakers},
        ${transcription}
      )
    `;

    return NextResponse.json({
      transcription,
      metadata: {
        id: recordingId,
        duration: metadata.duration,
        wordCount: metadata.wordCount,
        speakers: metadata.speakers
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Processing failed' },
      { status: 500 }
    );
  }
}
