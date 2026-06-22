import { useEffect, useState } from 'react'
import { getAdminDashboardStats } from '../../services/dashboard.service'
import { DollarSign, Package, Users, ShoppingCart, AlertTriangle, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import TiltCard from '../../components/common/animation/Tilt'

const StatCard = ({ title, value, icon: Icon, color }) => {
    // Generate static random heights for the fake sparkline so it doesn't flicker on re-render
    const [bars] = useState(() => Array.from({ length: 15 }, () => Math.random() * 100))
    
    return (
    <TiltCard className="bg-linear-to-br from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-6 relative overflow-hidden group hover:border-gray-700 hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className={`absolute -right-12 -top-12 w-40 h-40 bg-${color}-500/10 rounded-full blur-3xl group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
        <div className="flex justify-between items-start z-10 relative">
            <div>
                <h3 className="text-white text-4xl font-black tracking-tight">{value}</h3>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">{title}</p>
            </div>
            <div className={`p-4 bg-${color}-500/10 text-${color}-500 rounded-2xl border border-${color}-500/20 shadow-[0_0_15px_rgba(0,0,0,0)] group-hover:shadow-${color}-500/20 group-hover:-translate-y-1 transition-all duration-300`}>
                <Icon size={24} strokeWidth={2.5} />
            </div>
        </div>
        {/* Fake sparkline chart for aesthetics */}
        <div className="mt-8 flex items-end gap-1.5 h-10 z-10 relative opacity-40 group-hover:opacity-80 transition-opacity duration-300">
            {bars.map((height, i) => (
                <div key={i} className={`flex-1 bg-${color}-500/60 rounded-t-md hover:bg-${color}-400 transition-colors cursor-pointer`} style={{ height: `${height}%` }}></div>
            ))}
        </div>
    </TiltCard>
)}

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getAdminDashboardStats()
                setStats(response)
            } catch (error) {
                toast.error("Failed to fetch dashboard stats")
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-[#111] border border-gray-800 rounded-3xl p-6 h-36 animate-pulse"></div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 h-80 animate-pulse"></div>
                    <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 h-80 animate-pulse"></div>
                </div>
            </div>
        )
    }

    const { metrics, lowStockProducts, statusBreakdown } = stats || {}

    const handleExportCSV = () => {
        if (!stats) return
        
        let csvContent = "data:text/csv;charset=utf-8,"
        
        // Metrics Section
        csvContent += "METRICS\n"
        csvContent += "Metric,Value\n"
        csvContent += `Total Revenue,${metrics?.totalRevenue || 0}\n`
        csvContent += `Total Orders,${metrics?.totalOrders || 0}\n`
        csvContent += `Total Products,${metrics?.totalProducts || 0}\n`
        csvContent += `Total Customers,${metrics?.totalCustomers || 0}\n`
        csvContent += "\n"
        
        // Order Status Section
        csvContent += "ORDER STATUS\n"
        csvContent += "Status,Count\n"
        if (statusBreakdown && statusBreakdown.length > 0) {
            statusBreakdown.forEach(s => {
                csvContent += `${s._id},${s.count}\n`
            })
        } else {
            csvContent += "No data,\n"
        }
        csvContent += "\n"
        
        // Low Stock Section
        csvContent += "LOW STOCK ALERTS\n"
        csvContent += "Product ID,Product Name,Stock Left\n"
        if (lowStockProducts && lowStockProducts.length > 0) {
            lowStockProducts.forEach(p => {
                // escape commas in product names
                const safeName = p.productName ? p.productName.replace(/,/g, "") : "Unknown"
                csvContent += `${p._id},${safeName},${p.stock}\n`
            })
        } else {
            csvContent += "All products are well stocked,\n"
        }
        
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `dashboard_report_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Report downloaded successfully")
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Dashboard Overview</h1>
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-[#ff007f] hover:bg-[#cc0066] text-white px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(255,0,127,0.3)]"
                >
                    <Download size={16} /> Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${metrics?.totalRevenue?.toLocaleString('en-IN') || 0}`} 
                    icon={DollarSign} 
                    color="green" 
                />
                <StatCard 
                    title="Total Orders" 
                    value={metrics?.totalOrders || 0} 
                    icon={ShoppingCart} 
                    color="blue" 
                />
                <StatCard 
                    title="Total Products" 
                    value={metrics?.totalProducts || 0} 
                    icon={Package} 
                    color="purple" 
                />
                <StatCard 
                    title="Total Customers" 
                    value={metrics?.totalCustomers || 0} 
                    icon={Users} 
                    color="pink" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Low Stock Alerts */}
                <TiltCard className="bg-linear-to-br from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800/50">
                        <div>
                            <h2 className="text-white font-black text-xl tracking-wide flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={24} /> 
                                Low Stock Alerts
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">Products needing restock soon</p>
                        </div>
                    </div>
                    
                    {lowStockProducts?.length > 0 ? (
                        <div className="space-y-3">
                            {lowStockProducts.map(product => (
                                <div key={product._id} className="flex justify-between items-center p-4 bg-[#111]/50 hover:bg-[#111] rounded-2xl border border-gray-800/50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                            <Package size={18} />
                                        </div>
                                        <div>
                                            <p className="text-white font-bold">{product.productName}</p>
                                            <p className="text-gray-500 text-xs mt-0.5">ID: {product._id.substring(0,8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                                        <p className="text-red-500 font-black text-lg">{product.stock}</p>
                                        <p className="text-red-500/70 text-[10px] uppercase tracking-widest font-bold">Left</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 opacity-50">
                            <Package size={48} className="text-gray-600 mb-4" />
                            <p className="text-gray-400 font-bold">All products are well stocked!</p>
                        </div>
                    )}
                </TiltCard>

                {/* Order Status Breakdown */}
                <TiltCard className="bg-linear-to-br from-[#161616] to-[#0a0a0a] border border-gray-800/60 rounded-3xl p-8 shadow-2xl">
                    <div className="mb-8 pb-4 border-b border-gray-800/50">
                        <h2 className="text-white font-black text-xl tracking-wide">Order Status Breakdown</h2>
                        <p className="text-gray-500 text-xs mt-1">Live fulfillment pipeline</p>
                    </div>
                    
                    {statusBreakdown?.length > 0 ? (
                        <div className="space-y-6">
                            {statusBreakdown.map(status => {
                                let barColor = "bg-blue-500"
                                if(status._id === 'Delivered') barColor = "bg-green-500"
                                if(status._id === 'Processing') barColor = "bg-yellow-500"
                                if(status._id === 'Returned') barColor = "bg-purple-500"
                                if(status._id === 'Collected') barColor = "bg-indigo-500"
                                if(status._id === 'Cancelled') barColor = "bg-red-500"
                                if(status._id === 'Refunded') barColor = "bg-teal-500"

                                return (
                                <div key={status._id} className="group cursor-pointer">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-300 font-bold text-sm">{status._id}</span>
                                        <span className="text-white font-black">{status.count}</span>
                                    </div>
                                    <div className="w-full h-3 bg-[#111] rounded-full overflow-hidden shadow-inner border border-gray-800/50">
                                        <div 
                                            className={`h-full ${barColor} rounded-full group-hover:brightness-125 transition-all duration-500`} 
                                            style={{ width: `${(status.count / metrics.totalOrders) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                                )
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 opacity-50">
                            <ShoppingCart size={48} className="text-gray-600 mb-4" />
                            <p className="text-gray-400 font-bold">No order data available.</p>
                        </div>
                    )}
                </TiltCard>
            </div>
        </div>
    )
}

export default AdminDashboard
