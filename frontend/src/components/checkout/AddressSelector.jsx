import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Plus, Check, MapPin } from "lucide-react"
import {
  getDeliveryAddressAsync,
  addDeliveryAddressAsync,
} from "../../redux/slices/userSlice"
import NeoInput from "../common/Inputs/NeoInput"
import BrutalistButton from "../common/Buttons/BrutalistButton"
import toast from "react-hot-toast"

const AddressSelector = ({ selectedAddress, setSelectedAddress }) => {
  const dispatch = useDispatch()
  const { addresses, loading } = useSelector((state) => state.user)
  const { user } = useSelector((state) => state.auth)

  const [isAdding, setIsAdding] = useState(false)
  const [newAddress, setNewAddress] = useState({
    Area: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  })

  useEffect(() => {
    dispatch(getDeliveryAddressAsync())
  }, [dispatch])

  // Automatically select the first address if none is selected
  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0])
    }
  }, [addresses, selectedAddress, setSelectedAddress])

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      await dispatch(addDeliveryAddressAsync({ address: newAddress })).unwrap()
      toast.success("Address added successfully")
      setIsAdding(false)
      setNewAddress({
        Area: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      })
      dispatch(getDeliveryAddressAsync())
    } catch (error) {
      toast.error(error || "Failed to add address")
    }
  }

  return (
    <div className="bg-[#111] p-6 rounded-2xl border-2 border-gray-800">
      <h2 className="text-white font-black text-xl uppercase tracking-widest mb-6 flex items-center gap-2">
        <MapPin className="text-[#ff007f]" /> Delivery Address
      </h2>

      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading addresses...</div>
      ) : (
        <div className="space-y-4">
          {addresses?.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((addr, idx) => {
                const isSelected =
                  selectedAddress?._id === addr._id ||
                  selectedAddress?.Area === addr.Area
                return (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddress(addr)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? "border-[#ff007f] bg-[#ff007f]/5 shadow-[4px_4px_0px_#8b0045]"
                        : "border-gray-800 bg-[#0a0a0a] hover:border-gray-600"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#ff007f] bg-[#ff007f]" : "border-gray-600"}`}
                        >
                          {isSelected && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                        <span className="text-white font-bold">
                          {user?.name || "User"}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm ml-7 leading-relaxed">
                      {addr.Area}, {addr.city}
                      <br />
                      {addr.state} - {addr.pinCode}
                      <br />
                      {addr.country}
                    </p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">
              No saved addresses found.
            </p>
          )}

          {!isAdding ? (
            <button
              onClick={() => setIsAdding(true)}
              className="mt-4 flex items-center gap-2 text-[#ff007f] font-bold text-sm uppercase tracking-widest hover:text-white transition-colors"
            >
              <Plus size={18} /> Add New Address
            </button>
          ) : (
            <form
              onSubmit={handleAddAddress}
              className="mt-6 bg-[#0a0a0a] p-4 rounded-xl border-2 border-gray-800 space-y-4"
            >
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
                New Address
              </h3>

              <NeoInput
                label="Street Address / Area"
                value={newAddress.Area}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, Area: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <NeoInput
                  label="City"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  required
                />
                <NeoInput
                  label="State"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <NeoInput
                  label="PIN Code"
                  value={newAddress.pinCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pinCode: e.target.value })
                  }
                  required
                />
                <NeoInput
                  label="Country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <BrutalistButton type="submit" className="flex-1">
                  Save Address
                </BrutalistButton>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-6 py-2 border-2 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 font-bold uppercase tracking-widest transition-colors rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default AddressSelector
