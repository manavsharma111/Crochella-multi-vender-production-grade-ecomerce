import { Search as SearchIcon } from 'lucide-react'

const SearchBox = ({ searchQuery, setSearchQuery, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors" size={14} />
      <input 
        type="text" 
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-[#0a0a0a] border border-white/10 rounded-md md:rounded-xl pl-8 md:pl-10 pr-3 py-2 md:py-3 text-[10px] md:text-sm text-white focus:outline-none focus:border-white transition-all placeholder:text-gray-600 font-serif"
      />
    </div>
  )
}

export default SearchBox
