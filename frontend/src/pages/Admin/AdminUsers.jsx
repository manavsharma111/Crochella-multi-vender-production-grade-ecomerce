import { useEffect, useState } from 'react'
import { getAllUsers } from '../../services/user.service'
import { Search, Shield, User, Ban } from 'lucide-react'
import toast from 'react-hot-toast'
import LoadMoreButtons from '../../components/common/LoadMoreButtons'
import useDebounce from '../../hooks/useDebounce'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearchTerm = useDebounce(searchTerm, 500)
    const [visibleCount, setVisibleCount] = useState(6)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true)
                const response = await getAllUsers({ limit: visibleCount, search: debouncedSearchTerm })
                setUsers(response.users || response.data || [])
                setTotalCount(response.pagination?.total || response.count || 0)
            } catch (error) {
                toast.error("Failed to fetch users")
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [visibleCount, debouncedSearchTerm])

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">User Management</h1>
            </div>

            <div className="bg-[#1a1a1a] border-2 border-gray-800 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
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
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="inline-block w-8 h-8 border-4 border-[#ff007f] border-t-transparent rounded-full animate-spin"></div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u._id} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={u.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} 
                                                    alt={u.name} 
                                                    className="w-10 h-10 rounded-full border border-gray-700 bg-black"
                                                />
                                                <div>
                                                    <p className="text-white font-bold">{u.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest ${
                                                u.role === 'admin' ? 'bg-[#ff007f]/10 text-[#ff007f] border-[#ff007f]' :
                                                u.role === 'seller' ? 'bg-blue-500/10 text-blue-500 border-blue-500' :
                                                u.role === 'delivery_boy' ? 'bg-orange-500/10 text-orange-500 border-orange-500' :
                                                'bg-gray-800 text-gray-300 border-gray-700'
                                            }`}>
                                                {u.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                                                {u.role ? u.role.replace('_', ' ') : 'user'}
                                            </span>
                                            {u.role === 'delivery_boy' && u.deliveryRating?.average > 0 && (
                                                <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs font-bold bg-yellow-500/10 w-fit px-2 py-0.5 rounded border border-yellow-500/20">
                                                    ⭐ {u.deliveryRating.average.toFixed(1)} / 5.0 ({u.deliveryRating.count})
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-medium">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.role !== 'admin' && (
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Suspend User">
                                                    <Ban size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-gray-800">
                    <LoadMoreButtons 
                        visibleCount={visibleCount} 
                        totalCount={totalCount} 
                        setVisibleCount={setVisibleCount} 
                        step={6} 
                    />
                </div>
            </div>
        </div>
    )
}

export default AdminUsers
