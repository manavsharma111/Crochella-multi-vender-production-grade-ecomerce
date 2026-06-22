import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import ProfileSidebar from './ProfileSidebar';
import PersonalInfoTab from './PersonalInfoTab';
import SecurityTab from './SecurityTab';
import AddressesTab from './AddressesTab';
import NotificationsTab from './NotificationsTab';
import OrdersTab from '../../components/profileOrderSection/OrdersTab';
import HandloomBackground from '../../components/common/HandloomBackground';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="min-h-screen pt-32 pb-32 px-4 md:px-8 z-10 relative">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <div className="flex-1">
          <HandloomBackground />
          <div className="bg-[#111] border-2 border-gray-800 rounded-3xl p-6 md:p-8 shadow-[8px_8px_0px_#000] min-h-[500px]">
            <AnimatePresence mode="wait">
              {activeTab === 'personal' && <PersonalInfoTab key="personal" />}
              {activeTab === 'orders' && <OrdersTab key="orders" />}
              {activeTab === 'security' && <SecurityTab key="security" />}
              {activeTab === 'addresses' && <AddressesTab key="addresses" />}
              {activeTab === 'notifications' && <NotificationsTab key="notifications" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
