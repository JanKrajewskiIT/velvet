import * as React from 'react';
export interface EnvironmentBarItem { label: React.ReactNode; value: React.ReactNode }
/** Always-visible execution-environment strip with key state and the Kill Switch. Each environment has its own colour family (market tokens --env-*): research/replay/shadow neutral, paper info, demo warning, live solid danger. */
export interface EnvironmentBarProps extends React.HTMLAttributes<HTMLDivElement> {
  environment?: 'research' | 'replay' | 'paper' | 'demo' | 'shadow' | 'live';
  /** Override the chip text (default e.g. "PAPER", "LIVE · REAL FUNDS") */
  label?: string;
  /** Key/value state, e.g. Mode, Trading, Process, Account */
  items?: EnvironmentBarItem[];
  /** Live-update connection: live (pulsing), stale (warning), offline (danger) */
  connection?: { state: 'live' | 'stale' | 'offline'; label: React.ReactNode };
  /** Shows the Kill Switch button; open a ConfirmDialog from here, never act directly */
  onKill?: () => void;
  killLabel?: string;
  killDisabled?: boolean;
  sticky?: boolean;
  /** Sticky offset, e.g. navbar height. @default 0 */
  top?: number;
  /** Inner content max width. @default 1360 */
  maxWidth?: number | string;
  actions?: React.ReactNode;
}
export declare function EnvironmentBar(props: EnvironmentBarProps): JSX.Element;
