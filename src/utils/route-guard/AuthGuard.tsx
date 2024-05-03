import { useFusionAuth } from "@fusionauth/react-sdk"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GuardProps } from "types/auth"
import { getFusionConfig } from "./FusionConfiguration"

// ==============================|| AUTH GUARD ||============================== //
// It checks that user is authenticated, redirects to login page otherwise
const AuthGuard = ({ children }: GuardProps) => {
  const { isAuthenticated } = useFusionAuth()
  const { enabled: fusionIsEnabled } = getFusionConfig()
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && fusionIsEnabled && fusionIsEnabled === "true" && !isAuthenticated) {
      navigate("authentication/login")
    }
  }, [fusionIsEnabled, isAuthenticated, navigate, location])
  return children
}

export default AuthGuard
