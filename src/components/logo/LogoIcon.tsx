// material-ui

// import logoIconDark from "assets/images/natixar-logo.png"
import logoIconWhite from "assets/images/white-natixar-logo.png"
/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoIconDark from 'assets/images/logo-icon-dark.svg';
 * import logoIcon from 'assets/images/logo-icon.svg';
 * import { ThemeMode } from 'types/config';
 *
 */

// ==============================|| LOGO ICON SVG ||============================== //

const LogoIcon = () => (
  /**
   * if you want to use image instead of svg uncomment following, and comment out <svg> element.
   *
   * <img src={theme.palette.mode === ThemeMode.DARK ? logoIconDark : logoIcon} alt="Natixar" width="100" />
   *
   */
  <img src={logoIconWhite} alt="Natixar" width="50" />
)

export default LogoIcon
