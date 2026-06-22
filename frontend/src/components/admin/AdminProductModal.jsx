import { useState } from 'react'
import { X, Upload, Plus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { createProductAsync, updateProductAsync } from '../../redux/slices/productSlice'
import toast from 'react-hot-toast'

const AdminProductModal = ({ isOpen, onClose, product = null }) => {
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(false)
    
    const [formData, setFormData] = useState({
        productName: product?.productName || '',
        description: product?.description || '',
        price: product?.price || '',
        discountPrice: product?.discountPrice || '',
        stock: product?.stock || '',
        category: product?.category || 'Sarees',
        material: product?.material || '',
        weaveType: product?.weaveType || '',
    })

    const [mediaFiles, setMediaFiles] = useState([null, null, null, null, null, null])

    if (!isOpen) return null

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (index, e) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = [...mediaFiles]
            newFiles[index] = e.target.files[0]
            setMediaFiles(newFiles)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const data = new FormData()
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key])
            })

            const validFiles = mediaFiles.filter(f => f !== null)

            if (validFiles.length > 0) {
                validFiles.forEach(file => {
                    data.append('media', file)
                })
            } else if (!product && validFiles.length === 0) {
                 toast.error("Please add at least one image")
                 setIsLoading(false)
                 return
            }

            if (product) {
                await dispatch(updateProductAsync({ id: product._id, productData: data })).unwrap()
                toast.success('Product updated successfully!')
            } else {
                await dispatch(createProductAsync(data)).unwrap()
                toast.success('Product created successfully!')
            }
            onClose()
        } catch (error) {
            toast.error(error || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-[#ff007f]/30 rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#ff007f]/50 [&::-webkit-scrollbar-thumb]:rounded-full shadow-[0_0_50px_rgba(255,0,127,0.15)] flex flex-col">
                <div className="sticky top-0 bg-[#1a1a1a] z-10 p-5 md:p-6 border-b border-gray-800 flex justify-between items-center">
                    <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#ff007f] hover:bg-[#ff007f]/10 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 flex flex-col gap-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Side: Inputs */}
                        <div className="lg:col-span-7 space-y-5">
                            <div className="grid grid-cols-2 gap-4 md:gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Product Name *</label>
                                    <input required type="text" name="productName" value={formData.productName} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="e.g. Banarasi Silk Saree" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Category *</label>
                                    <select required name="category" value={formData.category} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm">
                                        <option value="Sarees">Sarees</option>
                                        <option value="Kurtas">Kurtas</option>
                                        <option value="Lehengas">Lehengas</option>
                                        <option value="Dupattas">Dupattas</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Price (₹) *</label>
                                    <input required type="number" name="price" value={formData.price} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="15000" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Discount Price (₹)</label>
                                    <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="12000" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Stock *</label>
                                    <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Material *</label>
                                    <input required type="text" name="material" value={formData.material} onChange={handleChange} className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="e.g. Pure Silk" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Description *</label>
                                <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-[#111] border border-gray-800 rounded-xl px-4 py-2.5 text-white focus:border-[#ff007f] focus:outline-none text-sm" placeholder="Enter product details..."></textarea>
                            </div>
                        </div>

                        {/* Right Side: Images */}
                        <div className="lg:col-span-5 space-y-3">
                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 flex justify-between items-center">
                                <span>Product Images</span>
                                <span className="text-[#ff007f]">{mediaFiles.filter(f=>f).length}/6 Uploaded</span>
                            </label>
                            
                            <div className="grid grid-cols-3 gap-3">
                                {mediaFiles.map((file, index) => (
                                    <div key={index} className={`relative aspect-square border-2 border-dashed ${file ? 'border-[#ff007f]/50' : 'border-gray-800'} rounded-xl overflow-hidden hover:border-[#ff007f]/50 transition-colors bg-[#111] flex items-center justify-center group`}>
                                        <input 
                                            type="file" 
                                            accept="image/*,video/*" 
                                            onChange={(e) => handleFileChange(index, e)} 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                            title="Click to upload"
                                        />
                                        {file ? (
                                            file.type.startsWith('video/') ? (
                                                <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" autoPlay muted loop />
                                            ) : (
                                                <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                            )
                                        ) : (
                                            <div className="flex flex-col items-center gap-1 text-gray-600 group-hover:text-gray-400 transition-colors">
                                                <Plus size={18} />
                                                <span className="text-[9px] uppercase font-bold tracking-widest">Add</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 mt-auto border-t border-gray-800 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm">
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} className="bg-[#ff007f] text-white px-8 py-2.5 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-[#d6006a] hover:shadow-[0_0_20px_rgba(255,0,127,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminProductModal;
