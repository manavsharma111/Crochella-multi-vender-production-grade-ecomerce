import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { getCustomWishlistsAsync, deleteCustomWishlistAsync } from '../../redux/slices/wishlistSlice';
import ProductCard from '../../components/common/Cards/ProductCard';
import BrutalistButton from '../../components/common/Buttons/BrutalistButton';
import { ArrowLeft, Trash2, FolderOpen } from 'lucide-react';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';

const CustomWishlistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { customWishlists, isLoading } = useSelector((state) => state.wishlist);
  const [collection, setCollection] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Ensure we have custom wishlists loaded
    if (!customWishlists || customWishlists.length === 0) {
      dispatch(getCustomWishlistsAsync());
    }
  }, [dispatch, customWishlists]);

  useEffect(() => {
    // Find the specific collection
    const wishlistsArray = Array.isArray(customWishlists) ? customWishlists : (customWishlists?.wishlists || []);
    const found = wishlistsArray.find(cw => cw._id === id);
    if (found) {
      setCollection(found);
    }
  }, [id, customWishlists]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entire collection?")) {
      setIsDeleting(true);
      dispatch(deleteCustomWishlistAsync(id)).then(() => {
        toast.success("Collection deleted");
        navigate('/wishlist');
      }).finally(() => {
        setIsDeleting(false);
      });
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      // Direct API call to remove product from custom wishlist to update instantly
      await axiosInstance.post('/wishlists/custom/toggle', {
        customWishlistId: id,
        productId: productId
      });
      toast.success("Item removed from collection");
      // Refresh
      dispatch(getCustomWishlistsAsync());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove item");
    }
  };

  if (isLoading && !collection) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!collection && !isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-4">
        <FolderOpen size={64} className="text-gray-600 mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Collection Not Found</h2>
        <p className="text-gray-400 mb-8 text-center">This collection may have been deleted or doesn't exist.</p>
        <BrutalistButton onClick={() => navigate('/wishlist')} className="px-8 py-3 text-sm">
          Return to Wishlist
        </BrutalistButton>
      </div>
    );
  }

  return (
    <div className="relative z-10 min-h-screen bg-[#050505] text-white pt-24 px-4 pb-32 overflow-hidden">
      {/* Edgy background effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff007f]/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/5 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
          <button 
            onClick={() => navigate('/wishlist')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit group font-bold tracking-widest text-xs uppercase"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Wishlists
          </button>

          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all text-xs font-bold uppercase tracking-widest"
          >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Delete Collection'}
          </button>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 border-b border-white/10 pb-8"
        >
          <div className="inline-block px-3 py-1 bg-[#ff007f]/10 text-[#ff007f] text-xs font-black tracking-widest uppercase mb-4 border border-[#ff007f]/20 rounded-full">
            Custom Collection
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-white">
            {collection?.name}
          </h1>
          {collection?.description && (
            <p className="text-xl text-gray-400 font-serif max-w-2xl">
              {collection.description}
            </p>
          )}
          <div className="mt-6 flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-500">
            <span>{collection?.products?.length || 0} ITEMS</span>
          </div>
        </motion.div>

        {/* Products Grid */}
        {(!collection?.products || collection.products.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
            <FolderOpen size={48} className="text-white/20 mb-6" />
            <h3 className="text-2xl font-bold mb-2">This collection is empty</h3>
            <p className="text-gray-400 mb-8 font-serif">Add products to this collection from the shop.</p>
            <BrutalistButton onClick={() => navigate('/shop')} className="px-8 py-3 text-sm">
              Explore Shop
            </BrutalistButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {collection.products.map((product) => {
                if (!product) return null;
                return (
                  <motion.div 
                    key={product._id} 
                    layout 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 0.9 }} 
                    className="relative group"
                  >
                    <ProductCard product={product} />
                    <button 
                      onClick={() => handleRemoveProduct(product._id)}
                      className="absolute top-4 right-4 p-3 bg-black/80 backdrop-blur-md text-gray-400 rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-black border border-white/10 transition-all z-10"
                      title="Remove from collection"
                    >
                      <Trash2 size={16} />
                    </button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomWishlistDetails;
