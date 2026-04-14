import { For, Show } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import RadarChart from '~/components/charts/RadarChart/RadarChart';
import Spinner from '~/components/loaders/Spinner/Spinner';
import Dialog from '~/components/overlays/Dialog/Dialog';
import DialogActions from '~/components/overlays/Dialog/DialogActions/DialogActions';
import DialogBody from '~/components/overlays/Dialog/DialogBody/DialogBody';
import DialogTitle from '~/components/overlays/Dialog/DialogTitle/DialogTitle';
import Table from '~/components/table/Table/Table';
import TableBody from '~/components/table/Table/TableBody/TableBody';
import TableCell from '~/components/table/Table/TableCell/TableCell';
import TableHead from '~/components/table/Table/TableHead/TableHead';
import TableHeader from '~/components/table/Table/TableHeader/TableHeader';
import TableRow from '~/components/table/Table/TableRow/TableRow';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ComparisonInsightsDialog.module.css';

interface ComparisonInsightsAxis {
  label: string;
  key: string;
}

interface ComparisonInsightsDataset {
  label: string;
  values: number[];
  color?: string;
}

interface ComparisonInsightsColumn {
  label: string;
  description?: string;
  accentColor?: string;
}

interface ComparisonInsightsRow {
  label: string;
  values: string[];
}

interface ComparisonInsightsDialogProps {
  open: boolean;
  title: string;
  prompt: string;
  onClose: () => void;
  onCompare: () => void | Promise<void>;
  isPending?: boolean;
  hasResult: boolean;
  selectionSummary?: string;
  axes?: readonly ComparisonInsightsAxis[];
  datasets?: readonly ComparisonInsightsDataset[];
  columns?: readonly ComparisonInsightsColumn[];
  rows?: readonly ComparisonInsightsRow[];
}

const ComparisonInsightsDialog = (props: Props<ComparisonInsightsDialogProps>) => {
  const { ts } = useI18n();

  return (
    <Show when={props.open}>
      <Dialog open={props.open} onClose={props.onClose} class={classNames(styles.dialog, props.class)}>
        <DialogTitle label={props.title} />

        <DialogBody>
          <Show when={!props.hasResult && !props.isPending}>
            <div class={styles.prompt}>
              <Text as="p" variant="bodySm" tone="muted" class={styles.promptText}>
                {props.prompt}
              </Text>
              <Show when={props.selectionSummary}>
                <Text as="p" variant="bodyMd" tone="primary" class={styles.selectionSummary}>
                  {props.selectionSummary}
                </Text>
              </Show>
              <Button onClick={() => void props.onCompare()}>{ts('comparison.compare')}</Button>
            </div>
          </Show>

          <Show when={props.isPending}>
            <div class={styles.loading}>
              <Spinner size="md" />
            </div>
          </Show>

          <Show when={props.hasResult && (props.columns?.length ?? 0) > 0}>
            <div class={styles.content}>
              <Show when={(props.axes?.length ?? 0) > 0 && (props.datasets?.length ?? 0) > 0}>
                <div class={styles.chartSection}>
                  <RadarChart axes={[...(props.axes ?? [])]} datasets={[...(props.datasets ?? [])]} />
                </div>
              </Show>

              <div class={styles.tableWrapper}>
                <Table class={styles.table}>
                  <TableHead>
                    <TableRow>
                      <TableHeader class={styles.criteriaHeader} />
                      <For each={props.columns ?? []}>
                        {(column) => (
                          <TableHeader
                            class={styles.offerHeader}
                            style={{ '--accent-color': column.accentColor ?? 'var(--color-primary)' }}
                          >
                            <Text as="span" variant="labelMd" tone="default" class={styles.offerLabel}>
                              {column.label}
                            </Text>
                            <Show when={column.description}>
                              <Text as="span" variant="caption" tone="muted" class={styles.offerDescription}>
                                {column.description}
                              </Text>
                            </Show>
                          </TableHeader>
                        )}
                      </For>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <For each={props.rows ?? []}>
                      {(row) => (
                        <TableRow>
                          <TableCell class={styles.criteriaCell}>
                            <Text as="span" variant="labelMd" tone="muted">
                              {row.label}
                            </Text>
                          </TableCell>
                          <For each={props.columns ?? []}>
                            {(_, index) => (
                              <TableCell class={styles.valueCell}>
                                <Text as="span" variant="bodySm">
                                  {row.values[index()] ?? ''}
                                </Text>
                              </TableCell>
                            )}
                          </For>
                        </TableRow>
                      )}
                    </For>
                  </TableBody>
                </Table>
              </div>
            </div>
          </Show>
        </DialogBody>

        <Show when={props.hasResult}>
          <DialogActions>
            <Button variant="ghost" onClick={props.onClose}>
              {ts('common.clear')}
            </Button>
          </DialogActions>
        </Show>
      </Dialog>
    </Show>
  );
};

export type {
  ComparisonInsightsAxis,
  ComparisonInsightsColumn,
  ComparisonInsightsDataset,
  ComparisonInsightsDialogProps,
  ComparisonInsightsRow,
};
export default ComparisonInsightsDialog;
