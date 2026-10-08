/** Discussion attached to one object (candidate, document, ticket). One nesting level on purpose — replying to a reply joins the same thread and prefills @mention. Like, reply, edit / delete own comments (inline confirm; a deleted parent with replies stays as a placeholder). Long threads collapse after collapseAfter replies. Composer auto-grows; ⌘↵ sends, Esc cancels. Body is plain text — @mentions are highlighted. Manages its own state from comments; listen with onChange or the per-action callbacks. */
export interface CommentAuthor { name: string; src?: string }
export interface Comment {
  id: string | number;
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
export interface CommentThreadProps {
  comments?: Comment[];
  /** Full tree after any change */
  onChange?: (comments: Comment[]) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (comments: Comment[]) => void;
  onSubmit?: (body: string, parentId: string | number | null) => void;
  onEdit?: (id: string | number, body: string) => void;
  onDelete?: (id: string | number) => void;
  onLike?: (id: string | number, liked: boolean) => void;
  /** Author of new comments; comments by this name get Edit / Delete. @default 'You' */
  currentUser?: string | CommentAuthor;
  canEdit?: (c: Comment) => boolean;
  /** Replies shown before "Show N more". @default 2 */
  collapseAfter?: number;
  /** Heading; pass '' to hide. @default 'Comments' */
  title?: string;
  placeholder?: string;
  emptyText?: string;
  /** Time label for new comments. @default 'Just now' */
  nowLabel?: string;
  className?: string;
}
export declare function CommentThread(props: CommentThreadProps): JSX.Element;
