import type Props from '../../../models/Props';

import styles from './Navbar.module.css';

const NavLogo = (props: Props) => {
  return <div class={`${styles.logo} ${props.class ?? ''}`} />;
};

export default NavLogo;
