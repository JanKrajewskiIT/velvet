export interface PromptAttachment {
  id?: string;
  name: string;
  size?: string;
  icon?: string;
}

export interface PromptSubmissionProps {
  /** Clears unchanged text after acceptance; false or rejection preserves the draft. */
  onSubmit?: (text: string, attachments: PromptAttachment[], signal: AbortSignal) => unknown;
  onError?: (error: unknown) => void;
  loading?: boolean;
  disabled?: boolean;
  attachments?: PromptAttachment[];
}
