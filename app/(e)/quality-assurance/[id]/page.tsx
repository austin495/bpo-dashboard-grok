"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Clipboard, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Recordings } from "@/types";

export default function RecordingDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [recording, setRecording] = useState<Recordings | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchRecording = async () => {
        try {
          const response = await fetch(`/api/recordings/${id}`);
          if (!response.ok) throw new Error("Recording not found");
          const data: Recordings = await response.json();
          setRecording(data);
        } catch (error) {
          console.error("Error fetching recording:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchRecording();
    }, [id]);

  if (loading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-4">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!recording) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Recording not found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Recordings
        </Button>
        <h1 className="text-3xl font-bold">{recording.filename}</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="space-y-2">
          <DetailItem label="Duration" value={`${Math.round(recording.duration)} seconds`} />
          <DetailItem label="Word Count" value={recording.word_count} />
          <DetailItem label="Speakers" value={recording.speaker_count} />
          <DetailItem label="Date Uploaded" value={new Date(recording.created_at).toLocaleDateString()} />
        </div>
        <div className="space-y-2">
          <DetailItem label="File Type" value={recording.file_type} />
          <DetailItem label="File Size" value={`${(recording.file_size / 1024 / 1024).toFixed(2)} MB`} />
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-muted">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Transcription</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard.writeText(recording.transcription)}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copy
          </Button>
        </div>
        <pre className="whitespace-pre-wrap overflow-x-auto">
          {recording.transcription}
        </pre>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value?: string | number }) {
    return (
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">{label}:</span>
        <span className="font-medium">{value || '-'}</span>
      </div>
    );
  }  