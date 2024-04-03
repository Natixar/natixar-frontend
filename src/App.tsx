import { RouterProvider, useNavigate } from "react-router-dom"

// project import
import router from "routes"

import ThemeCustomization from "themes"

import Locales from "components/Locales"
import RTLLayout from "components/RTLLayout"
import ScrollTop from "components/ScrollTop"
import Snackbar from "components/@extended/Snackbar"
import Notistack from "components/third-party/Notistack"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"

import { store } from "data/store"
import { Provider } from "react-redux"

// auth-provider
import { JWTProvider as AuthProvider } from "contexts/JWTContext"
import { FusionAuthProvider } from "@fusionauth/react-sdk"
import { getFusionConfig } from "utils/route-guard/FusionConfiguration"

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

const App = () => {
  const authConfig = getFusionConfig()
  return (
    <ThemeCustomization>
      <Provider store={store}>
        <RTLLayout>
          <Locales>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <ScrollTop>
                <FusionAuthProvider
                  clientID={authConfig.clientID}
                  serverUrl={authConfig.serverUrl}
                  redirectUri={authConfig.redirectUri}
                >
                  {/* <AuthProvider> */}
                  <Notistack>
                    <RouterProvider router={router} />
                    <Snackbar />
                  </Notistack>
                  {/* </AuthProvider> */}
                </FusionAuthProvider>
              </ScrollTop>
            </LocalizationProvider>
          </Locales>
        </RTLLayout>
      </Provider>
    </ThemeCustomization>
  )
}

export default App
