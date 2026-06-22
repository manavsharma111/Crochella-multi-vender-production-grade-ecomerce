const NeoInput = ({ 
  icon: Icon, 
  label, 
  className = '', 
  containerClassName = '',
  rightElement,
  ...props 
}) => {
  return (
    <div className={`relative group ${containerClassName}`}>
      {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <Icon 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff007f] transition-colors" 
            size={18} 
          />
        )}
        <input 
          className={`w-full bg-[#0a0a0a] border-2 border-gray-800 rounded-xl ${Icon ? 'pl-12' : 'pl-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-3.5 text-sm text-white focus:outline-none focus:border-[#ff007f] shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5)] focus:shadow-[inset_4px_4px_0px_rgba(0,0,0,0.5),0_0_0_2px_#ff007f] transition-all ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

export default NeoInput
