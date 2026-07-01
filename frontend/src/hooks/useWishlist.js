import { useSelector } from "react-redux"

// use wishlist hook
const useWishlist = () => {
  const { wishlist, customWishlists, loading, error } = useSelector(
    (state) => state.wishlist,
  )

  // check if product is in default wishlist
  const checkInWishlist = (productId) => {
    if (!wishlist || !wishlist.items) return false
    return wishlist.items.some(
      (item) =>
        item.productId === productId || item.productId?._id === productId,
    )
  }

  return { wishlist, customWishlists, loading, error, checkInWishlist }
}

export default useWishlist
