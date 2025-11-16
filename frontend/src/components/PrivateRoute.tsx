import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface PrivateRouteProps {
  children: ReactNode
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default PrivateRoute
