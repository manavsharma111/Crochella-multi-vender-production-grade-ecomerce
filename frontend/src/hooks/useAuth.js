import { useSelector } from "react-redux"

// use auth hook
const useAuth = () => {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth,
  )

  const isAdmin = user?.role === "admin"
  const isSeller = user?.role === "seller"
  const isBuyer = user?.role === "buyer"

  return { user, isAuthenticated, isLoading, isAdmin, isSeller, isBuyer }
}

export default useAuth
