Card = Surface + regions (header · body · footer). Paint (`variant`), hue (`tone`, `accent`), behaviour (`hoverable` / `interactive` / `tonal`) and state (`selected`, `reveal`) are Surface props passed through — choose them by the Surface rules.

Use Card for any content block that needs a title, actions or a footer. Need media, a scrim or hairline-divided regions → `StructuredCard`. Need just a painted box → `Surface`.

Never nest interactive cards or put buttons inside an `interactive` card — use `hoverable` instead.

```jsx
<Card title="Usage" description="Last 30 days" actions={<IconButton icon="more-horizontal" label="More" size="sm" />}
      footer={<Button size="sm" variant="secondary">View report</Button>}>…</Card>

<Card as="a" href="/team/design" interactive tonal tone="violet" accent reveal={i}>…</Card>
```
