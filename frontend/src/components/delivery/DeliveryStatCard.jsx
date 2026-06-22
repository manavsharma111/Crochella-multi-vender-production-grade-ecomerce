import React from 'react'
import { motion } from 'framer-motion'
import TiltCard from '../common/animation/Tilt'

const DeliveryStatCard = ({ title, value, icon: Icon, color, subtitle, delay = 0 }) => {
    // Generate static random heights for the fake sparkline so it doesn't flicker on re-render
    const [bars] = React.useState(() => Array.from({ length: 15 }, () => Math.random() * 100));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="h-full"
        >
            <TiltCard className="bg-linear-to-br from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300 h-full w-full">
                <div className={`absolute -right-12 -top-12 w-40 h-40 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
                <div className="flex justify-between items-start z-10 relative">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-white text-3xl md:text-4xl font-black tracking-tight">{value}</h3>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2 truncate">{title}</p>
                        {subtitle && <p className="text-gray-600 text-[10px] uppercase font-bold tracking-wider mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl border border-${color}-500/20 shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:shadow-${color}-500/20 group-hover:-translate-y-1 transition-all duration-300 ml-3 shrink-0`}>
                        <Icon size={24} strokeWidth={2.5} />
                    </div>
                </div>
                {/* Fake sparkline chart for aesthetics */}
                <div className="mt-6 flex items-end gap-1.5 h-8 z-10 relative opacity-40 group-hover:opacity-80 transition-opacity duration-300">
                    {bars.map((height, i) => (
                        <div key={i} className={`flex-1 bg-${color}-500/60 rounded-t-md hover:bg-${color}-400 transition-colors cursor-pointer`} style={{ height: `${height}%` }}></div>
                    ))}
                </div>
            </TiltCard>
        </motion.div>
    )
}

export default DeliveryStatCard
