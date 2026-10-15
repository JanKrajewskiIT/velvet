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
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './QuestionCard.module.css';

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
      class={cx(styles.qcard, open() && styles.qcardVariantOpen, local.class)}
      bodyClass={styles.cardBody}
    >
      <div class={styles.qcardPartTop}>
        <div class={styles.qcardPartBadges}>
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
      <Show
        when={local.answer}
        fallback={
          <Text as="h3" variant="label" tone="inherit" class={styles.qcardPartQ}>
            {local.question}
          </Text>
        }
      >
        <button
          type="button"
          class={cx(styles.qcardPartQ, styles.qcardPartQVariantBtn, typographyClass('label'))}
          aria-expanded={open()}
          aria-controls={answerId}
          onClick={toggle}
        >
          {local.question}
        </button>
      </Show>
      <Show when={hasMeta()}>
        <div class={styles.qcardPartMeta}>
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
              <Text as="span" variant="caption" tone="tertiary" class={styles.qcardPartTime}>
                <Glyph name="clock" />
                {time()}
              </Text>
            )}
          </Show>
          <For each={local.tags}>{(tag) => <Badge size="sm">{tag}</Badge>}</For>
        </div>
      </Show>
      <Show when={local.answer}>
        {(answer) => (
          <Text
            as="div"
            variant="body-sm"
            tone="secondary"
            id={answerId}
            class={styles.qcardPartAnswer}
            role="region"
            hidden={!open()}
          >
            {answer()}
          </Text>
        )}
      </Show>
      <Show when={local.onVote || local.answer}>
        <div class={styles.qcardPartFoot}>
          <Show when={local.onVote}>
            <button
              type="button"
              class={cx(
                typographyClass('button-sm'),
                styles.qcardPartVote,
                local.voted && styles.qcardPartVoteVariantOn,
              )}
              aria-pressed={local.voted}
              onClick={() => local.onVote?.()}
            >
              <Glyph name="arrow-up" />
              {local.votes ?? 0}
              <Text
                as="span"
                variant="caption"
                tone="inherit"
                class={styles.qcardPartSr}
              >{` ${translate(local.voted ? 'velvet.data.questionCard.voted' : 'velvet.data.questionCard.vote')}`}</Text>
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
