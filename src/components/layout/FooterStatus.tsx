import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Dot } from '../primitives/Dot';
import { typographyClass } from '../primitives/typography';
import styles from './FooterStatus.module.css';
import { FOOTER_STATUS, type FooterStatusDetail, type FooterStatusValue } from './footerTypes';

export interface FooterStatusProps {
  status?: FooterStatusValue;
}

const toDetail = (status: FooterStatusValue): FooterStatusDetail =>
  typeof status === 'string' ? { state: status } : status;

export const FooterStatus = (props: FooterStatusProps) => {
  const translate = useTranslate();
  return (
    <Show when={props.status}>
      {(status) => {
        const detail = () => toDetail(status());
        const preset = () => FOOTER_STATUS[detail().state];
        return (
          <a class={cx(styles.footerPartStatus, typographyClass('caption'))} href={detail().href || '#'}>
            <Dot tone={preset().tone} />
            {detail().label || translate(preset().labelKey)}
          </a>
        );
      }}
    </Show>
  );
};
