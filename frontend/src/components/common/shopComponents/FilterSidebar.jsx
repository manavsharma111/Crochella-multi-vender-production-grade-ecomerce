import { SlidersHorizontal, Check, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'

const FilterSidebar = ({ activeCategory, setActiveCategory, isMobileOpen, setIsMobileOpen, maxPrice, setMaxPrice, material, setMaterial, weaveType, setWeaveType }) => {
  const { filterOptions } = useSelector((state) => state.product)
  
  // Use filterOptions from Redux, fallback to defaults if not loaded
  const categories = filterOptions?.categories?.length ? ['All', ...filterOptions.categories.filter(c => c !== 'All')] : ['All', 'Men', 'Women', 'Kids', 'Dress of Indian Gods']
  const materials = filterOptions?.materials?.length ? filterOptions.materials : []
  const weaveTypes = filterOptions?.weaveTypes?.length ? filterOptions.weaveTypes : []

  const renderSidebarContent = (isMobile) => (
    <div className={`bg-[#050505] flex flex-col ${isMobile ? 'h-full border-r border-white/5 p-6 overflow-y-auto' : 'border border-white/5 p-6 rounded-xl'}`}>
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h3 className="text-[#FFFDD0] font-serif text-lg uppercase tracking-widest flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-[#FFFDD0]" /> Filters
        </h3>
        <button 
          className="lg:hidden p-2 text-gray-500 hover:text-[#FFFDD0] transition-colors"
          onClick={() => setIsMobileOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6 pr-2 pb-2">
      <div>
        <p className="text-[10px] font-serif text-gray-500 uppercase tracking-widest mb-3">Categories</p>
        <motion.div 
          className="space-y-2"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {categories.map((category) => (
            <motion.button
              variants={{
                hidden: { opacity: 0, x: -10 },
                visible: { opacity: 1, x: 0 }
              }}
              key={category}
              onClick={() => {
                setActiveCategory(category);
                if (window.innerWidth < 1024) setIsMobileOpen(false);
              }}
              className="w-full flex items-center justify-between group py-1"
            >
              <span className={`text-sm font-serif tracking-widest transition-all duration-300 ${activeCategory === category ? 'text-[#FFFDD0] translate-x-2' : 'text-gray-400 group-hover:text-white group-hover:translate-x-1'}`}>
                {category}
              </span>
              {activeCategory === category && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Check size={14} className="text-[#FFFDD0]" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div>
        <p className="text-[10px] font-serif text-gray-500 uppercase tracking-widest mb-3">Price Range (Up to)</p>
        <input 
          type="range" 
          min="0" 
          max="50000" 
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-[#ff007f] mb-2 cursor-pointer" 
        />
        <div className="flex justify-between text-xs text-gray-400 font-bold">
          <span>₹0</span>
          <span className="text-[#FFFDD0] font-serif">₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      <div className="pt-2">
        <p className="text-[10px] font-serif text-gray-500 uppercase tracking-widest mb-3">Material</p>
        <select 
          value={material} 
          onChange={(e) => setMaterial(e.target.value)}
          className="w-full bg-[#0a0a0a] text-sm text-gray-300 font-serif border border-white/10 rounded-md px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
        >
          <option value="">Any Material</option>
          {materials.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <p className="text-[10px] font-serif text-gray-500 uppercase tracking-widest mb-3">Weave Type</p>
        <select 
          value={weaveType} 
          onChange={(e) => setWeaveType(e.target.value)}
          className="w-full bg-[#0a0a0a] text-sm font-serif text-gray-300 border border-white/10 rounded-md px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer"
        >
          <option value="">Any Weave</option>
          {weaveTypes.map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/5 shrink-0">
        <button 
          onClick={() => {
            setActiveCategory('All');
            setMaxPrice(50000);
            setMaterial('');
            setWeaveType('');
            if (window.innerWidth < 1024) setIsMobileOpen(false);
          }}
          className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-400 hover:text-[#FFFDD0] border border-white/10 hover:border-white/30 px-4 py-3 text-xs font-serif uppercase tracking-widest transition-all hover:bg-white/5 rounded-md"
        >
          <X size={14} /> Clear Filters
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 sticky top-24 self-start z-20">
        {renderSidebarContent(false)}
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={() => setIsMobileOpen(false)}
            ></motion.div>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="relative w-4/5 max-w-sm h-full"
            >
              {renderSidebarContent(true)}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default FilterSidebar
