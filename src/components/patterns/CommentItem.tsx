import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Avatar } from '../data/Avatar';
import { Badge } from '../display/Badge';
import { CommentBody } from './CommentBody';
import { CommentComposer } from './CommentComposer';
import { authorName, authorSrc, type Comment, type CommentAuthor, type CommentId } from './commentTree';

export interface ReplyTarget {
  parentId: CommentId;
  prefill: string;
  /** Distinguishes consecutive replies to the same comment so the composer is recreated. */
  key: number;
}

/** State and actions a thread shares with its items. */
export interface CommentThreadController {
  readonly currentUser: string | CommentAuthor;
  readonly currentUserName: string;
  readonly collapseAfter: number;
  readonly editing: CommentId | null;
  readonly confirming: CommentId | null;
  readonly replyTo: ReplyTarget | null;
  find: (id: CommentId) => Comment | undefined;
  isMine: (comment: Comment) => boolean;
  isExpanded: (id: CommentId) => boolean;
  setExpanded: (id: CommentId, expanded: boolean) => void;
  reply: (target: ReplyTarget | null) => void;
  edit: (id: CommentId | null) => void;
  confirmDelete: (id: CommentId | null) => void;
  add: (body: string, parentId: CommentId | null) => void;
  save: (id: CommentId, body: string) => void;
  remove: (id: CommentId) => void;
  like: (id: CommentId) => void;
}

export interface CommentItemProps {
  id: CommentId;
  /** Set for replies; absent for top-level comments. */
  parentId?: CommentId;
  thread: CommentThreadController;
}

const firstName = (name: string): string => name.split(' ')[0] ?? name;

