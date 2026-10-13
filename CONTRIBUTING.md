# Contributing

## Team workflow

1. Create or select a GitHub issue before starting a task and agree on its owner.
2. Create a branch from `main`, for example `feature/issue-12-property-search` or `fix/issue-18-budget-validation`.
3. Keep changes focused. Coordinate with the owners of other areas when a change crosses `backend/`, `frontend/`, or `docs/`.
4. Open a pull request to `main`, link the issue, summarize the change, and include the checks you ran.
5. Request a teammate's review and address feedback before merging.

## Shared conventions

- Do not commit secrets, local environment files, generated output, or personal data.
- Keep `main` stable; do development work on short-lived branches.
- The backend, frontend, and documentation teams own the internal structure and conventions of their respective top-level folders. Coordinate shared API and data-contract changes before merging.
- Record significant cross-team technical decisions where the team agrees they belong; do not introduce a documentation layout without coordinating with the documentation team.