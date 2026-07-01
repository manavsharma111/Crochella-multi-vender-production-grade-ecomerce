import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion } from "framer-motion"
import { MapPin, Plus, Building, Map, Hash, Globe } from "lucide-react"
import { toast } from "react-hot-toast"
import BrutalistButton from "../../components/common/Buttons/BrutalistButton"
import NeoInput from "../../components/common/Inputs/NeoInput"
import AddressCard from "../../components/common/Cards/AddressCard"
import {
  addDeliveryAddressAsync,
  updateDeliveryAddressAsync,
  deleteDeliveryAddressAsync,
  getDeliveryAddressAsync,
} from "../../redux/slices/userSlice"

const AddressesTab = () => {
  const dispatch = useDispatch()
  const { addresses } = useSelector((state) => state.user)

  const [isAddingAddress, setIsAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  })

  useEffect(() => {
    dispatch(getDeliveryAddressAsync())
  }, [dispatch])

  const handleAddAddress = (e) => {
    e.preventDefault()
    const { street, city, state, zip, country } = addressForm
    if (!street || !city || !state || !zip || !country) {
      toast.error("Please fill all address fields")
      return
    }

    const nameRegex = /^[a-zA-Z\s]+$/
    const pinRegex = /^[0-9]{6}$/

    if (street.length < 5) {
      toast.error("Street address is too short (min 5 chars)")
      return
    }
    if (!nameRegex.test(city)) {
      toast.error("City must contain only letters")
      return
    }
    if (!nameRegex.test(state)) {
      toast.error("State must contain only letters")
      return
    }
    if (!nameRegex.test(country)) {
      toast.error("Country must contain only letters")
      return
    }
    if (!pinRegex.test(zip)) {
      toast.error("ZIP/Pin Code must be exactly 6 digits")
      return
    }

    const addressObj = {
      ...(editingAddressId ? { _id: editingAddressId } : {}),
      Area: street,
      city: city,
      state: state,
      country: country,
      pinCode: zip,
    }

    if (editingAddressId) {
      const updatedList = addresses.map((a) =>
        a._id === editingAddressId ? addressObj : a,
      )
      dispatch(updateDeliveryAddressAsync({ address: updatedList })).then(
        (action) => {
          if (action.meta.requestStatus === "fulfilled") {
            toast.success("Address updated!")
            resetAddressForm()
          } else {
            toast.error("Failed to update address")
          }
        },
      )
    } else {
      dispatch(addDeliveryAddressAsync({ address: addressObj })).then(
        (action) => {
          if (action.meta.requestStatus === "fulfilled") {
            toast.success("Address added!")
            resetAddressForm()
          } else {
            toast.error("Failed to add address")
          }
        },
      )
    }
  }

  const resetAddressForm = () => {
    setAddressForm({ street: "", city: "", state: "", zip: "", country: "" })
    setIsAddingAddress(false)
    setEditingAddressId(null)
    dispatch(getDeliveryAddressAsync())
  }

  const handleEditClick = (address) => {
    setEditingAddressId(address._id)
    setAddressForm({
      street: address.Area || "",
      city: address.city || "",
      state: address.state || "",
      zip: address.pinCode || "",
      country: address.country || "",
    })
    setIsAddingAddress(true)
  }

  const handleDeleteAddress = (addressToDelete) => {
    const newAddressList = Array.isArray(addresses)
      ? addresses.filter((a) => a._id !== addressToDelete._id)
      : []
    dispatch(deleteDeliveryAddressAsync({ address: newAddressList })).then(
      (action) => {
        if (action.meta.requestStatus === "fulfilled") {
          toast.success("Address removed")
          dispatch(getDeliveryAddressAsync())
        }
      },
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 className="text-white font-black text-2xl uppercase tracking-widest">
          Delivery Addresses
        </h3>
        {!isAddingAddress && (
          <BrutalistButton
            onClick={() => {
              setEditingAddressId(null)
              setAddressForm({
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
              })
              setIsAddingAddress(true)
            }}
            className="px-4 py-2 text-xs"
          >
            <Plus size={16} /> Add New
          </BrutalistButton>
        )}
      </div>

      {isAddingAddress && (
        <form
          onSubmit={handleAddAddress}
          className="mb-8 p-6 bg-[#1a1a1a] border-2 border-gray-800 shadow-[6px_6px_0px_#000] rounded-2xl relative"
        >
          <h4 className="text-white font-black text-sm uppercase tracking-widest mb-6">
            {editingAddressId ? "Edit Address Details" : "New Address Details"}
          </h4>

          <div className="space-y-4">
            <NeoInput
              label="Street Address"
              icon={MapPin}
              type="text"
              value={addressForm.street}
              onChange={(e) =>
                setAddressForm({ ...addressForm, street: e.target.value })
              }
              placeholder="123 Luxury St, Apt 4B"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NeoInput
                label="City"
                icon={Building}
                type="text"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                placeholder="Beverly Hills"
                required
              />
              <NeoInput
                label="State / Province"
                icon={Map}
                type="text"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                placeholder="CA"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <NeoInput
                label="ZIP / Postal Code"
                icon={Hash}
                type="text"
                value={addressForm.zip}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, zip: e.target.value })
                }
                placeholder="90210"
                required
              />
              <NeoInput
                label="Country"
                icon={Globe}
                type="text"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
                placeholder="India"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-8">
            <BrutalistButton
              type="button"
              variant="secondary"
              onClick={resetAddressForm}
              className="px-6 py-2 text-xs"
            >
              Cancel
            </BrutalistButton>
            <BrutalistButton type="submit" className="px-8 py-2 text-xs">
              {editingAddressId ? "Update Address" : "Save Address"}
            </BrutalistButton>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {Array.isArray(addresses) && addresses.length > 0
          ? addresses.map((address, index) => (
              <AddressCard
                key={index}
                address={address}
                onEdit={handleEditClick}
                onDelete={handleDeleteAddress}
              />
            ))
          : !isAddingAddress && (
              <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-2xl">
                <MapPin size={40} className="mx-auto text-gray-600 mb-3" />
                <p className="text-gray-400 text-sm">
                  No delivery addresses saved yet.
                </p>
              </div>
            )}
      </div>
    </motion.div>
  )
}

export default AddressesTab
