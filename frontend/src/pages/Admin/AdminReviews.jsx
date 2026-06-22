import { useEffect, useState } from 'react'
import { getAllReviewsAdmin, deleteReview } from '../../services/review.service'
import { Star, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadMoreButtons from '../../components/common/LoadMoreButtons'

const AdminReviews = () => {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [visibleCount, setVisibleCount] = useState(6)

    const fetchReviews = async () => {
        setLoading(true)
        try {
            const response = await getAllReviewsAdmin()
            setReviews(response.data || [])
        } catch (error) {
            toast.error("Failed to fetch reviews")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return
        try {
            await deleteReview(reviewId)
            toast.success("Review deleted successfully")
            fetchReviews()
        } catch (error) {
            toast.error("Failed to delete review")
        }
    }

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <Star 
                key={index} 
                size={14} 
                className={index < rating ? "fill-[#ff007f] text-[#ff007f]" : "text-gray-600"} 
            />
        ))
    }

    const filteredReviews = reviews.filter(r => 
        r.product?.productName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        r.buyer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Review Moderation</h1>
            </div>

            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by Product, Customer or Keyword..." 
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
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Review</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.slice(0, visibleCount).map((review) => (
                                    <tr key={review._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {review.product?.media?.[0]?.url && (
                                                    <img src={review.product.media[0].url} alt="Product" className="w-10 h-10 rounded-lg object-cover" />
                                                )}
                                                <div>
                                                    <p className="text-white font-bold max-w-[200px] truncate">{review.product?.productName || 'Unknown Product'}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{review.product?.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-bold">{review.buyer?.name || 'Deleted User'}</p>
                                            <p className="text-xs text-gray-500 mt-1">{review.buyer?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-1">
                                                {renderStars(review.rating)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <p className="text-gray-300 truncate">{review.comment}</p>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500 font-bold uppercase">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(review._id)}
                                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-xs font-bold transition-colors"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No reviews found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <LoadMoreButtons 
                    visibleCount={visibleCount} 
                    totalCount={filteredReviews.length} 
                    setVisibleCount={setVisibleCount} 
                    step={6} 
                />
            </div>
        </div>
    )
}

export default AdminReviews
