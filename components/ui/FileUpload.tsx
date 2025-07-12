'use client';

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

interface FileUploadProps {
  path: string; // e.g. "sponsorLogos/" or "profileImages/"
  onUpload: (url: string) => void;
  label?: string;
  accept?: string;
  buttonText?: string;
  className?: string;
}

export default function FileUpload({
  path,
  onUpload,
  label = 'Upload File',
  accept = 'image/*',
  buttonText = 'Choose File',
  className = '',
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const storageRef = ref(storage, `${path}/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onUpload(downloadURL);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm text-gray-300 block">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="text-sm text-white"
      />
      {uploading && <p className="text-gray-400 text-sm">Uploading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
