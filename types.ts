export type Recording = {
    id: string;
    filename: string;
    duration: number;
    word_count: number;
    speaker_count: number;
    created_at: string;
    transcription: string;
  };
  

  export type Recordings = {
    id: string;
    filename: string;
    duration: number;
    word_count: number;
    speaker_count: number;
    created_at: string;
    transcription: string;
    file_size: number;
    file_type: string;
  };