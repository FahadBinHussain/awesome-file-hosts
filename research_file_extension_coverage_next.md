# File Extension Coverage Batch 2 Plan

Main question: improve extension-array coverage across the dataset with a larger, conservative batch.

Scope:
- Prioritize verified hosts first because they are the main published comparison surface.
- Include candidates or mirror/alternative rows only when official evidence is quick and exact.
- Prefer official docs, FAQ pages, API docs, upload pages, and help-center articles.

Subtopics:
- Exact allowlists: image, video, and uploader services that publish accepted extensions.
- Exact blocklists: hosts that publish forbidden executable/script/web/macro extensions.
- Conditional policies: hosts that mention extension restrictions by account, preview, hotlinking, or category only; keep those in notes instead of arrays.

Synthesis:
- Fill `allowed_extensions` or `blocked_extensions` only when the cited source supports that exact interpretation.
- Update `source_refs` to the strongest existing source, or add an official source if needed.
- Regenerate README and run the project checks after edits.
