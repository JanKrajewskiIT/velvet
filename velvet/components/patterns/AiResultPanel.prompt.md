Structured model answer (scoring, extraction, review) — not chat. Always pass `model`, `elapsed` and `tokens`/`cost` so people see what produced it. Use `status="streaming"` while waiting.

```jsx
<AiResultPanel model="claude-haiku-4.5" elapsed="1.2s" score={92} headline="Match: very high" subline="Ada Kowalska × Senior Frontend"
  sections={[{ title:'Strengths', icon:'check', tone:'success', items:['4 years of React and TypeScript'] }, { title:'Gaps', icon:'triangle-alert', tone:'warning', items:['No GraphQL experience'] }]}
  tokens={1284} cost="$0.0021" onRegenerate={run} onFeedback={log} />
```
