import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return <p>Checking authentication...</p>
  if (!user && user !==null) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
