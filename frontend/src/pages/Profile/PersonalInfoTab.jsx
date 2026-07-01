import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { User, Edit3, Mail, Phone, Save } from "lucide-react"
import { toast } from "react-hot-toast"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import NeoInput from "../../components/common/Inputs/NeoInput"
import {
  updateProfileAsync,
  getProfileAsync,
} from "../../redux/slices/userSlice"

const PersonalInfoTab = () => {
  const dispatch = useDispatch()
  const { profile, loading } = useSelector((state) => state.user)

  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      })
    }
  }, [profile])

  const handleUpdateProfile = (e) => {
    e.preventDefault()
    dispatch(updateProfileAsync(personalInfo)).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Profile updated successfully!")
        setIsEditingPersonal(false)
        dispatch(getProfileAsync())
      } else {
        toast.error(action.payload || "Failed to update profile")
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4 ">
        <h3 className="text-white font-black text-2xl uppercase tracking-widest">
          Personal Information
        </h3>
        {!isEditingPersonal && (
          <BrutalistButton
            onClick={() => setIsEditingPersonal(true)}
            className="px-4 py-2 text-xs"
          >
            <Edit3 size={16} /> Edit Info
          </BrutalistButton>
        )}
      </div>

      {!isEditingPersonal ? (
        <div className="space-y-6 max-w-xl">
          <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-xl p-5 shadow-[4px_4px_0px_#000]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Full Name
            </label>
            <p className="text-white text-base font-medium">
              {profile?.name || "N/A"}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-xl p-5 shadow-[4px_4px_0px_#000]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Email Address
            </label>
            <p className="text-white text-base font-medium">
              {profile?.email || "N/A"}
            </p>
          </div>
          <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-xl p-5 shadow-[4px_4px_0px_#000]">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Phone Number
            </label>
            <p className="text-white text-base font-medium">
              {profile?.phone || "Not provided"}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
          <NeoInput
            label="Full Name"
            icon={User}
            type="text"
            value={personalInfo.name}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, name: e.target.value })
            }
            required
          />
          <NeoInput
            label="Email Address"
            icon={Mail}
            type="email"
            value={personalInfo.email}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, email: e.target.value })
            }
            required
          />
          <NeoInput
            label="Phone Number"
            icon={Phone}
            type="tel"
            value={personalInfo.phone}
            onChange={(e) =>
              setPersonalInfo({ ...personalInfo, phone: e.target.value })
            }
            placeholder="Enter phone number"
          />
          <div className="flex gap-4 mt-8">
            <BrutalistButton
              type="button"
              variant="secondary"
              className="px-6 py-3 text-xs"
              onClick={() => {
                setIsEditingPersonal(false)
                setPersonalInfo({
                  name: profile?.name || "",
                  email: profile?.email || "",
                  phone: profile?.phone || "",
                })
              }}
            >
              Cancel
            </BrutalistButton>
            <BrutalistButton
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3"
            >
              <Save size={18} />
              Save Changes
            </BrutalistButton>
          </div>
        </form>
      )}
    </motion.div>
  )
}

export default PersonalInfoTab
