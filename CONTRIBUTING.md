# Contributing

Thanks for helping build `awesome-file-hosts`.

## Ground rules

1. Edit [`data/hosts.json`](data/hosts.json) for verified entries, or [`data/candidates.json`](data/candidates.json) for unverified leads. Do not hand-edit `README.md`.
2. Keep entries in alphabetical order by `name`.
3. Use official vendor pages as sources whenever possible.
4. Every entry must include at least one source URL and a retrieval date.
5. Every host must support HTTPS.
6. Do not add obvious spam, malware distribution points, link shorteners, or ad-trap upload sites.
7. If a fact is unclear, prefer `null` plus a note over guessing.

## Verified vs candidate entries

- `data/hosts.json` is for entries backed by source-checked public documentation.
- `data/candidates.json` is for imports, backlog, and user-submitted leads that still need verification.
- Move an item from candidates into hosts only after checking the current official source.

## Entry quality bar

Please only add hosts that are meaningfully usable today. Good candidates usually have at least one of these:

- clear public limits or retention rules
- a documented API
- a CLI-friendly upload flow
- a distinctive security or privacy model

## Field guide

Use these conventions when filling verified entries in [`data/hosts.json`](data/hosts.json):

- `limits.max_file_size`: the biggest single upload supported by the free/public flow
- `limits.retention`: how long files stay available, or a download-count rule if the host deletes after a number of downloads
- `limits.storage`: total free storage when the service is a real storage product; use `null` for transfer-style services
- `limits.bandwidth`: transfer/download caps such as `5 GB/day`; use `null` if the public source does not publish a current number
- `account.required`: `true` when a free account is required for normal use, `false` when guest uploads work, `null` when the public pages are unclear
- `content.allowed_file_types.mode`: keep this short and stable, such as `all_except_prohibited`, `images-only`, `documents-only`, or `see-notes`
- `content.allowed_file_types.notes`: summarize the actual allowed/prohibited file policy from the cited source

## Notes on new fields

- Prefer exact published units for bandwidth, such as `GB/day`, `GB/month`, or `downloads/day`
- If a host says "unlimited bandwidth" but gives no numeric cap, set `value` and `unit` to `null` and write that claim in `notes`
- If the host does not publish a clear file-type policy, use `mode: "see-notes"` and say that the public pages do not clearly document a full allowlist
- Do not infer file-type policy from what the uploader accepts; only use documented rules from official pages, terms, or FAQ content

## Example host fragment

```json
{
  "limits": {
    "max_file_size": {
      "value": 5,
      "unit": "GB",
      "notes": "Official help says free uploads are limited to 5 GB per file."
    },
    "retention": {
      "value": 7,
      "unit": "days",
      "notes": "Files are automatically deleted after 7 days."
    },
    "storage": {
      "value": null,
      "unit": null,
      "notes": "This is a transfer service rather than persistent storage."
    },
    "bandwidth": {
      "value": 5,
      "unit": "GB/day",
      "notes": "Anonymous downloads are limited to 5 GB per day."
    }
  },
  "content": {
    "allowed_file_types": {
      "mode": "all_except_prohibited",
      "notes": "The FAQ allows most file types but prohibits malware and illegal content."
    }
  }
}
```

## Workflow

```bash
npm run generate
npm run check
```

If you change host data, the generated `README.md` should change too.

## Suggested review checklist

- links work
- limits and retention notes match the cited source
- bandwidth notes and units match the cited source
- allowed file type notes match the cited source
- tags are accurate and useful
- no duplicate entry already exists
- the generated README still reads cleanly
