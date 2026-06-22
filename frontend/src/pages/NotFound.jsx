import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ff007f]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        
        {/* Subtle Glitch / Animated Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 select-none">
            404
          </h1>
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-[#ff007f] to-purple-600 blur-2xl -z-10 opacity-20"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-wide mt-6 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm uppercase tracking-widest rounded-xl transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#ff007f] hover:bg-[#ff007f]/90 text-white font-semibold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(255,0,127,0.3)] hover:shadow-[0_0_30px_rgba(255,0,127,0.5)] transition-all group"
          >
            <Home size={16} className="group-hover:scale-110 transition-transform" />
            Return Home
          </button>
        </motion.div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-white/20" />
      <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-[#ff007f]/30" />
      <div className="absolute top-1/4 right-1/4 w-1 h-1 rounded-full bg-white/40" />

    </div>
  );
};

export default NotFound;
