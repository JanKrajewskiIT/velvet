Full-width strip at the top of the page/app — system status, trial ending, maintenance. One at a time.

Defined in the same module as `Alert`; see its README for the related components.

One Banner at a time, at the top of the page or app. For a message inside a section use `Alert`.

```jsx
<Banner tone="warning" action={<Button size="sm" variant="secondary">Add payment</Button>}>
  Your trial ends in 3 days.
</Banner>

<Banner tone="brand" onClose={dismiss}>Velvet 3.0 is here — faster boards and dark mode.</Banner>
```

**Props.** The full contract is `BannerProps` in `components/index.d.ts`.

- `tone`: `'neutral' | 'brand' | 'info' | 'success' | 'warning' | 'danger'`
- `children`: `ReactNode`
- `action`: `ReactNode`
- `onClose`: `() => void`
- `icon`: `string | null`
- `sticky`: `boolean`

**Preview:** `components/Banner/preview.html` (group Feedback).
