One turn in an AI or support conversation. `user` is a right-aligned, brand-tinted bubble; `assistant` is an avatar with plain text and a row of tools (Copy, Regenerate, thumbs up / down); `system` is a centred note. Compose messages inside `ChatThread`, with `PromptInput` below.

`streaming` shows a blinking caret, or the typing indicator while the body is still empty, and hides the tools until the answer is complete. `error` renders an inline alert with Retry. Pass plain text in `content` (it is also what Copy puts on the clipboard) and use `children` for rich content such as Markdown or code. `sources` adds numbered citation chips under the answer.

**Props.** The full contract is `ChatMessageProps` in `components/index.d.ts`.

- `role`: `'user' | 'assistant' | 'system'`
- `content`, `children`, `author`, `avatar`, `time`
- `streaming`, `error`, `onRetry`, `onCopy`
- `feedback`, `onFeedback`, `sources`, `actions`

**Built from: Avatar, Glyph, IconButton.** **CSS:** `.vui-chatmsg*`. **Preview:** `components/ChatMessage/preview.html` (group Patterns). Defined in the same module as `TypingIndicator`.
