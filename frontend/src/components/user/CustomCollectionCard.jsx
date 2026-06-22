import { Trash2, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const CustomCollectionCard = ({ collection, onDelete }) => {
  return (
    <Link to={`/wishlist/${collection._id}`} className="block group relative">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-[#ff007f] to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
      
      <div className="relative bg-[#0a0a0a]/90 backdrop-blur-md border border-white/10 group-hover:border-[#ff007f]/50 p-6 rounded-2xl transition-all duration-300 h-full flex flex-col justify-between overflow-hidden">
        
        {/* Top Section */}
        <div className="flex justify-between items-start mb-6 z-10 relative">
          <div className="pr-8">
            <h3 className="text-2xl font-black uppercase tracking-widest text-white group-hover:text-[#ff007f] transition-colors mb-2">
              {collection.name}
            </h3>
            <p className="text-sm font-serif text-gray-400 line-clamp-2">
              {collection.description || 'Curated Collection'}
            </p>
          </div>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onDelete(collection._id)
            }} 
            className="absolute top-0 right-0 text-gray-600 hover:text-red-500 transition-colors p-2 z-20"
          >
            <Trash2 size={18} />
          </button>
        </div>
        
        {/* Bottom Section */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[#ff007f] mb-3">
              {collection.products?.length || 0} ITEMS
            </div>
            <div className="flex -space-x-3">
              {collection.products?.slice(0, 4).map((p, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full border border-black bg-gray-900 overflow-hidden relative shadow-lg">
                  <img src={p.media?.[0]?.url || '/placeholder.png'} alt="product" className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                </div>
              ))}
              {collection.products?.length > 4 && (
                <div className="w-10 h-10 rounded-full border border-black bg-[#111] flex items-center justify-center text-[10px] font-bold text-white z-10 shadow-lg">
                  +{collection.products.length - 4}
                </div>
              )}
            </div>
          </div>
          
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 group-hover:bg-[#ff007f] group-hover:text-white group-hover:border-[#ff007f] transition-all duration-300 transform group-hover:rotate-45">
            <ArrowUpRight size={18} />
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#ff007f]/5 rounded-full blur-2xl group-hover:bg-[#ff007f]/10 transition-colors duration-500"></div>
      </div>
    </Link>
  )
}

export default CustomCollectionCard
