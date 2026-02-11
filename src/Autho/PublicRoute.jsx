import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "./AuthContext"

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) return null

  if (user && user !== null) {
    if (user.role === "admin") {
      return <Navigate to="/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute
