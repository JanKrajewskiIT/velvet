import { createEffect, createMemo, createSignal, For, mergeProps, on, Show, untrack } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { createId } from '../../utils/id';
import { Count } from '../primitives/Count';
import { EmptyText } from '../primitives/EmptyText';
import { Heading } from '../primitives/Heading';
import { typographyClass } from '../primitives/typography';
import { CommentComposer } from './CommentComposer';
import { CommentItem, type CommentThreadController, type ReplyTarget } from './CommentItem';
import styles from './CommentThread.module.css';
import {
  authorName,
  type Comment,
  type CommentAuthor,
  type CommentId,
  countComments,
  indexComments,
  tidyComments,
  walkComments,
} from './commentTree';

export interface CommentThreadProps {
  comments?: Comment[];
  /** Full tree after any change */
  onChange?: (comments: Comment[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (comments: Comment[]) => void;
  onSubmit?: (body: string, parentId: CommentId | null) => void;
  onEdit?: (id: CommentId, body: string) => void;
  onDelete?: (id: CommentId) => void;
  onLike?: (id: CommentId, liked: boolean) => void;
  /** Author of new comments; comments by this name get Edit / Delete. @default localized "You" */
  currentUser?: string | CommentAuthor;
  canEdit?: (comment: Comment) => boolean;
  /** Replies shown before "Show N more". @default 2 */
  collapseAfter?: number;
  /** Heading; pass '' to hide. @default localized "Comments" */
  title?: string;
  placeholder?: string;
  emptyText?: string;
  /** Time label for new comments. @default localized "Just now" */
  nowLabel?: string;
  class?: string;
}

/**
 * Discussion attached to one object (candidate, document, ticket). One nesting level on purpose — replying to a reply joins the same
 * thread and prefills an @mention. Like, reply, edit / delete own comments (inline confirm; a deleted parent with replies stays as a
 * placeholder). Long threads collapse after `collapseAfter` replies. Composer auto-grows; ⌘↵ sends, Esc cancels. Body is plain text.
 * Manages its own state from `comments`; listen with `onChange` or the per-action callbacks.
 */
export const CommentThread = (props: CommentThreadProps) => {
  const p = mergeProps({ comments: [] as Comment[], collapseAfter: 2 } satisfies CommentThreadProps, props);
  const translate = useTranslate();
  const currentUser = () => p.currentUser ?? translate('velvet.patterns.commentThread.currentUser');
  const title = () => p.title ?? translate('velvet.patterns.commentThread.title');
  const placeholder = () => p.placeholder ?? translate('velvet.patterns.commentThread.placeholder');
  const emptyText = () => p.emptyText ?? translate('velvet.patterns.commentThread.emptyText');
  const nowLabel = () => p.nowLabel ?? translate('velvet.patterns.commentThread.nowLabel');
  const [list, setList] = createSignal(untrack(() => p.comments));
  const [replyTo, setReplyTo] = createSignal<ReplyTarget | null>(null);
  const [editing, setEditing] = createSignal<CommentId | null>(null);
  const [confirming, setConfirming] = createSignal<CommentId | null>(null);
  const [expanded, setExpandedMap] = createSignal<Record<string, boolean>>({});

  createEffect(
    on(
      () => p.comments,
      (comments) => setList(comments),
      { defer: true },
    ),
  );

  const index = createMemo(() => indexComments(list()));
  const currentUserName = createMemo(() => authorName(currentUser()));
  const count = createMemo(() => countComments(list()));

  const commit = (next: Comment[]) => {
    const tidy = tidyComments(next);
    setList(tidy);
    (p.onChange ?? p.onValueChange)?.(tidy);
  };
  const newComment = (body: string): Comment => ({
    id: createId('c'),
    author: currentUser(),
    time: nowLabel(),
    body,
  });
  const setExpanded = (id: CommentId, value: boolean) => setExpandedMap((open) => ({ ...open, [String(id)]: value }));

  const thread: CommentThreadController = {
    get currentUser() {
      return currentUser();
    },
    get currentUserName() {
      return currentUserName();
    },
    get collapseAfter() {
      return p.collapseAfter;
    },
    get editing() {
      return editing();
    },
    get confirming() {
      return confirming();
    },
    get replyTo() {
      return replyTo();
    },
    find: (id) => index().get(id),
    isMine: (comment) => (p.canEdit ? p.canEdit(comment) : authorName(comment.author) === currentUserName()),
    isExpanded: (id) => expanded()[String(id)] === true,
    setExpanded,
    reply: (target) => setReplyTo(target),
    edit: (id) => setEditing(id),
    confirmDelete: (id) => setConfirming(id),
    add: (body, parentId) => {
      if (parentId === null) {
        commit([...list(), { ...newComment(body), replies: [] }]);
      } else {
        const reply = newComment(body);
        commit(
          walkComments(list(), (c) =>
            c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : undefined,
          ),
        );
        setExpanded(parentId, true);
        setReplyTo(null);
      }
      p.onSubmit?.(body, parentId);
    },
    save: (id, body) => {
      commit(walkComments(list(), (c) => (c.id === id ? { ...c, body, edited: true } : undefined)));
      setEditing(null);
      p.onEdit?.(id, body);
    },
    remove: (id) => {
      commit(
        walkComments(list(), (c) => {
          if (c.id !== id) return undefined;
          return (c.replies ?? []).some((reply) => !reply.deleted) ? { ...c, deleted: true, body: '' } : null;
        }),
      );
      setConfirming(null);
      p.onDelete?.(id);
    },
    like: (id) => {
      const target = index().get(id);
      if (!target) return;
      const liked = !target.liked;
      commit(
        walkComments(list(), (c) =>
          c.id === id ? { ...c, liked, likes: Math.max(0, (c.likes ?? 0) + (liked ? 1 : -1)) } : undefined,
        ),
      );
      p.onLike?.(id, liked);
    },
  };

  return (
    <section class={cx(typographyClass('body'), styles.cthread, p.class)} aria-label={title()}>
      <Show when={title()}>
        <header class={styles.cthreadPartHead}>
          <Heading level={3} variant="title" class={styles.cthreadPartTitle}>
            {title()}
          </Heading>
          <Count tone="neutral" value={count()} />
        </header>
      </Show>
      <Show
        when={list().length}
        fallback={
          <EmptyText as="p" align="start" class={styles.cthreadPartEmpty}>
            {emptyText()}
          </EmptyText>
        }
      >
        <ol class={styles.cthreadPartList}>
          <For each={list().map((comment) => comment.id)}>{(id) => <CommentItem id={id} thread={thread} />}</For>
        </ol>
      </Show>
      <CommentComposer
        user={currentUser()}
        placeholder={placeholder()}
        submitLabel={translate('velvet.patterns.commentThread.submit')}
        onSubmit={(text) => thread.add(text, null)}
      />
    </section>
  );
};
