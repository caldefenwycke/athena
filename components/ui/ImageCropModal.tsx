'use client';

import { useState, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImageHelper'; // ✅ Helper function you should already have from Athlete Bio cropping

interface ImageCropModalProps {
  imageFile: File;
  aspectRatio: number;
  onComplete: (croppedFile: File) => void;
  onClose: () => void;
}

export default function ImageCropModal({ imageFile, aspectRatio, onComplete, onClose }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const imageUrl = URL.createObjectURL(imageFile);

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    const croppedBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
    const croppedFile = new File([croppedBlob], imageFile.name, { type: 'image/png' });
    onComplete(croppedFile);
  };

  useEffect(() => {
    return () => URL.revokeObjectURL(imageUrl);
  }, [imageUrl]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-[#111] p-6 rounded-lg w-[90%] max-w-md text-white relative">
        <h3 className="text-lg font-bold mb-4">Crop Image</h3>

        <div className="relative w-full h-64 bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleDone} className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold">Crop & Upload</button>
        </div>
      </div>
    </div>
  );
}