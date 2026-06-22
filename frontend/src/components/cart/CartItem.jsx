import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { updateQuantityAsync, removeFromCartAsync, getCartAsync } from '../../redux/slices/cartSlice'
import toast from 'react-hot-toast'

const CartItem = ({ item }) => {
    const dispatch = useDispatch()
    const [isUpdating, setIsUpdating] = useState(false)

    // item shape: { productId: { _id, productName, media, price, discountPrice }, quantity, price }
    const product = item.productId || {}
    const media = Array.isArray(product.media) && product.media.length > 0 ? product.media[0].url : 'https://via.placeholder.com/150'
    
    // Dynamic price logic or fallback to discount/regular price
    const currentPrice = item.price || product.dynamicPrice || product.discountPrice || product.price || 0

    const handleQuantityChange = async (newQuantity) => {
        if (newQuantity < 1) return
        setIsUpdating(true)
        try {
            const res = await dispatch(updateQuantityAsync({ productId: product._id, quantity: newQuantity })).unwrap()
            dispatch(getCartAsync())// Refresh total price
        } catch (error) {
            toast.error(error || "Failed to update quantity")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleRemove = async () => {
        setIsUpdating(true)
        try {
            await dispatch(removeFromCartAsync({ productId: product._id })).unwrap()
            toast.success("Item removed from cart")
            dispatch(getCartAsync())
        } catch (error) {
            toast.error(error || "Failed to remove item")
            setIsUpdating(false)
        }
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#111] p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
        >
            {/* Product Column (col-span-6) */}
            <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-inner">
                    <img src={media} alt={product.productName || 'Product'} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="text-white font-bold text-base sm:text-lg truncate">
                        {product.productName || 'Unknown Product'}
                    </h3>
                    {product._id && (
                        <p className="text-gray-500 text-xs mt-1 font-mono">[{product._id.substring(0,8).toUpperCase()}]</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2 pr-4 hidden sm:block">
                        {product.description || 'Premium quality product tailored for your style.'}
                    </p>
                    
                    {/* Mobile Only Price & Remove */}
                    <div className="flex md:hidden items-center justify-between mt-3">
                        <span className="text-[#ff007f] font-bold">₹{currentPrice.toLocaleString('en-IN')}</span>
                        <button onClick={handleRemove} className="text-gray-500 hover:text-red-500 transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quantity Column (col-span-3) */}
            <div className="col-span-1 md:col-span-3 flex items-center md:justify-center mt-2 md:mt-0">
                <div className="flex items-center bg-[#050505] border border-gray-800 rounded-lg overflow-hidden">
                    <button 
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-white font-bold text-sm">
                        {item.quantity}
                    </span>
                    <button 
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className="px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            </div>

            {/* Price & Remove Column (col-span-3) */}
            <div className="hidden md:flex col-span-3 items-center justify-end gap-6">
                <div className="flex flex-col items-end">
                    <div className="text-white font-black text-lg">
                        ₹{(currentPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                    {item.quantity > 1 && (
                        <div className="text-gray-500 text-xs line-through mt-0.5">
                            ₹{currentPrice.toLocaleString('en-IN')} each
                        </div>
                    )}
                </div>
                <button 
                    onClick={handleRemove}
                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Remove item"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    )
}

export default React.memo(CartItem, (prevProps, nextProps) => {
    // Only re-render if quantity changes or it's a different product
    return (
        prevProps.item.quantity === nextProps.item.quantity &&
        prevProps.item.productId?._id === nextProps.item.productId?._id &&
        prevProps.item.price === nextProps.item.price
    );
})
