import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

const ConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Are you sure?", 
    message = "Do you really want to perform this action?", 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    isDanger = true 
}) => {
    
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
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

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#111] border-2 border-gray-800 rounded-3xl w-full max-w-sm shadow-[8px_8px_0px_#000] relative flex flex-col"
                >
                    <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-[#0a0a0a] shrink-0 rounded-t-3xl">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? 'bg-red-500/20 text-red-500' : 'bg-[#ff007f]/20 text-[#ff007f]'}`}>
                                <AlertTriangle size={20} />
                            </div>
                            <h2 className="text-white font-black text-lg uppercase tracking-widest">{title}</h2>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 bg-[#1a1a1a] hover:bg-gray-800 text-gray-400 hover:text-white rounded-full transition-colors border border-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 flex-1">
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-4">
                            <button 
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] text-white hover:bg-gray-800 rounded-xl text-xs font-black uppercase tracking-widest transition-colors border border-gray-800"
                            >
                                {cancelText}
                            </button>
                            <button 
                                onClick={() => {
                                    onConfirm()
                                    onClose()
                                }}
                                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
                                    isDanger 
                                    ? 'bg-red-600 hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.4)]' 
                                    : 'bg-[#ff007f] hover:bg-[#e60073] shadow-[0_0_15px_rgba(255,0,127,0.4)]'
                                }`}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

export default ConfirmModal
