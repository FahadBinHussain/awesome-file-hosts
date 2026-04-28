# Android File Host findings

Date: 2026-04-28

## Official pages used

- Homepage: https://androidfilehost.com/
- API docs: https://androidfilehost.com/api/docs/
- Membership plans: https://androidfilehost.com/user/?w=select-membership-plans
- Terms of service: https://androidfilehost.com/?w=terms-of-service

## Findings

### Account model

The homepage is public and supports browsing/downloading without registration, while the terms say some services require an account. This supports keeping `account.required: true` for developer uploads and management, while still noting that visitors can browse and download public files.

### Developer / API

The API docs confirm a public beta API for:

- `devices`
- `developers`
- `update`
- `folder`

The docs also say direct-download URLs only appear with a valid API key, and that key is available only to developers with beta access via the user dashboard.

### Retention

The terms provide a real retention/deletion rule. Android File Host says it generally will not delete uploaded files, but it reserves the right to remove files with insufficient downloads. "Insufficient downloads" is defined as fewer than 10 downloads over 365 consecutive days.

This is not a simple fixed expiry; it is conditional retention based on download activity.

### Storage and bandwidth

The homepage still claims unlimited downloads, speeds, and bandwidth for users. However, the terms reserve the right to suspend or terminate service for excessive storage capacity or bandwidth use.

That means:

- no clean numeric free storage quota is published
- no clean numeric bandwidth cap is published
- but the notes should mention the "unlimited" marketing claim alongside the excessive-use enforcement clause

### Allowed file types

The terms supply a usable policy. They prohibit unlawful, infringing, spam, malware, harmful, or otherwise abusive content. That is strong enough to change the field from `see-notes` to `all_except_prohibited`.
