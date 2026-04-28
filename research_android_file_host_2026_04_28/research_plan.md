# Android File Host research plan

Main question: what current Android File Host facts can be filled from official first-party pages without guessing?

Subtopics:

1. Homepage and public product positioning
   - Confirm the current account model, download/bandwidth claims, and host identity.
2. API documentation
   - Confirm whether the API is public, what it covers, and whether direct-download access is restricted.
3. Terms and membership pages
   - Look for retention, deletion, file-policy, storage, and usage-limit rules.

Expected outcome:

- tighten the Android File Host entry in `data/hosts.json`
- reduce fake `Not published` placeholders where first-party docs actually say something useful
- preserve official URLs and a short rationale for each changed field
