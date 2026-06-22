
const BrutalistCard = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-[#1a1a1a] border-2 border-gray-800 shadow-[6px_6px_0px_#000] rounded-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default BrutalistCard
