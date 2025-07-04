'use client';

import { useState, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import Slider from '@mui/material/Slider';
import getCroppedImg from '@/utils/cropImage';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface BrandingTabProps {
  competition: any;
  setCompetition: (data: any) => void;
}

export default function BrandingTab({ competition, setCompetition }: BrandingTabProps) {
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropAndUpload = async () => {
    if (!tempImage || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);
    const compId = router.query.id as string;
    const storageRef = ref(storage, `competitionImages/${compId}.jpg`);
    await uploadBytes(storageRef, croppedBlob);

    const downloadURL = await getDownloadURL(storageRef);

    await updateDoc(doc(db, 'competitions', compId), {
      imageUrl: downloadURL,
    });

    setCompetition((prev: any) => ({
      ...prev,
      imageUrl: downloadURL,
    }));

    setShowCropModal(false);
    URL.revokeObjectURL(tempImage);
  };

  useEffect(() => {
    return () => {
      if (tempImage) URL.revokeObjectURL(tempImage);
    };
  }, [tempImage]);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Competition Branding Image</h3>

      {competition.imageUrl && (
        <img
          src={competition.imageUrl}
          alt="Competition Branding"
          className="mb-4 w-48 h-48 object-cover border border-[#222] rounded"
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Crop Modal */}
      {showCropModal && tempImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-[#111] p-6 rounded-lg w-[90%] max-w-md text-white relative">
            <h3 className="text-lg font-bold mb-4">Crop Image</h3>

            <div className="relative w-full h-64 bg-black">
              <Cropper
                image={tempImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            </div>

            <div className="mt-4">
              <Slider
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(_, value) => setZoom(value as number)}
                sx={{ color: '#00FF00' }}
              />
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => {
                  setShowCropModal(false);
                  URL.revokeObjectURL(tempImage);
                }}
                className="bg-gray-600 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCropAndUpload}
                className="bg-[#00FF00] text-black px-4 py-2 rounded font-bold"
              >
                Crop & Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


