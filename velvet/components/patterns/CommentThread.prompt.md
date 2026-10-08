Discussion attached to one object. One nesting level on purpose — deeper trees belong in a dedicated view. Pass `currentUser` so the right comments get Edit / Delete.

```jsx
<CommentThread currentUser="Ada Kowalska" comments={[{ id:1, author:'Jan Dąbrowski', time:'2h', body:'Moved the review to Thursday.', replies:[{ id:2, author:'Ada Kowalska', time:'1h', body:'@Jan works for me.' }] }]} onChange={save} />
```
