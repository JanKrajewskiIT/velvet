import { splitProps } from 'solid-js';

import { CodeLabel, type CodeLabelProps } from '../display/CodeLabel';

export interface InstrumentLabelProps extends Omit<CodeLabelProps, 'code' | 'tag'> {
  symbol: string;
  exchange?: string;
}

/** @deprecated Use CodeLabel with code and tag. */
export const InstrumentLabel = (props: InstrumentLabelProps) => {
  const [local, rest] = splitProps(props, ['symbol', 'exchange']);
  return <CodeLabel {...rest} code={local.symbol} tag={local.exchange} />;
};
