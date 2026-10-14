import { Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { reportAsyncError } from '../../utils/reportAsyncError';
import type { VideoControls } from './createVideoControls';
import { PlayerButton } from './PlayerButton';
import { fmtTime } from './time';

const VOLUME_STEP = 0.05;
const SEEK_STEP = 0.1;

const percent = (value: number, total: number) => (total ? (value / total) * 100 : 0);

export interface VideoControlsBarProps {
  controls: VideoControls;
}

export const VideoControlsBar = (props: VideoControlsBarProps) => {
  const translate = useTranslate();

  return (
    <div class="vui-player__bar">
      <input
        type="range"
        class="vui-player__range vui-player__seek"
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
      <div class="vui-player__row">
        <PlayerButton
          icon={props.controls.state().playing ? 'pause' : 'play'}
          label={translate(
            props.controls.state().playing ? 'velvet.media.videoPlayer.pauseKey' : 'velvet.media.videoPlayer.playKey',
            { key: 'k' },
          )}
          onClick={props.controls.toggle}
        />
        <div class="vui-player__vol">
          <PlayerButton
            icon="volume"
            class={props.controls.level() === 0 ? 'vui-player__btn--muted' : undefined}
            label={translate(
              props.controls.muted() ? 'velvet.media.videoPlayer.unmuteKey' : 'velvet.media.videoPlayer.muteKey',
              { key: 'm' },
            )}
            onClick={props.controls.toggleMute}
          />
          <input
            type="range"
            class="vui-player__range vui-player__volume"
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
        <span class="vui-player__time">
          {fmtTime(props.controls.state().time)}
          <span> / {fmtTime(props.controls.state().duration)}</span>
        </span>
        <span class="vui-player__sp" />
        <Show when={props.controls.tracks().length > 0}>
          <PlayerButton
            label={translate('velvet.media.videoPlayer.captionsKey', { key: 'c' })}
            pressed={props.controls.captions()}
            class="vui-player__btn--txt"
            onClick={props.controls.toggleCaptions}
          >
            CC
          </PlayerButton>
        </Show>
        <PlayerButton
          label={translate('velvet.media.player.speed', { rate: props.controls.speedLabel() })}
          class="vui-player__btn--txt"
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
