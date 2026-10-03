# Plan

Incremental delivery. Each phase ends with passing tests and a working flow.

## Phase 1 - Skeleton

- Node.js + TypeScript project, Vitest, linter/formatter.
- Env config validated at startup.
- SQS consumer with message schema validation (Zod).

## Phase 2 - Export without LLM

- PostgreSQL access with a read-only user.
- One data tool (`getAuctionStats`) called directly from structured message fields.
- Format requested by the user, validated before any query runs. Supported: CSV, XLSX, PDF.
- Unsupported format: stop the process, mark the export as failed with a reason and do not retry.
- CSV generator, S3 upload, export record saved in the DB.
- End-to-end flow: message -> CSV in S3 -> DB record.

## Phase 3 - XLSX and PDF

- XLSX and PDF generators for the same tool results.
- Generator selected from the requested format.

## Phase 4 - Prompt interpretation

- OpenAI tool calling that maps the prompt to a tool and its parameters. The format comes from the message.
- More tools are added as needed (for example bids over a date range).
- Handling of prompts that match no tool (export marked as failed with a reason).

## Phase 5 - Hardening (done)

- Query timeout of 30 seconds on the database connection.
- Unexpected errors mark the export `FAILED` with a generic reason and the message is acknowledged (no SQS retry). The AWS and OpenAI SDKs still retry transient errors. The DLQ only receives messages that cannot be parsed.
- Logging stays on `console`; metrics come from SQS and CloudWatch.
- Dockerfile (multi-stage, Node 24). Deployment is handled outside this repo.
- Row limit postponed until a tool returns lists; today `getAuctionStats` returns one row.

## Decisions pending

- How the requester receives the result.
- Exact SQS message contract.
