import { motion } from "framer-motion"

const LoadingScreen = ({ isPrimary, triggerExit }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-5xl md:text-7xl font-black text-white tracking-widest flex items-center mb-6 font-sans">
          <span>CROCHELL</span>
          <span className="text-gray-500 ml-1">[</span>
          <span className="text-[#ff007f] drop-shadow-[0_0_20px_rgba(255,0,127,1)]">
            A
          </span>
          <span className="text-gray-500">]</span>
        </div>

        {/* Thin Loading Bar */}
        <div className="w-64 md:w-80 h-[2px] bg-white/10 overflow-hidden relative">
          <motion.div
            className="absolute top-0 left-0 h-full bg-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.8)]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: [0.65, 0, 0.35, 1] }} // smooth easeInOut
            onAnimationComplete={() => {
              if (isPrimary && triggerExit) {
                triggerExit()
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