/** One comment with its actions, inline delete confirmation, replies and reply composer. */
export const CommentItem = (props: CommentItemProps) => {
  const translate = useTranslate();
  const top = () => props.parentId === undefined;
  const avatarSize = () => (top() ? 'sm' : 'xs');

  return (
    <Show when={props.thread.find(props.id)}>
      {(comment) => {
        const thread = props.thread;
        const author = () => authorName(comment().author);
        const replies = () => comment().replies ?? [];
        const shown = () => (thread.isExpanded(comment().id) ? replies() : replies().slice(0, thread.collapseAfter));
        const hidden = () => replies().length - shown().length;
        const replyHere = () => (thread.replyTo?.parentId === comment().id ? thread.replyTo : null);
        const confirming = () => thread.confirming === comment().id;
        const likeLabel = () => {
          const likes = comment().likes;
          const key = comment().liked
            ? likes
              ? 'velvet.patterns.commentItem.unlikeCount'
              : 'velvet.patterns.commentItem.unlike'
            : likes
              ? 'velvet.patterns.commentItem.likeCount'
              : 'velvet.patterns.commentItem.like';
          return translate(key, { count: likes });
        };
        const startReply = () => {
          thread.confirmDelete(null);
          thread.reply({
            parentId: props.parentId ?? comment().id,
            prefill: top() || author() === thread.currentUserName ? '' : `@${firstName(author())} `,
            key: Date.now(),
          });
        };
        const startEdit = () => {
          thread.confirmDelete(null);
          thread.edit(comment().id);
        };

        return (
          <li class={cx('vui-cmt', !top() && 'vui-cmt--reply', comment().deleted && 'vui-cmt--deleted')}>
            <Show when={!comment().deleted} fallback={<Avatar initials="–" tone="neutral" size={avatarSize()} />}>
              <Avatar name={author()} src={authorSrc(comment().author)} size={avatarSize()} />
            </Show>
            <div class="vui-cmt__main">
              <Show
                when={!comment().deleted}
                fallback={<div class="vui-cmt__body">{translate('velvet.patterns.commentItem.deleted')}</div>}
              >
                <div class="vui-cmt__meta">
                  <span class="vui-cmt__author">{author()}</span>
                  <Show when={comment().role}>{(role) => <Badge size="sm">{role()}</Badge>}</Show>
                  <time class="vui-cmt__time" datetime={comment().datetime}>
                    {comment().edited
                      ? translate('velvet.patterns.commentItem.timeEdited', { time: comment().time })
                      : comment().time}
                  </time>
                </div>
                <Show
                  when={thread.editing === comment().id}
                  fallback={
                    <>
                      <CommentBody text={comment().body} />
                      <div class="vui-cmt__actions">
                        <Button
                          variant="ghost"
                          size="xs"
                          iconLeft={comment().liked ? 'heart-filled' : 'heart'}
                          class={cx('vui-cmt__act', comment().liked && 'vui-cmt__act--on')}
                          aria-pressed={!!comment().liked}
                          aria-label={likeLabel()}
                          onClick={() => thread.like(comment().id)}
                        >
                          {comment().likes || null}
                        </Button>
                        <Button variant="ghost" size="xs" class="vui-cmt__act" onClick={startReply}>
                          {translate('velvet.patterns.commentItem.reply')}
                        </Button>
                        <Show when={thread.isMine(comment())}>
                          <Button variant="ghost" size="xs" class="vui-cmt__act" onClick={startEdit}>
                            {translate('velvet.common.edit')}
                          </Button>
                          <Button
                            variant="ghost"
                            size="xs"
                            class="vui-cmt__act vui-cmt__act--danger"
                            aria-expanded={confirming()}
                            onClick={() => thread.confirmDelete(confirming() ? null : comment().id)}
                          >
                            {translate('velvet.common.delete')}
                          </Button>
                        </Show>
                      </div>
                    </>
                  }
                >
                  <CommentComposer
                    initial={comment().body}
                    placeholder={translate('velvet.patterns.commentItem.editPlaceholder')}
                    submitLabel={translate('velvet.common.save')}
                    // eslint-disable-next-line jsx-a11y/no-autofocus -- the editor opens right after the user pressed Edit, so focus belongs in it
                    autoFocus
                    onSubmit={(text) => thread.save(comment().id, text)}
                    onCancel={() => thread.edit(null)}
                  />
                </Show>
                <Show when={confirming()}>
                  <div class="vui-cmt__confirm" role="alert">
                    <span>
                      {top() && replies().length
                        ? translate('velvet.patterns.commentItem.deleteConfirmReplies')
                        : translate('velvet.patterns.commentItem.deleteConfirm')}
                    </span>
                    <Button
                      ref={(el) => queueMicrotask(() => el.focus())}
                      variant="ghost"
                      size="sm"
                      onClick={() => thread.confirmDelete(null)}
                    >
                      {translate('velvet.common.cancel')}
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => thread.remove(comment().id)}>
                      {translate('velvet.common.delete')}
                    </Button>
                  </div>
                </Show>
              </Show>
              <Show when={top() && (shown().length > 0 || replyHere())}>
                <div class="vui-cmt__thread">
                  <Show when={shown().length > 0}>
                    <ol class="vui-cmt__replies">
                      <For each={shown().map((reply) => reply.id)}>
                        {(replyId) => <CommentItem id={replyId} parentId={comment().id} thread={thread} />}
                      </For>
                    </ol>
                  </Show>
                  <Show when={hidden() > 0}>
                    <Button
                      variant="link"
                      size="xs"
                      iconLeft="chevron-down"
                      class="vui-cmt__more"
                      onClick={() => thread.setExpanded(comment().id, true)}
                    >
                      {translate('velvet.patterns.commentItem.showMore', { count: hidden() })}
                    </Button>
                  </Show>
                  <Show when={thread.isExpanded(comment().id) && replies().length > thread.collapseAfter}>
                    <Button
                      variant="link"
                      size="xs"
                      iconLeft="chevron-up"
                      class="vui-cmt__more"
                      onClick={() => thread.setExpanded(comment().id, false)}
                    >
                      {translate('velvet.patterns.commentItem.hideReplies')}
                    </Button>
                  </Show>
                  <Show when={replyHere()} keyed>
                    {(target) => (
                      <CommentComposer
                        small
                        user={thread.currentUser}
                        initial={target.prefill}
                        placeholder={translate('velvet.patterns.commentItem.replyTo', { name: firstName(author()) })}
                        submitLabel={translate('velvet.patterns.commentItem.reply')}
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- the composer opens right after the user pressed Reply, so focus belongs in it
                        autoFocus
                        onSubmit={(text) => thread.add(text, comment().id)}
                        onCancel={() => thread.reply(null)}
                      />
                    )}
                  </Show>
                </div>
              </Show>
            </div>
          </li>
        );
      }}
    </Show>
  );
};
