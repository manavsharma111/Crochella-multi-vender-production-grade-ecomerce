import { MapPin, Edit3, Trash2 } from 'lucide-react'
import BrutalistCard from './BrutalistCard'

const AddressCard = ({ address, onEdit, onDelete, className = '' }) => {
  return (
    <BrutalistCard className={`flex justify-between items-start p-5 transition-all group ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-2 bg-[#222] border-2 border-gray-800 shadow-[2px_2px_0px_#000] rounded-lg mt-1 shrink-0">
          <MapPin size={18} className="text-gray-400" />
        </div>
        <p className="text-gray-300 text-sm leading-relaxed max-w-md">
          {address.Area}, {address.city}, {address.state} - {address.pinCode}, {address.country}
        </p>
      </div>
      <div className="flex items-center shrink-0">
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); onEdit(address); }}
          className="p-2 text-gray-500 hover:text-[#ff007f] hover:bg-[#ff007f]/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 mr-1"
          title="Edit Address"
        >
          <Edit3 size={16} />
        </button>
        <button 
          type="button"
          onClick={(e) => { e.preventDefault(); onDelete(address); }}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
          title="Delete Address"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </BrutalistCard>
  )
}

export default AddressCard
