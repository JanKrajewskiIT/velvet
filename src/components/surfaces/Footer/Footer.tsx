import { A } from '@solidjs/router';
import { splitProps } from 'solid-js';

import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Text from '../../typography/Text/Text';
import styles from './Footer.module.css';

interface FooterProps {
  copyrightText: string;
  privacyLabel: string;
  privacyHref: string;
  builtWithText: string;
  homeHref?: string;
}

const Footer = (props: Props<FooterProps>) => {
  const [local, rest] = splitProps(props, [
    'copyrightText',
    'privacyLabel',
    'privacyHref',
    'builtWithText',
    'homeHref',
    'class',
  ]);

  return (
    <footer {...rest} class={classNames(styles.footer, local.class)}>
      <div class={styles.container}>
        <A href={local.homeHref ?? '/'} class={styles.link}>
          <Text as="span" variant="bodySm" tone="muted">
            {local.copyrightText}
          </Text>
        </A>
        <A href={local.privacyHref} class={styles.link}>
          <Text as="span" variant="bodySm" tone="muted">
            {local.privacyLabel}
          </Text>
        </A>
        <Text as="span" variant="bodySm" tone="muted">
          {local.builtWithText}
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
