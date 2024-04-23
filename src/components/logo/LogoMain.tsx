// material-ui
// import logoIconDark from "../../assets/images/natixar-logo.png"
import logoIconWhite from "../../assets/images/white-natixar-logo.png"

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const LogoMain = () => (
  <img src={logoIconWhite} alt="Natixar" width="100" />

  /**
   * if you want to use image instead of svg uncomment following, and comment out <svg> element.
   *
   * <img src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo} alt="Natixar" width="100" />
   *
   */
)

export default LogoMain
