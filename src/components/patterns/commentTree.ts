export type CommentId = string | number;

export interface CommentAuthor {
  name: string;
  src?: string;
}

export interface Comment {
  id: CommentId;
  author: string | CommentAuthor;
  /** Display time, e.g. "2h" */
  time?: string;
  datetime?: string;
  body: string;
  /** Small badge after the name, e.g. "Recruiter" */
  role?: string;
  edited?: boolean;
  likes?: number;
  liked?: boolean;
  deleted?: boolean;
  replies?: Comment[];
}

export const authorName = (author: string | CommentAuthor | undefined): string =>
  typeof author === 'string' ? author : (author?.name ?? '');

export const authorSrc = (author: string | CommentAuthor | undefined): string | undefined =>
  typeof author === 'object' ? author.src : undefined;

/** `undefined` keeps the comment, `null` removes it, a comment replaces it. */
export type CommentVisit = (comment: Comment) => Comment | null | undefined;

/** Applies `visit` to every comment of the tree and returns a new tree. */
export const walkComments = (list: Comment[], visit: CommentVisit): Comment[] =>
  list.flatMap((comment) => {
    const visited = visit(comment);
    if (visited === null) return [];
    const next = visited ?? comment;
    return [next.replies ? { ...next, replies: walkComments(next.replies, visit) } : next];
  });

/** Drops deleted placeholders that no longer hold replies. */
export const tidyComments = (list: Comment[]): Comment[] =>
  list.filter((comment) => !(comment.deleted && !(comment.replies ?? []).length));

/** Live comments: top-level plus direct replies, placeholders excluded. */
export const countComments = (list: Comment[]): number =>
  list.reduce(
    (total, comment) =>
      total + (comment.deleted ? 0 : 1) + (comment.replies ?? []).filter((reply) => !reply.deleted).length,
    0,
  );

export const indexComments = (list: Comment[], into = new Map<CommentId, Comment>()): Map<CommentId, Comment> => {
  for (const comment of list) {
    into.set(comment.id, comment);
    if (comment.replies) indexComments(comment.replies, into);
  }
  return into;
};
