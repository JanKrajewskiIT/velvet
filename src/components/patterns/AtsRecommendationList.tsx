import { createMemo, createSignal, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { SectionLabel } from '../primitives/SectionLabel';
import { type AtsRecommendation, SEVERITY, VISIBLE_RECOMMENDATIONS } from './atsAnalysis';

export interface AtsRecommendationListProps {
  /** Already sorted critical → warning → suggestion. */
  recommendations: AtsRecommendation[];
}

/** Ranked recommendations with evidence quotes; shows the first few and expands on demand. */
export const AtsRecommendationList = (props: AtsRecommendationListProps) => {
  const translate = useTranslate();
  const [showAll, setShowAll] = createSignal(false);
  const visible = createMemo(() =>
    showAll() ? props.recommendations : props.recommendations.slice(0, VISIBLE_RECOMMENDATIONS),
  );

  return (
    <section class="vui-ats__sec">
      <SectionLabel as="h4" class="vui-ats__h">
        {translate('velvet.patterns.atsRecommendationList.title')}
      </SectionLabel>
      <ul class="vui-ats__recs">
        <For each={visible()}>
          {(recommendation) => {
            const severity = () => SEVERITY[recommendation.severity];
            return (
              <li class={`vui-ats__rec vui-ats__rec--${severity().tone}`}>
                <IconTile
                  size="xs"
                  tone={severity().tone === 'info' ? 'brand' : severity().tone}
                  icon={severity().icon}
                />
                <div class="vui-ats__rbody">
                  <div class="vui-ats__rh">
                    <b>{recommendation.title}</b>
                    <span class="vui-ats__rsev">{translate(severity().labelKey)}</span>
                  </div>
                  <Show when={recommendation.message}>
                    <p>{recommendation.message}</p>
                  </Show>
                  <Show when={recommendation.evidence}>
                    {(evidence) => (
                      <blockquote class="vui-ats__ev">
                        <span>“{evidence().quote}”</span>
                        <Show when={evidence().source}>
                          <cite>— {evidence().source}</cite>
                        </Show>
                      </blockquote>
                    )}
                  </Show>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
      <Show when={props.recommendations.length > VISIBLE_RECOMMENDATIONS}>
        <button type="button" class="vui-ats__more" aria-expanded={showAll()} onClick={() => setShowAll(!showAll())}>
          {showAll()
            ? translate('velvet.patterns.atsRecommendationList.showFewer')
            : translate('velvet.patterns.atsRecommendationList.showAll', { count: props.recommendations.length })}
          <Glyph name={showAll() ? 'chevron-up' : 'chevron-down'} />
        </button>
      </Show>
    </section>
  );
};
