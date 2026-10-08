import { type JSX, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Spinner } from '../feedback/Spinner';
import { Checkmark } from '../primitives/Checkmark';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { type AnalysisSource, KIND_ICON, sourceStatus } from './analysisSources';
import type { StaticTranslate } from './englishText';

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
    <li class={cx('vui-areq__src', `vui-areq__src--${status()}`, props.included && 'vui-areq__src--on')}>
      <button
        type="button"
        class="vui-areq__srcbtn"
        role="checkbox"
        aria-checked={props.included}
        disabled={status() !== 'ready'}
        onClick={() => props.onToggle(props.source)}
      >
        <IconTile size="sm" class="vui-areq__sicon">
          <Show when={status() === 'loading'} fallback={<Glyph name={iconName()} />}>
            <Spinner size="inline" tone="current" />
          </Show>
        </IconTile>
        <span class="vui-areq__st">
          <span class="vui-areq__sname">
            {props.source.label}
            <Show when={props.required}>
              <span class="vui-areq__req">{translate('velvet.patterns.analysisSourceRow.required')}</span>
            </Show>
          </span>
          <span class="vui-areq__sdet">{detailOf(props.source, translate)}</span>
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
          class="vui-areq__attach"
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
