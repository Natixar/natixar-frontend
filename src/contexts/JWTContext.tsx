import React, { createContext } from "react"

import { IFusionAuthContext, useFusionAuth } from "@fusionauth/react-sdk"

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

const JWTContext = createContext<IFusionAuthContext | null>(null)

export const JWTProvider = ({ children }: { children: React.ReactElement }) => (
  <JWTContext.Provider value={useFusionAuth()}>{children}</JWTContext.Provider>
)

export default JWTContext
