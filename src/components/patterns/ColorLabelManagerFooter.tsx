import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Button } from '../actions/Button';
import styles from './ColorLabelManagerFooter.module.css';
import type { ColorLabelManagerController } from './createColorLabelManager';

export interface ColorLabelManagerFooterProps {
  manager: ColorLabelManagerController;
}

/** Dialog footer: "Add label" while browsing, Cancel / Save while the form is open. */
export const ColorLabelManagerFooter = (props: ColorLabelManagerFooterProps) => {
  const translate = useTranslate();
  return (
    <Show
      when={props.manager.draft()}
      fallback={
        <Button variant="secondary" iconLeft="plus" class={styles.clmPartAdd} onClick={props.manager.startAdd}>
          {translate('velvet.patterns.colorLabelManager.addLabel')}
        </Button>
      }
    >
      {(current) => (
        <>
          <Button variant="secondary" onClick={props.manager.cancelDraft}>
            {translate('velvet.common.cancel')}
          </Button>
          <Button
            onClick={() => void props.manager.save().catch(reportAsyncError)}
            disabled={!current().name.trim() || props.manager.busy()}
            loading={props.manager.busy()}
          >
            {props.manager.busy()
              ? translate('velvet.patterns.colorLabelManager.saving')
              : translate('velvet.common.save')}
          </Button>
        </>
      )}
    </Show>
  );
};
