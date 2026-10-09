import { useTranslate } from '../../i18n/useTranslate';
import { EmptyText } from '../primitives/EmptyText';
import type { DataGridController } from './dataGridController';

export interface GridEmptyProps<T extends object> {
  grid: DataGridController<T>;
}

/** Message for an empty view, naming the search term and active filters that caused it. */
export const GridEmpty = <T extends object>(props: GridEmptyProps<T>) => {
  const translate = useTranslate();
  const message = () => {
    const count = props.grid.view.activeFilters();
    const term = props.grid.view.search();
    if (term && count) return translate('velvet.data.dataGrid.noRowsTermFilters', { term, count });
    if (term) return translate('velvet.data.dataGrid.noRowsTerm', { term });
    if (count) return translate('velvet.data.dataGrid.noRowsFilters', { count });
    return translate('velvet.data.dataGrid.noRows');
  };
  return <EmptyText class="vui-grid__empty">{message()}</EmptyText>;
};
