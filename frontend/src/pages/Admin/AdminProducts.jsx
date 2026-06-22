import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProductsAsync, deleteProductAsync } from '../../redux/slices/productSlice'
import { Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import AdminProductModal from '../../components/admin/AdminProductModal'
import LoadMoreButtons from '../../components/common/LoadMoreButtons'

const AdminProducts = () => {
    const dispatch = useDispatch()
    const { products, isLoading } = useSelector(state => state.product)
    const [searchTerm, setSearchTerm] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [visibleCount, setVisibleCount] = useState(6)

    useEffect(() => {
        dispatch(getAllProductsAsync())
    }, [dispatch])

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProductAsync(id)).unwrap()
                toast.success('Product deleted successfully')
            } catch (error) {
                toast.error(error || 'Failed to delete product')
            }
        }
    }

    const productList = Array.isArray(products) ? products : (products?.data || [])
    
    const filteredProducts = productList.filter(p => 
        p?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p?.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Products</h1>
                <button 
                    onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    className="bg-[#ff007f] text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-sm flex items-center gap-2 hover:bg-transparent hover:text-[#ff007f] border-2 border-[#ff007f] transition-all"
                >
                    <Plus size={18} /> Add New Product
                </button>
            </div>

            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#111] border border-gray-800 rounded-xl py-2.5 pl-12 pr-4 text-white focus:outline-none focus:border-[#ff007f] transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#111] text-xs uppercase font-bold text-gray-500 border-b border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.slice(0, visibleCount).map((product) => {
                                    const media = Array.isArray(product.media) && product.media.length > 0 ? product.media[0].url : 'https://via.placeholder.com/50'
                                    return (
                                        <tr key={product._id} className="border-b border-gray-800 hover:bg-[#111]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {product.media && product.media.length > 0 && product.media[0].type === 'video' ? (
                                                        <video src={media} className="w-12 h-12 rounded-lg object-cover border border-gray-700 bg-black" muted />
                                                    ) : (
                                                        <img src={media} alt={product.productName} className="w-12 h-12 rounded-lg object-cover border border-gray-700 bg-black" />
                                                    )}
                                                    <div>
                                                        <p className="text-white font-bold max-w-[200px] truncate">{product.productName}</p>
                                                        <p className="text-xs text-gray-500 mt-1">ID: {product._id.substring(0,8)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold uppercase tracking-widest text-gray-300">
                                                    {product.category || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-white">
                                                ₹{product.price?.toLocaleString('en-IN') || 0}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${product.stock <= 5 ? 'text-red-500' : 'text-[#00ff88]'}`}>
                                                    {product.stock || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <Link to={`/product/${product._id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors">
                                                        <ExternalLink size={16} />
                                                    </Link>
                                                    <button 
                                                        onClick={() => { setEditingProduct(product); setIsModalOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(product._id)}
                                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <LoadMoreButtons 
                    visibleCount={visibleCount} 
                    totalCount={filteredProducts.length} 
                    setVisibleCount={setVisibleCount} 
                    step={6} 
                />
            </div>

            <AdminProductModal 
                isOpen={isModalOpen} 
                onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
                product={editingProduct} 
            />
        </div>
    )
}

export default AdminProducts
