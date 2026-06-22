import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, KeyRound, CheckCircle } from 'lucide-react'

const OtpPromptModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
    const [otp, setOtp] = useState('')

    useEffect(() => {
        if (isOpen) {
            setOtp('')
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        if (otp.length === 4) {
            onSubmit(otp)
        }
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                />
                
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#111] border border-gray-800 rounded-3xl w-full max-w-sm relative z-10 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#ff007f]/20 flex items-center justify-center text-[#ff007f]">
                                <KeyRound size={20} />
                            </div>
                            <h2 className="text-white font-black text-xl uppercase tracking-widest">Enter OTP</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <p className="text-gray-400 text-sm mb-6 text-center">
                            Please ask the customer for the 4-digit Secret Delivery OTP to complete this action.
                        </p>
                        
                        <div className="mb-6">
                            <input 
                                type="text"
                                maxLength="4"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full bg-[#1a1a1a] border-2 border-gray-800 rounded-2xl px-6 py-4 text-center text-4xl font-black text-white tracking-[0.5em] focus:outline-none focus:border-[#ff007f] transition-colors placeholder-gray-800"
                                placeholder="0000"
                                required
                                autoFocus
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={otp.length !== 4 || isSubmitting}
                            className="w-full bg-[#ff007f] hover:bg-[#e60073] disabled:opacity-50 disabled:hover:bg-[#ff007f] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,0,127,0.3)] flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircle size={20} />
                                    Verify & Complete
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default OtpPromptModal
