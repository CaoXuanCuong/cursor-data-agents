---
name: mongodb-reporting
description: Query MongoDB and generate report markdown files in `reports/<report-name>.md` with a consistent template (Query description, MongoDB query used, Result data, Summary insights). Use when working in `reports/`, when generating reports, or when MongoDB queries/results are involved.
---

# MongoDB Reporting

## Quick start

When the user asks for MongoDB data or a report:

1. Pick a short report name (kebab-case) and write to `reports/<report-name>.md`.
2. Run the MongoDB query/aggregation (preferably via the configured MongoDB MCP).
3. Save results in the report using the template below.
4. Include brief, decision-useful insights (not narration).

## Required report template

Create a markdown file under `reports/` that contains these sections (in this order):

````markdown
# <Report title>

## Query description
<What you are answering, which db/collection(s), and key filters/time window>

## MongoDB query used
```js
<exact query or aggregation pipeline>
```

## Result data
```json
<raw result JSON>
```

## Summary insights
- **<insight>**: <short interpretation tied to the result>
````

## Output rules

- **Always write results to disk**: never leave query results only in chat; always create/update `reports/<report-name>.md`.
- **Prefer exact reproducibility**: include the *exact* query used (copy/pasteable).
- **Result format**:
  - Use a JSON code block for objects/arrays, counts, grouped stats, etc.
  - Use a markdown table when it improves readability (and keep raw JSON if it’s important for precision).
- **Insights**: keep to 1–5 bullets; highlight totals, deltas, anomalies, and “so what”.

## Example (minimal)

````markdown
# Customer count

## Query description
Count all documents in the `customers` collection in the `bloy` database.

## MongoDB query used
```js
db.customers.countDocuments({})
```

## Result data
```json
{ "count": 5036642 }
```

## Summary insights
- **Total customers**: 5,036,642
````
