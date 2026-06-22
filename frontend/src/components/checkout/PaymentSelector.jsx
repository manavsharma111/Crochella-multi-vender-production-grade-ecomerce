import { CreditCard, Wallet, Check } from 'lucide-react'

const PaymentSelector = ({ paymentMethod, setPaymentMethod }) => {
    const methods = [
        { id: 'COD', name: 'Cash on Delivery', icon: <Wallet size={24} className="text-gray-400" />, desc: 'Pay when your order arrives' },
        { id: 'Razorpay', name: 'Pay Online (Razorpay)', icon: <CreditCard size={24} className="text-gray-400" />, desc: 'Credit/Debit Card, UPI, NetBanking' }
    ]

    return (
        <div className="bg-[#111] p-6 rounded-2xl border-2 border-gray-800 mt-6">
            <h2 className="text-white font-black text-xl uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard className="text-[#ff007f]" /> Payment Method
            </h2>

            <div className="space-y-4">
                {methods.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    return (
                        <div 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id)}
                            className={`cursor-pointer p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                                isSelected 
                                ? 'border-[#ff007f] bg-[#ff007f]/5 shadow-[4px_4px_0px_#8b0045]' 
                                : 'border-gray-800 bg-[#0a0a0a] hover:border-gray-600'
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#ff007f] bg-[#ff007f]' : 'border-gray-600'}`}>
                                {isSelected && <Check size={14} className="text-white" />}
                            </div>
                            
                            <div className="p-2 bg-[#222] rounded-lg shrink-0 border border-gray-700">
                                {method.icon}
                            </div>
                            
                            <div>
                                <h3 className="text-white font-bold">{method.name}</h3>
                                <p className="text-gray-500 text-sm">{method.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            
            {paymentMethod === 'Razorpay' && (
                <div className="mt-4 p-4 bg-[#1a1a1a] border-l-4 border-[#ff007f] text-gray-400 text-sm">
                    <strong>Note:</strong> You will be redirected to the secure Razorpay gateway to complete your payment after clicking "Place Order".
                </div>
            )}
        </div>
    )
}

export default PaymentSelector
