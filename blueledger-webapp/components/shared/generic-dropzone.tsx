'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FolderInput } from 'lucide-react';

function getMimeLabels(accept: { [key: string]: string[] }): string {
  const mimeToLabel: Record<string, string> = {
    'image/jpeg': 'JPG',
    'image/png': 'PNG',
    'image/gif': 'GIF',
    'image/webp': 'WEBP',
  };

  const types = Object.keys(accept).map((mime) => {
    return mimeToLabel[mime] || mime.split('/')[1].toUpperCase();
  });

  if (types.length === 1) {
    return types[0];
  }

  if (types.length === 2) {
    return `${types[0]} and ${types[1]}`;
  }

  const last = types.pop();
  return `${types.join(', ')} and ${last}`;
}

type GenericDropzoneProps = {
  onDrop: (files: File[]) => void;
  accept?: { [key: string]: string[] }; // e.g. { 'image/*': [] }
  maxFiles?: number;
};

export default function GenericDropzone({
  onDrop,
  accept = { 'image/*': [] },
  maxFiles = 1,
}: GenericDropzoneProps) {
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null);
      if (acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    [onDrop]
  );

  const handleDropRejected = useCallback(() => {
    setError(`Only ${getMimeLabels(accept)} files are allowed.`);
  }, [accept]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles,
    onDropRejected: handleDropRejected,
  });

  return (
    <div className="flex flex-col h-full gap-4">
      {error && <p className="text-destructive">{error}</p>}
      <div
        {...getRootProps()}
        className="border border-dashed border-muted-foreground h-full rounded-md p-8 text-center cursor-pointer hover:border-foreground transition"
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center h-full gap-8">
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <p>Drag and drop or click to upload</p>
          )}
          <FolderInput className="w-16 h-16 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
