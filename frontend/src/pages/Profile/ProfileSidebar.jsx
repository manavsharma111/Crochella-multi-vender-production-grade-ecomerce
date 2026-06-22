import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Lock, MapPin, Edit3, Bell, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { updateProfileAsync, getProfileAsync } from '../../redux/slices/userSlice';

const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell }
];

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    e.target.value = null; // clear input to allow selecting the same file again
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(updateProfileAsync({ profileImage: reader.result })).then((action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            toast.success("Profile picture updated!");
            dispatch(getProfileAsync());
          } else {
            toast.error("Failed to update profile picture");
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-[#111] border-2 border-gray-800 rounded-3xl p-5 md:p-6 shadow-[8px_8px_0px_#000] md:sticky md:top-32 relative overflow-hidden">
        {/* Top curved colored banner inspiration from images */}
        <div className="absolute top-0 left-0 w-full h-24 bg-[#ff007f] border-b-2 border-black rounded-b-4xl z-0 opacity-20 md:opacity-10"></div>
        
        <div className="flex flex-col items-center mb-6 md:mb-8 relative z-10 pt-2">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-[#1a1a1a] border-2 border-gray-800 shadow-[4px_4px_0px_#000] rounded-full flex items-center justify-center mb-3 md:mb-4 overflow-hidden z-10 relative">
              {profile?.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={36} className="text-white/80 md:w-10 md:h-10" />
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 md:bottom-4 right-0 bg-[#ff007f] p-1.5 md:p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_#8b0045] text-white hover:scale-110 transition-transform z-20" 
              title="Edit Profile Picture"
            >
               <Edit3 size={14} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleProfileImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
          <h2 className="text-white font-black text-lg md:text-xl tracking-widest text-center mt-1">{profile?.name || 'Loading...'}</h2>
          <p className="text-gray-400 text-[10px] md:text-xs mt-1 text-center bg-[#1a1a1a] px-3 py-1 rounded-full border border-gray-800">{profile?.email}</p>
        </div>

        <nav className="flex flex-row md:flex-col gap-2 md:gap-5 overflow-x-auto pr-1 pb-2 md:pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar:none] w-full snap-x">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`snap-center flex-1 min-w-[105px] flex flex-col md:flex-row items-center justify-center md:justify-start gap-1.5 md:gap-3 px-2 md:px-5 py-3 rounded-xl transition-all font-bold text-[9px] md:text-sm uppercase tracking-wider ${
                  isActive 
                    ? 'bg-[#ff007f] text-white border-2 border-black shadow-[2px_2px_0px_#8b0045] md:shadow-[4px_4px_0px_#8b0045] z-10 relative' 
                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border-2 border-gray-800 hover:border-gray-600 shadow-[2px_2px_0px_#000] md:shadow-[4px_4px_0px_#000] hover:translate-x-1px hover:translate-y-1px md:hover:translate-x-[2px] md:hover:translate-y-[2px] hover:shadow-[1px_1px_0px_#000]'
                }`}
              >
                <Icon size={18} className="md:w-[18px] md:h-[18px] mb-0.5 md:mb-0 shrink-0" />
                <span className="text-center md:text-left leading-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ProfileSidebar;
