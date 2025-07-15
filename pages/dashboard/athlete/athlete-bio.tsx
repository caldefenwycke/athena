// Full working athlete-bio.tsx regenerated from V5 with TS typing, cropper, and image upload logic

'use client';

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImageHelper';

interface BestLift {
  type: string;
  weight: string;
  unit: string;
  reps: string;
}

interface Sponsor {
  name: string;
  website: string;
  imageUrl: string;
}

interface BioData {
  aka: string;
  imageUrl: string;
  strangeFacts: string[];
  experience: number;
  favLifts: string[];
  bestLifts: BestLift[];
  familyPets: string[];
  sponsors: Sponsor[];
  extraInfo: string;
}

export default function AthleteBioPage() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<any>({});
  const [bioData, setBioData] = useState<BioData>({
    aka: '',
    imageUrl: '',
    strangeFacts: [''],
    experience: 1,
    favLifts: [''],
    bestLifts: [{ type: '', weight: '', unit: 'kg', reps: '' }],
    familyPets: [''],
    sponsors: [{ name: '', website: '', imageUrl: '' }],
    extraInfo: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<'profile' | number | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const parts = dob.split('/');
    if (parts.length !== 3) return '';
    const [day, month, year] = parts.map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setProfileData(docSnap.data());
    };
    const fetchBio = async () => {
      if (!user) return;
      const bioRef = doc(db, 'users', user.uid, 'private', 'bio');
      const docSnap = await getDoc(bioRef);
      if (docSnap.exists()) setBioData({ ...bioData, ...docSnap.data() });
    };
    fetchProfile();
    fetchBio();
  }, [user]);

  const handleAdd = (field: keyof BioData, template: any = '') => {
    setBioData({ ...bioData, [field]: [...bioData[field] as any[], template] });
  };

  const handleRemove = (field: keyof BioData, index: number) => {
    const updated = [...(bioData[field] as any[])];
    updated.splice(index, 1);
    setBioData({ ...bioData, [field]: updated });
  };

  const handleImageSelect = (e: any, target: 'profile' | number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setRawImage(reader.result as string);
        setUploadTarget(target);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_: any, croppedPixels: any) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const uploadCroppedImage = async () => {
    if (!user || !rawImage || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedFile = await getCroppedImg(rawImage, croppedAreaPixels);
      let imagePath = '';

      if (uploadTarget === 'profile') {
        imagePath = `athlete-bios/${user.uid}/profile.jpg`;
      } else if (typeof uploadTarget === 'number') {
        imagePath = `athlete-bios/${user.uid}/sponsor-${uploadTarget}.jpg`;
      }

      const imageRef = ref(storage, imagePath);
      await uploadBytes(imageRef, croppedFile);
      const url = await getDownloadURL(imageRef);

      if (uploadTarget === 'profile') {
        setBioData({ ...bioData, imageUrl: url });
      } else if (typeof uploadTarget === 'number') {
        const updated = [...bioData.sponsors];
        updated[uploadTarget].imageUrl = url;
        setBioData({ ...bioData, sponsors: updated });
      }

      setCropModalOpen(false);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const saveBio = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bioRef = doc(db, 'users', user.uid, 'private', 'bio');
      await setDoc(bioRef, bioData);
      alert('Saved ✅');
    } catch (err) {
      console.error(err);
      alert('Failed ❌');
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <h1 className="text-2xl text-white font-bold mb-4">Athlete Bio</h1>
        <p className="text-sm text-gray-400 mb-6">
          Name: {profileData.firstName} {profileData.lastName} | Age: {calculateAge(profileData.dob)} | Location: {profileData.area}, {profileData.country}
        </p>

        <div className="flex gap-6 mb-6">
          <div className="flex-1">
            <label className="block text-white mb-1">Stage Name (AKA)</label>
            <input
              type="text"
              value={bioData.aka}
              onChange={(e) => setBioData({ ...bioData, aka: e.target.value })}
              className="w-full bg-[#222] border border-[#333] px-3 py-2 text-white rounded"
            />

            <label className="block text-white mt-6 mb-1">Experience (Years)</label>
            <input
              type="number"
              value={bioData.experience}
              onChange={(e) => setBioData({ ...bioData, experience: parseInt(e.target.value) })}
              className="w-full bg-[#222] border border-[#333] px-3 py-2 text-white rounded"
            />

            <div className="mt-6">
              <div className="flex justify-between items-center">
                <label className="text-white">Family / Pets</label>
                <button className="text-green-400 text-xs" onClick={() => handleAdd('familyPets')}>+ Add</button>
              </div>
              {bioData.familyPets.map((_, idx) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <input
                    value={bioData.familyPets[idx]}
                    onChange={(e) => {
                      const updated = [...bioData.familyPets];
                      updated[idx] = e.target.value;
                      setBioData({ ...bioData, familyPets: updated });
                    }}
                    className="w-full bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                  />
                  <button onClick={() => handleRemove('familyPets', idx)} className="text-red-500">−</button>
                </div>
              ))}
            </div>
          </div>

          <div className="w-48">
            <img src={bioData.imageUrl || '/placeholder.png'} alt="Profile" className="rounded-full w-48 h-48 object-cover border border-gray-700" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageSelect(e, 'profile')}
              className="mt-2 text-sm text-white"
            />
          </div>
        </div>

        <button
          onClick={saveBio}
          className="bg-[#00FF00] hover:bg-[#00cc00] text-black font-semibold px-6 py-2 rounded mt-4"
        >Save</button>
      </div>

      <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 300, bgcolor: 'black', borderRadius: 2, p: 2 }}>
          <Cropper
            image={rawImage!}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
          <Slider
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(_, value) => setZoom(value as number)}
            sx={{ color: '#00FF00', mt: 2 }}
          />
          <button
            onClick={uploadCroppedImage}
            className="mt-4 w-full bg-[#00FF00] text-black py-2 px-4 rounded"
          >Crop & Upload</button>
        </Box>
      </Modal>
    </DashboardLayout>
  );
}
