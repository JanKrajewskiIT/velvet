import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Spinner } from '../feedback/Spinner';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { Text } from '../primitives/Text';
import styles from './AnalysisSourceRow.module.css';
import { type AnalysisSource, KIND_ICON, sourceStatus } from './analysisSources';
import type { StaticTranslate } from './englishText';

const AREQ_PART_SRC_CLASSES = {
  ready: styles.areqPartSrcVariantReady,
  on: styles.areqPartSrcVariantOn,
  error: styles.areqPartSrcVariantError,
  missing: styles.areqPartSrcVariantMissing,
} as const;

export interface AnalysisSourceRowProps {
  source: AnalysisSource;
  /** Included in the request (only ever true for a ready source). */
  included: boolean;
  /** The chosen analysis type requires this source. */
  required: boolean;
  onToggle: (source: AnalysisSource) => void;
}

const detailOf = (source: AnalysisSource, translate: StaticTranslate): JSX.Element => {
  switch (sourceStatus(source)) {
    case 'missing':
      return translate('velvet.patterns.analysisSourceRow.notProvided');
    case 'loading':
      return translate('velvet.patterns.analysisSourceRow.processing');
    case 'error':
      return source.error || translate('velvet.patterns.analysisSourceRow.readError');
    case 'ready':
      return source.detail;
  }
};

/** One context source of an AnalysisRequest: toggle row plus Add / Replace for missing and failed sources. */
export const AnalysisSourceRow = (props: AnalysisSourceRowProps) => {
  const translate = useTranslate();
  const status = () => sourceStatus(props.source);
  const iconName = () => props.source.icon ?? (props.source.kind ? KIND_ICON[props.source.kind] : 'file');
  return (
    <li
      class={cx(
        styles.areqPartSrc,
        variantClass(AREQ_PART_SRC_CLASSES, status()),
        props.included && styles.areqPartSrcVariantOn,
      )}
    >
      <button
        type="button"
        class={styles.areqPartSrcbtn}
        role="checkbox"
        aria-checked={props.included}
        disabled={status() !== 'ready'}
        onClick={() => props.onToggle(props.source)}
      >
        <IconTile size="sm" class={styles.areqPartSicon}>
          <Show when={status() === 'loading'} fallback={<Glyph name={iconName()} />}>
            <Spinner size="inline" tone="current" />
          </Show>
        </IconTile>
        <span class={styles.areqPartSt}>
          <Text as="span" variant="label" tone="inherit" class={styles.areqPartSname}>
            {props.source.label}
            <Show when={props.required}>
              <Text as="span" variant="micro" tone="inherit" class={styles.areqPartReq}>
                {translate('velvet.patterns.analysisSourceRow.required')}
              </Text>
            </Show>
          </Text>
          <Text as="span" variant="caption" tone="tertiary" class={styles.areqPartSdet}>
            {detailOf(props.source, translate)}
          </Text>
        </span>
        <Show when={status() === 'ready'}>
          <Checkmark round checked={props.included} class="vui-areq__check" />
        </Show>
      </button>
      <Show when={(status() === 'missing' || status() === 'error') && props.source.onAttach}>
        <Button
          variant="secondary"
          size="sm"
          iconLeft="paperclip"
          class={styles.areqPartAttach}
          onClick={() => props.source.onAttach?.()}
        >
          {status() === 'error'
            ? translate('velvet.patterns.analysisSourceRow.replace')
            : translate('velvet.common.add')}
        </Button>
      </Show>
    </li>
  );
};
