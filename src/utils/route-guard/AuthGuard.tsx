import { useFusionAuth } from "@fusionauth/react-sdk"
import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { GuardProps } from "types/auth"
import { getFusionConfig } from "./FusionConfiguration"

// ==============================|| AUTH GUARD ||============================== //
// It checks that user is authenticated, redirects to login page otherwise
const AuthGuard = ({ children }: GuardProps) => {
  const { isAuthenticated } = useFusionAuth()
  const fusionIsEnabled = getFusionConfig().enabled === "true"
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated && fusionIsEnabled) {
      navigate("/authentication/login")
    }
  }, [fusionIsEnabled, isAuthenticated, navigate, location])

  return (
    <>
      {!fusionIsEnabled && children}
      {fusionIsEnabled && isAuthenticated && children}
      {fusionIsEnabled && !isAuthenticated && <div>Loading...</div>}
    </>
  )
}

export default AuthGuard
