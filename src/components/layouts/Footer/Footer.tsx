import { A } from '@solidjs/router';

import type Props from '../../../models/Props';
import styles from './Footer.module.css';

interface FooterProps {
  copyrightText: string;
  privacyLabel: string;
  privacyHref: string;
  builtWithText: string;
  homeHref?: string;
}

const Footer = (props: Props<FooterProps>) => {
  return (
    <footer class={`${styles.footer} ${props.class ?? ''}`}>
      <div class={styles.container}>
        <A href={props.homeHref ?? '/'} class={styles.link}>
          {props.copyrightText}
        </A>
        <A href={props.privacyHref} class={styles.link}>
          {props.privacyLabel}
        </A>
        <span class={styles.text}>{props.builtWithText}</span>
      </div>
    </footer>
  );
};

export default Footer;
