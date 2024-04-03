import { Link } from "react-router-dom"

// material-ui
import { Grid, Stack, Typography } from "@mui/material"

// project import
import AuthWrapper from "sections/auth/AuthWrapper"
import AuthLogin from "sections/auth/auth-forms/AuthLogin"

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="baseline"
          sx={{ mb: { xs: -0.5, sm: 0.5 } }}
        >
          <Typography variant="h3">Welcome to Natixar SaaS</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin />
      </Grid>
    </Grid>
  </AuthWrapper>
)

export default Login
