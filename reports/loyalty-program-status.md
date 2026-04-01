# Loyalty program status (true/false)

## Query description
Break down loyalty programs by boolean `status` (enabled/disabled) to understand how many programs are active (`true`) vs inactive (`false`).

## MongoDB query used
Collection: `loyaltyprograms` (database: `bloy`)

Aggregation:

```js
db.loyaltyprograms.aggregate([
  {
    $group: {
      _id: { $ifNull: ["$status", "__MISSING__"] },
      count: { $sum: 1 }
    }
  },
  { $sort: { count: -1 } }
]);
```

## Result data

| status | count | percent |
| --- | ---:| ---:|
| true | 4,587 | 87.57% |
| false | 651 | 12.43% |

Total documents analyzed: **5,238**

Raw aggregation output:

```json
[
  { "_id": true, "count": 4587 },
  { "_id": false, "count": 651 }
]
```

## Summary insights
- **Most loyalty programs are enabled**: 4,587 of 5,238 (\(~87.6%\)) have `status=true`.
- **A meaningful minority are disabled**: 651 of 5,238 (\(~12.4%\)) have `status=false`.

