import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CornerDownLeft, AlertCircle, ImageIcon } from 'lucide-react'
import { uploadReturnImages } from '../../services/upload.service'

const REASONS = [
    "Damaged or defective item",
    "Received wrong item",
    "Size doesn't fit",
    "Other"
]

const ReturnReasonModal = ({ isOpen, onClose, onSubmit, paymentMethod }) => {
    const [selectedReason, setSelectedReason] = useState('')
    const [comments, setComments] = useState('')
    const [refundMethod, setRefundMethod] = useState('UPI')
    const [upiId, setUpiId] = useState('')
    const [bankDetails, setBankDetails] = useState({ accountNumber: '', ifscCode: '', accountHolderName: '' })
    const [error, setError] = useState('')
    const [images, setImages] = useState([]) // For preview
    const [imageFiles, setImageFiles] = useState([]) // Actual files
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setSelectedReason('')
            setComments('')
            setError('')
            setImages([])
            setImageFiles([])
            setIsSubmitting(false)
            document.body.style.overflow = 'hidden'
            if (window.lenis) window.lenis.stop()
        } else {
            document.body.style.overflow = 'unset'
            if (window.lenis) window.lenis.start()
        }
        return () => {
            document.body.style.overflow = 'unset'
            if (window.lenis) window.lenis.start()
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length === 0) return

        const currentCount = images.length
        const availableSlots = 5 - currentCount
        const filesToAdd = files.slice(0, availableSlots)

        if (files.length > availableSlots) {
            setError('You can only upload up to 5 images.')
        }

        filesToAdd.forEach(file => {
            setImageFiles(prev => [...prev, file])
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result])
            }
        })
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImageFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!selectedReason) {
            setError('Please select a reason for the return.')
            return
        }

        if (selectedReason === 'Other' && !comments.trim()) {
            setError('Please specify a reason in the text box.')
            return
        }

        const finalReason = selectedReason === 'Other' 
            ? `Other: ${comments}` 
            : selectedReason

        let finalImages = []
        if (imageFiles.length > 0) {
            setIsSubmitting(true)
            try {
                const formData = new FormData()
                imageFiles.forEach(file => {
                    formData.append('media', file)
                })
                const uploadRes = await uploadReturnImages(formData)
                finalImages = uploadRes.data.map(m => m.url)
            } catch (err) {
                setIsSubmitting(false)
                setError('Failed to upload images. Please try again.')
                return
            }
        }

        let returnData = { reason: finalReason, images: finalImages }

        if (paymentMethod === 'COD') {
            returnData.refundMethod = refundMethod
            if (refundMethod === 'UPI') {
                if (!upiId.trim()) {
                    setError('Please provide your UPI ID for the refund.')
                    setIsSubmitting(false)
                    return
                }
                returnData.upiId = upiId.trim()
            } else {
                if (!bankDetails.accountNumber.trim() || !bankDetails.ifscCode.trim() || !bankDetails.accountHolderName.trim()) {
                    setError('Please provide complete Bank Details for the refund.')
                    setIsSubmitting(false)
                    return
                }
                returnData.bankDetails = {
                    accountNumber: bankDetails.accountNumber.trim(),
                    ifscCode: bankDetails.ifscCode.trim(),
                    accountHolderName: bankDetails.accountHolderName.trim()
                }
            }
        }
        
        await onSubmit(returnData)
        setIsSubmitting(false)
        onClose()
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#111] border-2 border-gray-800 rounded-3xl w-full max-w-lg shadow-[8px_8px_0px_#000] relative flex flex-col max-h-[85vh] md:mt-24"
                >
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a] shrink-0 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center">
                                <CornerDownLeft size={20} />
                            </div>
                            <h2 className="text-white font-black text-xl uppercase tracking-widest">Request Return</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-[#1a1a1a] hover:bg-red-500 text-gray-400 hover:text-white rounded-full transition-colors border border-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div 
                        className="p-5 md:p-6 flex-1 overflow-y-auto custom-scrollbar" 
                        data-lenis-prevent="true"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        <p className="text-gray-400 text-sm mb-4">Please let us know why you are returning this item so we can improve your experience.</p>
                        
                        <div className="space-y-2 mb-5 pr-2">
                            {REASONS.map((reason) => (
                                <label 
                                    key={reason}
                                    className={`flex items-center gap-4 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                        selectedReason === reason 
                                        ? 'bg-[#ff007f]/10 border-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.2)]' 
                                        : 'bg-[#1a1a1a] border-gray-800 hover:border-gray-600'
                                    }`}
                                >
                                    <input 
                                        type="radio" 
                                        name="returnReason" 
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => {
                                            setSelectedReason(e.target.value);
                                            setError('');
                                        }}
                                        className="hidden"
                                    />
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                        selectedReason === reason ? 'border-[#ff007f]' : 'border-gray-500'
                                    }`}>
                                        {selectedReason === reason && <div className="w-2.5 h-2.5 rounded-full bg-[#ff007f]"></div>}
                                    </div>
                                    <span className={`font-bold ${selectedReason === reason ? 'text-white' : 'text-gray-400'}`}>
                                        {reason}
                                    </span>
                                </label>
                            ))}
                        </div>

                        <AnimatePresence>
                            {selectedReason === 'Other' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden mb-5"
                                >
                                    <label className="block text-[10px] font-bold text-[#ff007f] uppercase tracking-widest mb-2">
                                        Please specify your reason *
                                    </label>
                                    <textarea 
                                        value={comments}
                                        onChange={(e) => {
                                            setComments(e.target.value);
                                            setError('');
                                        }}
                                        className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors resize-none h-20 custom-scrollbar"
                                        placeholder="Tell us more about the issue..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Image Upload Section */}
                        <div className="mb-6">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                Proof of Damage / Issue (Optional, Max 5)
                            </label>
                            {images.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-3">
                                    <AnimatePresence>
                                        {images.map((img, idx) => (
                                            <motion.div 
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="relative w-16 h-16 rounded-lg overflow-hidden border border-gray-700 bg-black group"
                                            >
                                                <img src={img} alt="upload preview" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={10} />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                            {images.length < 5 && (
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white cursor-pointer transition-colors">
                                    <ImageIcon size={16} />
                                    <span>Upload Photos</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple 
                                        className="hidden" 
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>

                        {paymentMethod === 'COD' && (
                            <div className="mb-6 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                                    Refund Method (For COD Order)
                                </label>
                                <div className="flex gap-4 mb-4">
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 font-bold">
                                        <input 
                                            type="radio" 
                                            name="refundMethod" 
                                            value="UPI" 
                                            checked={refundMethod === 'UPI'} 
                                            onChange={(e) => setRefundMethod(e.target.value)}
                                            className="accent-[#ff007f]"
                                        />
                                        UPI
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 font-bold">
                                        <input 
                                            type="radio" 
                                            name="refundMethod" 
                                            value="Bank" 
                                            checked={refundMethod === 'Bank'} 
                                            onChange={(e) => setRefundMethod(e.target.value)}
                                            className="accent-[#ff007f]"
                                        />
                                        Bank Transfer
                                    </label>
                                </div>

                                {refundMethod === 'UPI' ? (
                                    <div>
                                        <input 
                                            type="text" 
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="Enter UPI ID (e.g., 9876543210@ybl)"
                                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <input 
                                            type="text" 
                                            value={bankDetails.accountHolderName}
                                            onChange={(e) => setBankDetails({...bankDetails, accountHolderName: e.target.value})}
                                            placeholder="Account Holder Name"
                                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                        />
                                        <input 
                                            type="text" 
                                            value={bankDetails.accountNumber}
                                            onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                            placeholder="Account Number"
                                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                        />
                                        <input 
                                            type="text" 
                                            value={bankDetails.ifscCode}
                                            onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                                            placeholder="IFSC Code"
                                            className="w-full bg-[#111] border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-[#ff007f] transition-colors text-sm"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm font-bold mb-5 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-6 py-3 bg-[#1a1a1a] text-white hover:bg-gray-800 rounded-xl font-black uppercase tracking-widest transition-colors border border-gray-800"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex-1 px-6 py-3 bg-[#ff007f] text-white hover:bg-[#e60073] rounded-xl font-black uppercase tracking-widest transition-colors shadow-[0_0_20px_rgba(255,0,127,0.4)] disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Return'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ReturnReasonModal
