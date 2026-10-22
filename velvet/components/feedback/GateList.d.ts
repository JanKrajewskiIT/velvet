import * as React from 'react';
export interface GateItem { id?: string; label: React.ReactNode; detail?: React.ReactNode; status: 'pass' | 'fail' | 'warn' | 'pending' | 'skip'; /** Reason / error code, shown mono on the right */ code?: string }
/** Ordered pre-condition checks (readiness, order gates, promotion criteria). The first failure is marked as blocking; later items are dimmed because they were not decisive. */
export interface GateListProps extends React.HTMLAttributes<HTMLDivElement> {
  items: GateItem[];
  /** @default true */
  ordered?: boolean;
  /** Mark first fail as blocking and dim the rest. @default true */
  stopAtFirstFail?: boolean;
  size?: 'sm' | 'md';
}
export declare function GateList(props: GateListProps): JSX.Element;
