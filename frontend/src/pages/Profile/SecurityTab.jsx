import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import NeoInput from "../../components/common/Inputs/NeoInput"
import { changePasswordAsync } from "../../redux/slices/userSlice"

const SecurityTab = () => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.user)

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const handleChangePassword = (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!")
      return
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(passwords.newPassword)) {
      toast.error(
        "Password must contain at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.",
      )
      return
    }

    dispatch(
      changePasswordAsync({
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
      }),
    ).then((action) => {
      if (action.meta.requestStatus === "fulfilled") {
        toast.success("Password changed successfully!")
        setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" })
      } else {
        toast.error(action.payload || "Failed to change password")
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
      <h3 className="text-white font-black text-2xl uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
        Security Settings
      </h3>
      <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
        <NeoInput
          label="Current Password"
          icon={Lock}
          type={showOld ? "text" : "password"}
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="text-gray-400 hover:text-white transition-colors flex items-center h-full pt-0.5"
            >
              {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <NeoInput
          label="New Password"
          icon={Lock}
          type={showNew ? "text" : "password"}
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          required
          rightElement={
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="text-gray-400 hover:text-white transition-colors flex items-center h-full pt-0.5"
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <NeoInput
          label="Confirm New Password"
          icon={Lock}
          type="password"
          value={passwords.confirmPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, confirmPassword: e.target.value })
          }
          required
        />
        <BrutalistButton
          type="submit"
          disabled={loading}
          className="mt-4 w-full px-8 py-3"
        >
          <Lock size={18} />
          Update Password
        </BrutalistButton>
      </form>
    </motion.div>
  )
}

export default SecurityTab
