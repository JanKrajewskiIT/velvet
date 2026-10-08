Use in a grid (`repeat(auto-fill,minmax(320px,1fr))`) for question banks and quiz prep. Keep `category` to one word; difficulty is stars, not text. Pass `answer` only when you have one.

```jsx
<QuestionCard category="React" level="Senior" difficulty={4} time="18 min" tags={['Hooks']} question="Explain useEffect vs useLayoutEffect." answer="useLayoutEffect runs synchronously after DOM mutations, before paint…" votes={12} voted={v} onVote={toggleVote} starred={s} onStar={toggleStar} />
```
