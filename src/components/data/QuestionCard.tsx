import { createUniqueId, For, type JSX, mergeProps, Show, splitProps } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import type { HtmlProps } from '../../utils/polymorphic';
import type { StatusTone } from '../../utils/tone';
import { Button } from '../actions/Button';
import { IconButton } from '../actions/IconButton';
import { Badge } from '../display/Badge';
import { Card, type CardProps } from '../display/Card';
import { Rating } from '../forms/Rating';
import { Glyph } from '../primitives/Glyph';

export interface QuestionCardProps extends HtmlProps<HTMLElement, 'title'> {
  question: JSX.Element;
  category?: string;
  /** @default 'brand' */
  categoryTone?: StatusTone;
  /** e.g. 'Senior'. */
  level?: string;
  /** 1–5 stars, read-only. */
  difficulty?: number;
  /** e.g. '15 min'. */
  time?: string;
  tags?: string[];
  /** Model answer; adds the Show / Hide answer control. */
  answer?: JSX.Element;
  votes?: number;
  voted?: boolean;
  /** Shows the upvote button. */
  onVote?: () => void;
  starred?: boolean;
  /** Shows the save (star) button. */
  onStar?: () => void;
  expanded?: boolean;
  /** @default false */
  defaultExpanded?: boolean;
  onExpandedChange?: (open: boolean) => void;
  /** Card padding. @default 'sm' */
  padding?: CardProps['padding'];
  /** Card pass-through. */
  variant?: CardProps['variant'];
  tone?: CardProps['tone'];
  accent?: CardProps['accent'];
  hoverable?: CardProps['hoverable'];
  reveal?: CardProps['reveal'];
  selected?: CardProps['selected'];
}

/** Interview / quiz question card built on Card. Without `answer` it renders a plain heading instead of an expander. */
export const QuestionCard = (props: QuestionCardProps) => {
  const merged = mergeProps(
    {
      categoryTone: 'brand',
      padding: 'sm',
      tags: [],
      voted: false,
      starred: false,
    } satisfies Partial<QuestionCardProps>,
    props,
  );
  const [local, rest] = splitProps(merged, [
    'question',
    'category',
    'categoryTone',
    'level',
    'difficulty',
    'time',
    'tags',
    'answer',
    'votes',
    'voted',
    'onVote',
    'starred',
    'onStar',
    'expanded',
    'defaultExpanded',
    'onExpandedChange',
    'padding',
    'class',
  ]);
  const answerId = createUniqueId();
  const translate = useTranslate();
  const [open, setOpen] = createControllable<boolean>({
    value: () => props.expanded,
    defaultValue: props.defaultExpanded ?? false,
    onChange: (next) => props.onExpandedChange?.(next),
  });
  const toggle = () => setOpen(!open());
  const hasMeta = () => !!local.difficulty || !!local.time || local.tags.length > 0;

  return (
    <Card
      {...rest}
      as="article"
      padding={local.padding}
      class={cx('vui-qcard', open() && 'vui-qcard--open', local.class)}
    >
      <div class="vui-qcard__top">
        <div class="vui-qcard__badges">
          <Show when={local.category}>
            {(category) => (
              <Badge tone={local.categoryTone} size="sm">
                {category()}
              </Badge>
            )}
          </Show>
          <Show when={local.level}>
            {(level) => (
              <Badge variant="outline" size="sm">
                {level()}
              </Badge>
            )}
          </Show>
        </div>
        <Show when={local.onStar}>
          <IconButton
            icon="star"
            label={translate(local.starred ? 'velvet.data.questionCard.removeSaved' : 'velvet.data.questionCard.save')}
            aria-pressed={local.starred}
            variant={local.starred ? 'soft' : 'ghost'}
            size="sm"
            onClick={() => local.onStar?.()}
          />
        </Show>
      </div>
      <Show when={local.answer} fallback={<h3 class="vui-qcard__q">{local.question}</h3>}>
        <button
          type="button"
          class="vui-qcard__q vui-qcard__q--btn"
          aria-expanded={open()}
          aria-controls={answerId}
          onClick={toggle}
        >
          {local.question}
        </button>
      </Show>
      <Show when={hasMeta()}>
        <div class="vui-qcard__meta">
          <Show when={local.difficulty}>
            {(difficulty) => (
              <Rating
                readOnly
                size="sm"
                value={difficulty()}
                label={translate('velvet.data.questionCard.difficulty')}
              />
            )}
          </Show>
          <Show when={local.time}>
            {(time) => (
              <span class="vui-qcard__time">
                <Glyph name="clock" />
                {time()}
              </span>
            )}
          </Show>
          <For each={local.tags}>{(tag) => <Badge size="sm">{tag}</Badge>}</For>
        </div>
      </Show>
      <Show when={local.answer}>
        {(answer) => (
          <div id={answerId} class="vui-qcard__answer" role="region" hidden={!open()}>
            {answer()}
          </div>
        )}
      </Show>
      <Show when={local.onVote || local.answer}>
        <div class="vui-qcard__foot">
          <Show when={local.onVote}>
            <button
              type="button"
              class={cx('vui-qcard__vote', local.voted && 'vui-qcard__vote--on')}
              aria-pressed={local.voted}
              onClick={() => local.onVote?.()}
            >
              <Glyph name="arrow-up" />
              {local.votes ?? 0}
              <span class="vui-qcard__sr">{` ${translate(local.voted ? 'velvet.data.questionCard.voted' : 'velvet.data.questionCard.vote')}`}</span>
            </button>
          </Show>
          <Show when={local.answer}>
            <Button
              variant="ghost"
              size="sm"
              iconRight={open() ? 'chevron-up' : 'chevron-down'}
              class="vui-qcard__toggle"
              onClick={toggle}
            >
              {translate(open() ? 'velvet.data.questionCard.hideAnswer' : 'velvet.data.questionCard.showAnswer')}
            </Button>
          </Show>
        </div>
      </Show>
    </Card>
  );
};
