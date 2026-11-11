Vertical form shell. Renders a <form> (noValidate; onSubmit gets preventDefault for free) or any element. Sets rhythm between sections / grids / fields.

FormLayout stacks `FormSection`s. Each section takes a title and description and lays its fields out on a `FormGrid`, where `FormSpan` stretches a field across the columns.

```jsx
<FormLayout gap="lg" onSubmit={save}>
  <FormSection layout="aside" title="Contact" description="Basic contact details. Visible to everyone on the review team.">
    <FormGrid columns={2}>
      <Input label="First name" />
      <Input label="Last name" />
      <FormSpan><Input label="Email" type="email" /></FormSpan>
    </FormGrid>
  </FormSection>
</FormLayout>
```

**Props.** The full contract is `FormLayoutProps` in `components/index.d.ts`.

- Also accepts the native attributes of the root element.

**Also exports:** FormSection, FormGrid, FormSpan, ActionRow. **CSS:** `.vui-form*`. **Preview:** `components/FormLayout/preview.html` (group Forms).
