Put RatingSummary above a review list; wire `onFilter` to filter the list by star. Use Rating (readOnly) on each review row.

```jsx
<RatingSummary counts={[2, 3, 9, 41, 88]} activeStar={star} onFilter={setStar} noun="review" />
```
