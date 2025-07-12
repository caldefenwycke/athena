import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/components/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImage';

export default function AthleteBioPage() {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState<any>({});
  const [bioData, setBioData] = useState<any>({
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
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const fetchProfile = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setProfileData(docSnap.data());
  };

  const fetchBio = async () => {
    if (!user) return;
    const bioRef = doc(db, 'users', user.uid, 'private', 'bio');
    const docSnap = await getDoc(bioRef);
    if (docSnap.exists()) setBioData({ ...bioData, ...docSnap.data() });
  };

  useEffect(() => {
    fetchProfile();
    fetchBio();
  }, [user]);

  const handleAdd = (field: string, template: any = '') => {
    setBioData({ ...bioData, [field]: [...bioData[field], template] });
  };

  const handleRemove = (field: string, index: number) => {
    const updated = [...bioData[field]];
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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const renderTextField = (field: string, idx: number) => (
    <div key={idx} className="flex gap-2 mb-2">
      <input
        value={bioData[field][idx]}
        onChange={(e) => {
          const updated = [...bioData[field]];
          updated[idx] = e.target.value;
          setBioData({ ...bioData, [field]: updated });
        }}
        className="w-full bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
      />
      <button onClick={() => handleRemove(field, idx)} className="text-red-500">−</button>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="relative bg-[#111] border border-[#1A1A1A] rounded-lg p-6 text-sm text-white">
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="border-t-4 border-[#00FF00] border-solid rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Header + Edit/Save Toggle */}
        <div className="flex justify-between items-center mb-6 pt-2">
          <h2 className="text-2xl font-bold text-white">Athlete Bio</h2>
          <button
            onClick={() => {
              if (isEditing) {
                saveBio();
                setIsEditing(false);
              } else {
                setIsEditing(true);
              }
            }}
            className="bg-[#00FF00] hover:bg-[#00dd00] text-black font-bold px-4 py-1 rounded"
            disabled={loading}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>

        {/* Profile Info */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6 mb-6">
            <div className="space-y-3">
              <div>
                <p className="text-[#00FF00] font-medium">Name</p>
                <p>{profileData.firstName} {profileData.lastName}</p>
              </div>
              <div>
                <p className="text-[#00FF00] font-medium">Age</p>
                <p>{calculateAge(profileData.dob)}</p>
              </div>
              <div>
                <p className="text-[#00FF00] font-medium">Area</p>
                <p>{profileData.addressArea}</p>
              </div>
              <div>
                <p className="text-[#00FF00] font-medium">Country</p>
                <p>{profileData.addressCountry}</p>
              </div>
            </div>
            <div className="w-px bg-gray-700 h-full"></div>
            <div className="flex flex-col items-center">
              {bioData.imageUrl ? (
                <img src={bioData.imageUrl} alt="Profile" className="w-32 h-32 object-cover rounded mb-2" />
              ) : (
                <div className="w-32 h-32 bg-gray-700 border border-[#333] rounded mb-2 flex items-center justify-center text-gray-400 text-xs">
                  No Profile Image
                </div>
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, 'profile')}
                  disabled={loading}
                />
              )}
            </div>
          </div>
        </section>
        {/* Bio Fields */}
        <section>
          {/* AKA */}
          <label className="text-[#00FF00] font-medium block mb-1">A.K.A / Stage Name</label>
          {isEditing ? (
            <input
              value={bioData.aka}
              onChange={(e) => setBioData({ ...bioData, aka: e.target.value })}
              className="w-full bg-[#222] border border-[#333] px-2 py-1 mb-4 rounded text-white"
            />
          ) : (
            <p className="mb-4">{bioData.aka || 'Not set'}</p>
          )}

          {/* Family / Pets */}
          <label className="text-[#00FF00] font-medium block mb-1">Family / Pets</label>
          {bioData.familyPets.length === 0 && !isEditing && <p className="mb-2">None</p>}
          {bioData.familyPets.map((item: any, idx: number) =>
            isEditing ? (
              renderTextField('familyPets', idx)
            ) : (
              <p key={idx} className="mb-1">• {item}</p>
            )
          )}
          {isEditing && (
            <button onClick={() => handleAdd('familyPets')} className="text-[#00FF00] text-sm mb-4">
              + Add
            </button>
          )}

          {/* Strange Facts */}
          <label className="text-[#00FF00] font-medium block mb-1">Strange Facts</label>
          {bioData.strangeFacts.length === 0 && !isEditing && <p className="mb-2">None</p>}
          {bioData.strangeFacts.map((fact: any, idx: number) =>
            isEditing ? (
              renderTextField('strangeFacts', idx)
            ) : (
              <p key={idx} className="mb-1">• {fact}</p>
            )
          )}
          {isEditing && (
            <button onClick={() => handleAdd('strangeFacts')} className="text-[#00FF00] text-sm mb-4">
              + Add
            </button>
          )}

          {/* Experience */}
          <label className="text-[#00FF00] font-medium block mb-1">Experience (Years)</label>
          {isEditing ? (
            <input
              type="number"
              min={0}
              value={bioData.experience}
              onChange={(e) => setBioData({ ...bioData, experience: Number(e.target.value) })}
              className="w-full bg-[#222] border border-[#333] px-2 py-1 mb-4 rounded text-white"
            />
          ) : (
            <p className="mb-4">{bioData.experience || 'Not set'}</p>
          )}

          {/* Favourite Lifts */}
          <label className="text-[#00FF00] font-medium block mb-1">Favourite Lifts</label>
          {bioData.favLifts.length === 0 && !isEditing && <p className="mb-2">None</p>}
          {bioData.favLifts.map((lift: any, idx: number) =>
            isEditing ? (
              renderTextField('favLifts', idx)
            ) : (
              <p key={idx} className="mb-1">• {lift}</p>
            )
          )}
          {isEditing && (
            <button onClick={() => handleAdd('favLifts')} className="text-[#00FF00] text-sm mb-4">
              + Add
            </button>
          )}

          {/* Personal Best Lifts */}
          <label className="text-[#00FF00] font-medium block mb-2">Personal Best Lifts</label>
          {bioData.bestLifts.length === 0 && !isEditing && <p className="mb-2">None</p>}
          {bioData.bestLifts.map((lift: any, idx: number) =>
            isEditing ? (
              <div key={idx} className="flex flex-wrap gap-2 mb-2">
                <input
                  placeholder="Type"
                  value={lift.type}
                  onChange={(e) => {
                    const updated = [...bioData.bestLifts];
                    updated[idx].type = e.target.value;
                    setBioData({ ...bioData, bestLifts: updated });
                  }}
                  className="basis-[30%] bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                />
                <input
                  placeholder="Weight"
                  value={lift.weight}
                  onChange={(e) => {
                    const updated = [...bioData.bestLifts];
                    updated[idx].weight = e.target.value;
                    setBioData({ ...bioData, bestLifts: updated });
                  }}
                  className="basis-[20%] bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                />
                <select
                  value={lift.unit}
                  onChange={(e) => {
                    const updated = [...bioData.bestLifts];
                    updated[idx].unit = e.target.value;
                    setBioData({ ...bioData, bestLifts: updated });
                  }}
                  className="basis-[15%] bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
                <input
                  placeholder="Reps"
                  value={lift.reps}
                  onChange={(e) => {
                    const updated = [...bioData.bestLifts];
                    updated[idx].reps = e.target.value;
                    setBioData({ ...bioData, bestLifts: updated });
                  }}
                  className="basis-[20%] bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                />
                <button
                  onClick={() => handleRemove('bestLifts', idx)}
                  className="text-red-500"
                >
                  −
                </button>
              </div>
            ) : (
              <p key={idx} className="mb-1">• {lift.type} – {lift.weight}{lift.unit} x {lift.reps} reps</p>
            )
          )}
          {isEditing && (
            <button
              onClick={() =>
                handleAdd('bestLifts', { type: '', weight: '', unit: 'kg', reps: '' })
              }
              className="text-[#00FF00] text-sm mt-2"
            >
              + Add
            </button>
          )}

          {/* Extra Info */}
          <label className="text-[#00FF00] font-medium mt-4 block">Extra Info</label>
          {isEditing ? (
            <textarea
              value={bioData.extraInfo}
              onChange={(e) => setBioData({ ...bioData, extraInfo: e.target.value })}
              rows={4}
              className="w-full bg-[#222] border border-[#333] px-3 py-2 rounded text-white"
            />
          ) : (
            <p className="mb-4">{bioData.extraInfo || 'None'}</p>
          )}
        </section>
        {/* Sponsors */}
        <h3 className="text-[#00FF00] font-semibold mt-6 mb-2">Sponsors</h3>
        {bioData.sponsors.length === 0 && !isEditing && <p className="mb-2">None</p>}
        {bioData.sponsors.map((sponsor: any, idx: number) => (
          <div key={idx} className="grid grid-cols-[1fr_1px_1fr] gap-4 mb-4 items-start">
            <div className="space-y-2">
              {isEditing ? (
                <>
                  <input
                    value={sponsor.name}
                    onChange={(e) => {
                      const updated = [...bioData.sponsors];
                      updated[idx].name = e.target.value;
                      setBioData({ ...bioData, sponsors: updated });
                    }}
                    placeholder="Sponsor Name"
                    className="w-full bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                  />
                  <input
                    value={sponsor.website || ''}
                    onChange={(e) => {
                      const updated = [...bioData.sponsors];
                      updated[idx].website = e.target.value;
                      setBioData({ ...bioData, sponsors: updated });
                    }}
                    placeholder="Sponsor Website"
                    className="w-full bg-[#222] border border-[#333] px-2 py-1 text-sm rounded text-white"
                  />
                  <button
                    onClick={() => handleRemove('sponsors', idx)}
                    className="text-red-500 text-sm"
                  >
                    − Remove Sponsor
                  </button>
                </>
              ) : (
                <>
                  <p><strong>Name:</strong> {sponsor.name || 'Not set'}</p>
                  <p><strong>Website:</strong> {sponsor.website || 'Not set'}</p>
                </>
              )}
            </div>

            <div className="w-px bg-gray-700 h-full"></div>

            <div className="flex flex-col items-center">
              {sponsor.imageUrl ? (
                <img
                  src={sponsor.imageUrl}
                  alt="Sponsor Logo"
                  className="w-16 h-16 object-cover rounded mb-2"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 border border-[#333] rounded mb-2 flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, idx)}
                  disabled={loading}
                />
              )}
            </div>
          </div>
        ))}
        {isEditing && (
          <button
            onClick={() => handleAdd('sponsors', { name: '', website: '', imageUrl: '' })}
            className="text-[#00FF00] text-sm"
          >
            + Add Sponsor
          </button>
        )}

        {/* Competition Summary */}
        <section>
          <h3 className="text-[#00FF00] font-semibold mt-8 mb-2">Competition Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div className="bg-[#222] p-4 rounded border border-[#333]">
              <p className="text-[#00FF00]">Total Competitions</p>
              <p>Coming soon...</p>
            </div>
            <div className="bg-[#222] p-4 rounded border border-[#333]">
              <p className="text-[#00FF00]">Average Score</p>
              <p>Coming soon...</p>
            </div>
          </div>
          <div className="bg-[#222] p-4 rounded border border-[#333] mb-4">
            <p className="text-[#00FF00]">Top Performance Highlights</p>
            <ul className="list-disc list-inside text-white">
              <li>Coming soon...</li>
            </ul>
          </div>
          <div className="bg-[#222] p-4 rounded border border-[#333]">
            <p className="text-[#00FF00]">Upcoming Competitions</p>
            <p>Coming soon...</p>
          </div>
        </section>

        {/* Image Crop Modal */}
        <Modal open={cropModalOpen} onClose={() => setCropModalOpen(false)}>
          <Box className="absolute top-1/2 left-1/2 w-[90vw] max-w-[400px] bg-black p-4 rounded-lg shadow-xl transform -translate-x-1/2 -translate-y-1/2 space-y-4">
            <div className="relative w-full h-[300px] bg-black rounded overflow-hidden">
              <Cropper
                image={rawImage!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(Number(value))}
              className="text-[#00FF00]"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setCropModalOpen(false)}
                className="text-white px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={uploadCroppedImage}
                className="bg-[#00FF00] text-black font-bold px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? (
                  <div className="border-t-4 border-black border-solid rounded-full w-4 h-4 animate-spin mx-auto"></div>
                ) : (
                  'Crop & Upload'
                )}
              </button>
            </div>
          </Box>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
