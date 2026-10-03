# Development guide

For developers and AI agents. Read [AGENTS.md](../AGENTS.md) first.

## Stack

- Node.js + TypeScript
- AWS SQS (consumer), S3 (storage), PostgreSQL (data and export records)
- Zod for validation, Vitest for tests
- OpenAI tool calling for prompt interpretation

Prefer popular libraries for PDF (for example `pdfkit`), CSV (for example `csv-stringify`), XLSX (for example `exceljs`) and the AWS SDK v3.

## Adding a data tool

1. Define the Zod parameter schema.
2. Write a parameterized, read-only SQL query. Never build SQL from strings that include user or LLM input.
3. Write a short, clear description; the LLM uses it to choose the tool.
4. Register the tool in the catalog.
5. Add unit tests for parameter validation and result mapping.

## Testing

- Mock the database, SQS, S3 and the LLM; do not hit real services.
- Test business rules: tool selection mapping, structured fields overriding the prompt, failure when no tool matches, and generated CSV content.
- Mock every non-trivial import with side effects at import time, even if unused in the test.

## Documentation

- [architecture.md](architecture.md) - design and decisions
- [plan.md](plan.md) - delivery phases
