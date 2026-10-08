Input is the standard text field with built-in label, hint and error. Email/URL are Input recipes (`type` + `validate`), not separate components. For multi-line text use `Textarea`; for phone numbers `PhoneInput`; passwords `PasswordInput`.

```jsx
<Input label="Email" type="email" placeholder="you@company.com" iconLeft="mail" />
<Input label="Workspace" error="This name is already taken" />
<Input label="Website" type="url" iconLeft="globe" validate={isUrl} />
```

- Sizes sm/md/lg match Button heights so they align in a row.
- Plain HTML: `.vui-field > .vui-label + .vui-control > input.vui-control__input`
