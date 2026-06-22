import AdminCouponManager from '../../components/admin/Coupons/AdminCouponManager'

const AdminCoupons = () => {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white uppercase tracking-widest">Coupon Management</h1>
                <p className="text-gray-500 text-sm mt-2 font-bold tracking-wide">Create and manage discount codes for your customers.</p>
            </div>
            
            <AdminCouponManager />
        </div>
    )
}

export default AdminCoupons
