import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { Text } from '../primitives/Text';
import type { VideoControls } from './createVideoControls';
import { PlayerButton } from './PlayerButton';
import { fmtTime } from './time';
import styles from './VideoControlsBar.module.css';

const VOLUME_STEP = 0.05;
const SEEK_STEP = 0.1;

const percent = (value: number, total: number) => (total ? (value / total) * 100 : 0);

export interface VideoControlsBarProps {
  controls: VideoControls;
}

export const VideoControlsBar = (props: VideoControlsBarProps) => {
  const translate = useTranslate();

  return (
    <div class={styles.playerPartBar}>
      <input
        type="range"
        class={cx(styles.playerPartRange, styles.playerPartSeek)}
        min={0}
        max={props.controls.state().duration}
        step={SEEK_STEP}
        value={props.controls.state().time}
        onInput={(e) => props.controls.seek(e.currentTarget.valueAsNumber)}
        aria-label={translate('velvet.media.player.seek')}
        aria-valuetext={translate('velvet.media.player.position', {
          time: fmtTime(props.controls.state().time),
          duration: fmtTime(props.controls.state().duration),
        })}
        style={{
          '--p': `${percent(props.controls.state().time, props.controls.state().duration)}%`,
          '--b': `${percent(props.controls.buffered(), props.controls.state().duration)}%`,
        }}
      />
      <div class={styles.playerPartRow}>
        <PlayerButton
          icon={props.controls.state().playing ? 'pause' : 'play'}
          label={translate(
            props.controls.state().playing ? 'velvet.media.videoPlayer.pauseKey' : 'velvet.media.videoPlayer.playKey',
            { key: 'k' },
          )}
          onClick={props.controls.toggle}
        />
        <div class={styles.playerPartVol}>
          <PlayerButton
            icon="volume"
            class={props.controls.level() === 0 ? styles.playerPartBtnVariantMuted : undefined}
            label={translate(
              props.controls.muted() ? 'velvet.media.videoPlayer.unmuteKey' : 'velvet.media.videoPlayer.muteKey',
              { key: 'm' },
            )}
            onClick={props.controls.toggleMute}
          />
          <input
            type="range"
            class={cx(styles.playerPartRange, styles.playerPartVolume)}
            min={0}
            max={1}
            step={VOLUME_STEP}
            value={props.controls.level()}
            onInput={(e) => props.controls.changeVolume(e.currentTarget.valueAsNumber)}
            aria-label={translate('velvet.media.player.volume')}
            aria-valuetext={`${Math.round(props.controls.level() * 100)}%`}
            style={{ '--p': `${props.controls.level() * 100}%` }}
          />
        </div>
        <Text as="span" variant="caption" tone="inherit" tabular class={styles.playerPartTime}>
          {fmtTime(props.controls.state().time)}
          <Text as="span" variant="caption" tone="inherit">
            {' '}
            / {fmtTime(props.controls.state().duration)}
          </Text>
        </Text>
        <span class={styles.playerPartSp} />
        <Show when={props.controls.tracks().length > 0}>
          <PlayerButton
            label={translate('velvet.media.videoPlayer.captionsKey', { key: 'c' })}
            pressed={props.controls.captions()}
            class={styles.playerPartBtnVariantTxt}
            onClick={props.controls.toggleCaptions}
          >
            CC
          </PlayerButton>
        </Show>
        <PlayerButton
          label={translate('velvet.media.player.speed', { rate: props.controls.speedLabel() })}
          class={styles.playerPartBtnVariantTxt}
          onClick={props.controls.cycleRate}
        >
          {props.controls.speedLabel()}
        </PlayerButton>
        <PlayerButton
          icon="maximize"
          label={translate(
            props.controls.fullscreen()
              ? 'velvet.media.videoPlayer.exitFullscreenKey'
              : 'velvet.media.videoPlayer.fullscreenKey',
            { key: 'f' },
          )}
          onClick={() => void props.controls.toggleFullscreen().catch(reportAsyncError)}
        />
      </div>
    </div>
  );
};
