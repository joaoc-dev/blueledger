'use client';

import { useCallback, useState } from 'react';
import { FileRejection, useDropzone } from 'react-dropzone';
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
  maxFileSize?: number;
};

export default function GenericDropzone({
  onDrop,
  accept = { 'image/*': [] },
  maxFiles = 1,
  maxFileSize = 1024 * 1024 * 1,
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

  const handleDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      if (fileRejections.length > maxFiles) {
        setError(`Maximum number of files: ${maxFiles}`);
      } else if (fileRejections[0].errors[0].code === 'file-too-large') {
        setError(`File size must be less than ${maxFileSize / 1024 / 1024}MB`);
      } else if (fileRejections[0].errors[0].code === 'file-invalid-type') {
        setError(`File must be a ${getMimeLabels(accept)}`);
      } else {
        setError('Unknown error');
      }
    },
    [accept, maxFiles, maxFileSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    onDropRejected: handleDropRejected,
    accept,
    maxFiles,
    maxSize: maxFileSize,
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
