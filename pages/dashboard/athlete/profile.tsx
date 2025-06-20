import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function ProfilePage() {
  const userProfile = {
    name: 'Not set',
    age: 'Not set',
    town: 'Not set',
    country: 'Not set',
    mobile: 'Not set',
    dob: 'Not set',
    street: 'Not set',
    area: 'Not set',
    postCode: 'Not set',
    email: 'c.j.page@icloud.com',
  };

  return (
    <DashboardLayout>
      <div className="bg-[#111] border border-[#1A1A1A] rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Profile Details</h2>
          <button className="bg-[#00FF00] hover:bg-[#00dd00] text-black font-bold px-4 py-1 rounded">
            Edit
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
          <div>
            <p className="text-[#00FF00] font-medium">Name</p>
            <p className="text-white">{userProfile.name}</p>
          </div>
          <div>
            <p className="text-[#00FF00] font-medium">Date of Birth</p>
            <p className="text-white">{userProfile.dob}</p>
          </div>

          <div>
            <p className="text-[#00FF00] font-medium">Age</p>
            <p className="text-white">{userProfile.age}</p>
          </div>
          <div>
            <p className="text-[#00FF00] font-medium">Street</p>
            <p className="text-white">{userProfile.street}</p>
          </div>

          <div>
            <p className="text-[#00FF00] font-medium">Town</p>
            <p className="text-white">{userProfile.town}</p>
          </div>
          <div>
            <p className="text-[#00FF00] font-medium">Area</p>
            <p className="text-white">{userProfile.area}</p>
          </div>

          <div>
            <p className="text-[#00FF00] font-medium">Country</p>
            <p className="text-white">{userProfile.country}</p>
          </div>
          <div>
            <p className="text-[#00FF00] font-medium">Post Code</p>
            <p className="text-white">{userProfile.postCode}</p>
          </div>

          <div>
            <p className="text-[#00FF00] font-medium">Mobile Number</p>
            <p className="text-white">{userProfile.mobile}</p>
          </div>
          <div>
            <p className="text-[#00FF00] font-medium">Email</p>
            <p className="text-white">{userProfile.email}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
