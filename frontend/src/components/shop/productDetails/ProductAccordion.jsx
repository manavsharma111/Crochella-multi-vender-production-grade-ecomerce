import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import Hover from '../../common/animation/Hover'

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-gray-800">
      <Hover fillColor="#ff007f" className="w-full">
        <button 
          onClick={onToggle}
          className="w-full flex items-center justify-between py-6 group"
        >
          <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-slate-400' : 'text-white group-hover:text-gray-300'}`}>
            {title}
          </span>
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-slate-400' : 'text-gray-500 group-hover:text-white'}`}>
            {isOpen ? <Minus size={18} /> : <Plus size={18} />}
          </span>
        </button>
      </Hover>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-sm text-gray-400 leading-relaxed font-medium">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const ProductAccordion = ({ product }) => {
  const [openIndex, setOpenIndex] = useState(-1)

  if (!product) return null

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx)
  }

  const accordionData = [
    {
      title: "Product Description",
      content: product.description || "No description available."
    },
    {
      title: "Specifications",
      content: (
        <ul className="space-y-2 list-disc pl-4 marker:text-[#ff007f]">
          <li><span className="text-white font-bold">Category:</span> {product.category}</li>
          <li><span className="text-white font-bold">Material:</span> {product.material}</li>
          <li><span className="text-white font-bold">Weave Type:</span> {product.weaveType}</li>
          <li><span className="text-white font-bold">Availability:</span> {product.stock > 0 ? 'In Stock' : 'Out of Stock'}</li>
        </ul>
      )
    },
    {
      title: "Care Instructions",
      content: "Dry clean only. Do not bleach. Keep away from direct sunlight to preserve colors and fabric integrity."
    },
    {
      title: "Shipping & Returns",
      content: "Free standard shipping on orders over ₹10,000. Express delivery available. 30-day return policy for unused items with original tags."
    }
  ]
  return (
    <div className="w-full mt-12 border-t border-gray-800">
      {accordionData.map((item, idx) => (
        <AccordionItem 
          key={idx} 
          title={item.title} 
          isOpen={openIndex === idx} 
          onToggle={() => toggle(idx)}
        >
          {item.content}
        </AccordionItem>
      ))}
    </div>
  )
}

export default ProductAccordion
