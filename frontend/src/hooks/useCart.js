import { useSelector } from "react-redux"

// use cart hook
const useCart = () => {
  const { cart, loading, error } = useSelector((state) => state.cart)

  let totalQuantity = 0
  let totalPrice = 0

  if (cart && cart.products) {
    cart.products.forEach((item) => {
      totalQuantity += item.quantity
      totalPrice += (item.price || 0) * item.quantity
    })
  }

  const appliedCoupon = cart?.appliedCoupon || null

  return {
    cart,
    loading,
    error,
    cartItems: cart?.products || [],
    totalQuantity,
    totalPrice,
    appliedCoupon,
  }
}

export default useCart
