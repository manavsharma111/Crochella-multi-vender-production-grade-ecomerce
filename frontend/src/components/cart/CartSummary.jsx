import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Shield, CheckCircle2 } from 'lucide-react'
import ApplyCoupon from '../shop/cartComponents/ApplyCoupon'

const CartSummary = ({ cart, totalPrice, discountAmount, finalPrice }) => {
    const navigate = useNavigate()
    const [insuranceEnabled, setInsuranceEnabled] = useState(true)

    const shipping = finalPrice > 1000 ? 0 : 50
    const insuranceCost = insuranceEnabled ? 50 : 0
    const totalPayable = finalPrice + shipping + insuranceCost

    return (
        <div className="flex flex-col gap-6 sticky top-24">
            
            {/* Shipping Insurance Banner */}
            <div className="bg-linear-to-br from-white/10 to-white/5 p-4 rounded-2xl border border-white/20 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff007f]/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                            <Shield className="text-[#ff007f]" size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-sm tracking-wide">Shipping Insurance</h3>
                            <p className="text-gray-400 text-xs mt-1 max-w-[200px] leading-relaxed">
                                Against loss, theft, or damage in transit and instant resolution. <a href="#" className="text-white underline hover:text-[#ff007f]">Learn More.</a>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button 
                            onClick={() => setInsuranceEnabled(!insuranceEnabled)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${insuranceEnabled ? 'bg-[#ff007f]' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${insuranceEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                        <span className="text-white font-bold text-sm">₹50</span>
                    </div>
                </div>
            </div>

            {/* Order Summary Box */}
            <div className="bg-linear-to-b from-[#111] to-[#0a0a0a] p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#ff007f]/50 to-transparent"></div>
                
                <h2 className="text-white font-black text-xl uppercase tracking-widest mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6 text-sm font-bold tracking-wide">
                    <div className="flex justify-between items-center text-gray-400">
                        <span>Sub Total :</span>
                        <span className="text-white">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                    
                    {discountAmount > 0 && (
                        <div className="flex justify-between items-center text-[#ff007f]">
                            <span>Discount :</span>
                            <span>- ₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center text-gray-400">
                        <span>Shipping :</span>
                        <span className="text-white">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                    </div>
                    
                    <div className="flex justify-between items-center text-gray-400">
                        <span>Tax :</span>
                        <span className="text-white">Inclusive</span>
                    </div>

                    {insuranceEnabled && (
                        <div className="flex justify-between items-center text-gray-400">
                            <span>Insurance :</span>
                            <span className="text-white">₹{insuranceCost}</span>
                        </div>
                    )}
                    
                    <div className="h-px bg-white/10 w-full my-4"></div>
                    
                    <div className="flex justify-between items-center text-lg">
                        <span className="text-white uppercase tracking-widest">Total Payable</span>
                        <span className="text-[#ff007f] font-black text-2xl">₹{totalPayable.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full bg-[#111] hover:bg-[#ff007f] text-white font-black uppercase tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 border border-white/20 hover:border-transparent group"
                >
                    Proceed to Secure Checkout
                </button>

                {/* Trust Badges Simulators */}
                <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 opacity-60">
                    <div className="flex items-center gap-1 text-[10px] font-bold"><ShieldCheck size={16}/> SECURE</div>
                    <div className="flex items-center gap-1 text-[10px] font-bold"><CheckCircle2 size={16}/> VERIFIED</div>
                    <div className="w-px h-4 bg-gray-700"></div>
                    <div className="text-[10px] font-bold italic">PayPal</div>
                    <div className="text-[10px] font-bold italic">STRIPE</div>
                </div>
            </div>

            {/* Satisfaction Guarantee */}
            <div className="bg-[#111] p-6 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <ShieldCheck className="text-white" size={16} />
                    </div>
                    <h3 className="text-white font-black text-sm uppercase tracking-widest">Your Satisfaction Is Guaranteed</h3>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">
                    We're confident we design and sell the very best premium apparel available at an affordable price, and we want you to share our confidence! That's why we back every sale with a 30-day money back guarantee.
                </p>
            </div>
            
            <div className="mb-2">
                <ApplyCoupon />
            </div>
            
        </div>
    )
}

export default CartSummary;
