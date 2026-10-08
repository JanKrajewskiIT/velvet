import { useTranslate } from '../../i18n/useTranslate';
import type { SkipRow } from './diffView';

export interface DiffSkipProps {
  skip: SkipRow;
  onExpand: (key: number) => void;
}

/** Control that unfolds a run of unchanged lines. */
export const DiffSkip = (props: DiffSkipProps) => {
  const translate = useTranslate();
  return (
    <button type="button" class="vui-diff__skip" onClick={() => props.onExpand(props.skip.key)}>
      {translate('velvet.data.diffSkip.showUnchanged', { count: props.skip.count })}
    </button>
  );
};
