# AGENTS.md

Guidelines for AI agents working in this repository (`export-document-worker`).

## Principles

- **Do not over-engineer.** Solve the problem at hand. No speculative features, abstractions, or configuration "for the future".
- **Keep it as simple as possible.** Prefer the most straightforward solution, even if it is less "elegant". Duplicating a few lines is better than a premature abstraction.
- **No defensive programming.** Do not add guards, try/catch blocks, fallbacks, or validation for cases that cannot happen. Validate only at system boundaries (external input, queue messages, HTTP requests, third-party responses). Let unexpected errors fail loudly.
- **Use popular libraries.** Prefer well-known, actively maintained libraries over custom implementations. Do not reinvent date handling, validation, retries, PDF/CSV/XLSX generation, etc. Avoid obscure or unmaintained packages.
- **Stay in scope.** Change only what was requested or is clearly necessary. Do not refactor, rename, or reformat unrelated code.

## Workflow

1. **Plan first.** For any non-trivial task, write a short plan (steps, files affected, expected outcome) before changing code.
2. **Implement in small steps.** Follow the plan; update it if something changes.
3. **Evaluate the outputs.** After implementing, run the relevant tests, build, and lint, and check the actual results (logs, generated files, error output). Do not assume it works.
4. **Report briefly.** Summarize what changed and what was verified. Mention anything that could not be verified.

## Approval

Do not ask for approval on routine work (editing code, adding tests, running tests/lint/build). Ask for approval **only** for relevant flows or files:

- Core export/document generation flow and job/queue processing logic
- Data model, database schema, or migrations
- Authentication, authorization, secrets, and environment/config files
- Infrastructure and deployment (Dockerfile, CI/CD, cloud resources)
- Adding or replacing a major dependency
- Destructive or hard-to-reverse actions (deleting files/branches, force push, dropping data)

## Testing

- Write **relevant and useful** unit tests: cover business rules, branching logic, transformations, and error paths that matter.
- Do not write tests that only restate the implementation, test trivial getters/setters, or test the framework/library itself.
- Mock external boundaries (network, storage, queues, third-party SDKs); do not mock the unit under test.
- Mock every non-trivial import of the unit under test that has side effects at import time, even if unused in the test.
- Keep tests small, readable, and deterministic (no real time, randomness, or network).
- Run the tests and confirm they pass before finishing.

## Code Style

- Follow the existing conventions, formatter, and linter config of the repository.
- Use clear names; add a comment only when the code cannot explain itself, in one short line.
- Do not create documentation files unless requested.
- Keep documentation in `docs/`.

## Security

- Never commit secrets, tokens, or credentials. Use environment variables.
- Treat all external input as untrusted at the boundaries.
- Follow OWASP Top 10 practices.
