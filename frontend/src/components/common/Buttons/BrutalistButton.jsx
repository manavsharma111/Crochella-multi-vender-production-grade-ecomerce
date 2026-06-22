const BrutalistButton = ({ 
  children, 
  variant = 'primary', // 'primary' | 'secondary'
  className = '', 
  ...props 
}) => {
  const baseClasses = "flex items-center justify-center gap-2 uppercase tracking-widest rounded-xl border-2 transition-all active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-[#ff007f] text-white font-black border-black shadow-[4px_4px_0px_#8b0045] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#8b0045]",
    secondary: "bg-[#222] text-white font-bold border-gray-800 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
  }

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default BrutalistButton
