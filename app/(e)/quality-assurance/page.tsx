"use client";
import { useState, useCallback, useEffect } from "react";
import { Plus, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDropzone } from "react-dropzone";
import { RecordingsTable } from "@/components/recording-table";

interface Recording {
  id: string;
  filename: string;
  duration: number;
  word_count: number;
  speaker_count: number;
  created_at: string;
  transcription: string;
}

export default function QualityAssurance() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [processingState, setProcessingState] = useState<{
    loading: boolean;
    progress: number;
  }>({ loading: false, progress: 0 });

  // Fetch recordings on mount
  useEffect(() => {
    const fetchRecordings = async () => {
      try {
        const response = await fetch("/api/recordings");
        const data = await response.json();
        setRecordings(data);
      } catch (error) {
        console.error("Error fetching recordings:", error);
      } finally {
      }
    };
    fetchRecordings();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
      }
    }, []),
    accept: { 
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'video/*': ['.mp4', '.mov', '.avi'] 
    },
    multiple: false,
    maxSize: 500 * 1024 * 1024,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    setProcessingState({ loading: true, progress: 0 });
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const progress = text.match(/PROGRESS:(\d+)/)?.[1];
        if (progress) {
          setProcessingState(prev => ({ ...prev, progress: parseInt(progress) }));
        } else {
          result += text;
        }
      }

      const data = JSON.parse(result);
      if (data.error) throw new Error(data.error);
      
      setTranscription(data.transcription);
      // Refresh recordings after upload
      const recordingsResponse = await fetch("/api/recordings");
      const newRecordings = await recordingsResponse.json();
      setRecordings(newRecordings);
    } catch (error) {
      console.error("Upload error:", error);
      setTranscription(`Error: ${
        error instanceof Error ? error.message : 'Unknown error occurred'
      }`);
    } finally {
      setProcessingState({ loading: false, progress: 0 });
    }
  };

  return (
    <div className="w-full py-5 px-[4rem] flex flex-col space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl font-semibold">Quality Assurance</h1>
          <p className="text-muted-foreground text-sm">Upload and manage recordings</p>
        </div>
        <div className="flex flex-col justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>
                <Plus /> Upload recording
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
              <AlertDialogHeader>
                <AlertDialogTitle>Upload Recording</AlertDialogTitle>
                <AlertDialogDescription>
                  Supported formats: MP3, WAV, MP4, MOV (Max 500MB)
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 text-center cursor-pointer 
                  ${isDragActive ? 'border-primary bg-muted' : 'border-muted'}`}
              >
                <input {...getInputProps()} />
                {selectedFile ? (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {isDragActive ? 'Drop file here' : 'Drag & drop or click to select'}
                  </p>
                )}
              </div>

              {processingState.loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{processingState.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${processingState.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {transcription && (
                <div className="mt-4 p-4 border rounded-lg bg-muted">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Transcription</h3>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(transcription)}
                    >
                      <Clipboard className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="text-sm whitespace-pre-wrap">{transcription}</pre>
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel disabled={processingState.loading}>
                  Cancel
                </AlertDialogCancel>
                <Button 
                  onClick={handleUpload} 
                  disabled={!selectedFile || processingState.loading}
                >
                  {processingState.loading ? (
                    <span>Processing ({processingState.progress}%)</span>
                  ) : 'Upload & Transcribe'}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-8">
        <RecordingsTable data={recordings} />
      </div>
    </div>
  );
}