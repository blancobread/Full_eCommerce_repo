import { useState } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import api from '../api/api';
import { Garland } from '../types/types';

interface Props {
  onUploaded: (garland: Garland) => void;
}

export default function UploadGarland({ onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    api
      .post('/garlands/upload', formData)
      .then((res) => {
        onUploaded(res.data); // Assuming backend returns a full Garland object
      })
      .catch((err) => {
        if (err.response) {
          console.error('Upload failed:', err.response.data);
          alert(`Upload failed: ${err.response.data.message}`);
        } else {
          console.error('Upload failed:', err.message);
          alert(`Upload failed: ${err.message}`);
        }
      })
      .finally(() => {
        setUploading(false);
      });
  };

  const dropzoneOptions: DropzoneOptions = {
    onDrop,
    multiple: false,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/gif': [],
    },
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className="border-2 border-dashed rounded p-4 text-center bg-gray-50 cursor-pointer"
    >
      <input {...getInputProps()} />
      {uploading ? (
        <p className="text-blue-500">Uploading...</p>
      ) : preview ? (
        <img
          src={preview}
          alt="Preview"
          className="mx-auto w-full max-w-xs rounded"
        />
      ) : isDragActive ? (
        <p>Drop the image here...</p>
      ) : (
        <p>Drag 'n' drop garland image here, or click to select</p>
      )}
    </div>
  );
}
