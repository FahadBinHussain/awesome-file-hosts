# awesome-file-hosts

[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)

> A free-first, source-backed directory of file hosts with structured data, a usable explorer, and a bias toward open-source-friendly services.

The repo is JSON-first: [`data/hosts.json`](data/hosts.json) is the source of truth, [`README.md`](README.md) is generated, and the site carries the dense dataset view.

Explore the full interface in the site app at `/` and the spreadsheet-style dataset view at `/dataset`.

## Contents

- [What this includes](#what-this-includes)
- [Hosts](#hosts)
- [Data](#data)
- [Contributing](#contributing)
- [License](#license)

## What this includes

- 90 verified hosts checked against current public sources as of 2026-04-29.
- 0 main-host leads still in review and 151 rejected entries preserved in [`data/candidates.json`](data/candidates.json) with reasons and references.
- 7 mirror-uploader candidates and 13 cloud-migration candidates staged in their own pending files.
- A free-first dataset that prioritizes genuinely usable free tiers, guest flows, and honest headline limits.
- A source-backed dataset designed for both human browsing and machine reuse.
- A bias toward open-source, open-protocol, and automation-friendly services when the evidence supports them.
- A site UI for filtering, comparison, and dense spreadsheet-style inspection.

### Inclusion bar

- Supports HTTPS.
- Is meaningfully usable today.
- Treats the practical free tier as the main story; paid-only upgrades should not dominate headline fields.
- Has enough current public evidence to support structured facts.
- Prefers open-source, open standards, and transparent developer tooling when services are otherwise comparable.
- Avoids obvious spam, malware traps, and dead services.

## Hosts

- [/TMP/FILES](https://tmpfiles.org/) - Temporary anonymous upload service with 100 MB files, automatic deletion after 60 minutes, and a simple upload API. _(Max: 100 MB | Retention: 1 hour | Account: No | API | CLI)_
- [1FileSharing](https://1filesharing.com/) - Timed file-hosting service with guest uploads, 1 GB free uploads, and premium upgrades for larger files and longer retention. _(Max: 1 GB | Retention: Conditional | Account: No)_
- [4shared](https://www.4shared.com/) - Long-running cloud storage and file-sharing service with a free 15 GB tier, 2 GB max uploads, and official mobile apps. _(Max: 2048 MB | Retention: Conditional | Account: Yes)_
- [Akira Box](https://akirabox.com/) - Freemium file-sharing host with guest uploads, 5 GB free guest files, 20 GB free registered uploads, and longer retention for account users. _(Max: 5 GB | Retention: Conditional | Account: No)_
- [Android File Host](https://androidfilehost.com/) - Large Android-focused file hosting network for developers with unlimited downloads, multiple mirrors, and a public beta API. _(Max: Conditional | Retention: Conditional | Account: Yes | API)_
- [AnonFile](https://anonfile.co/) - Privacy-focused file hosting service with browser-side encryption, no-account sharing, public API docs, and optional free accounts. _(Max: Unlimited | Retention: No automatic expiry | Account: No | API | CLI | E2EE)_
- [Backblaze B2](https://www.backblaze.com/cloud-storage) - Object storage service with a 10 GB free tier, public APIs, and official iPhone and Android access. _(Max: 10 TB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [Box](https://www.box.com/) - Cloud storage and file-sharing platform with a free single-user plan and first-party desktop and mobile apps. _(Max: 250 MB | Retention: No automatic expiry | Account: Yes | API)_
- [Buzzheavier](https://buzzheavier.com/) - Anonymous file-sharing host with no free file-size cap, curl-friendly APIs, and activity-based retention that can become effectively permanent. _(Max: Unlimited | Retention: Conditional | Account: No | API | CLI)_
- [Catbox](https://catbox.moe/) - Long-running, user-funded file host with a simple public upload flow. _(Max: 200 MB | Retention: No automatic expiry | Account: No)_
- [Clicknupload](https://clicknupload.click/) - Ad-supported file hosting service with free guest uploads, large per-file limits, and unlimited bandwidth for current free accounts. _(Max: 2 GB | Retention: 7 days | Account: No)_
- [CliUpload](https://cliupload.com/) - Anonymous web and command-line file sharing service with optional client-side encryption, custom expiry, and curl-friendly uploads. _(Max: 2 GB | Retention: Conditional | Account: No | CLI | E2EE)_
- [CloudBeeline](https://cloudbeeline.ru/) - Beeline consumer cloud storage service with 10 GB free storage, password-protected sharing, and mobile apps. _(Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [Cloudup](https://cloudup.com/) - Private-by-default file and link sharing service from Automattic with public API docs, direct links, and stream-based sharing. _(Max: 200 MB | Retention: No automatic expiry | Account: Yes | API)_
- [Cozy Cloud](https://en.cozy.io/) - French personal cloud platform now branded as Twake Workplace, with a free 5 GB tier and official desktop and mobile apps. _(Max: 5 GB | Retention: No automatic expiry | Account: Yes)_
- [Data.hu](https://data.hu/) - Hungarian file-sharing service with free browser uploads, unlimited advertised storage, optional FTP uploads, and premium-gated large downloads. _(Max: 2 GB | Retention: 60 days | Account: No | CLI)_
- [Degoo](https://degoo.com/) - Consumer cloud backup service with a free 20 GB tier, web access, and mobile apps, but no current desktop client. _(Max: 256 MB | Retention: 90 days | Account: Yes)_
- [DFiles](https://dfiles.eu/) - Long-running file hosting service under the DepositFiles brand with free uploads up to 10 GB, 90-day retention after downloads, mobile apps, and FTP/remote upload support. _(Max: 10 GB | Retention: 90 days | Account: No | CLI)_
- [DirectUpload](https://www.directupload.eu/) - Long-running German image host with free anonymous uploads, short custom auto-delete options, and a 1-year minimum storage period. _(Max: 8 MB | Retention: 1 year | Account: No)_
- [Disroot Upload](https://disroot.org/en/services/upload) - Privacy-focused temporary file sharing from Disroot, powered by Lufi and encrypted in the browser before upload. _(Max: Conditional | Retention: Conditional | Account: No | E2EE)_
- [Drime](https://drime.cloud/) - European cloud storage and collaboration platform with 20 GB free storage, secure sharing, an official API, and an optional end-to-end encrypted Vault space. _(Max: 20 GB | Retention: Conditional | Account: Yes | API | CLI)_
- [Dropbox](https://www.dropbox.com/) - Mainstream cloud storage service with a free 2 GB Basic plan, official desktop and mobile apps, and a well-documented developer API. _(Max: 2 GB | Retention: No automatic expiry | Account: Yes | API)_
- [DropMeAFile](https://dropmeafile.com/) - Simple no-account file-sharing service for sending files between computers or to other people. _(Max: Not published | Retention: Conditional | Account: No)_
- [DropMeFiles](https://dropmefiles.com/) - Browser-based file sharing service with no registration requirement, large free uploads, password protection, and selectable link lifetime. _(Max: 50 GB | Retention: 14 days | Account: No)_
- [Easyupload.io](https://easyupload.io/) - Guest-friendly upload host with free 4 GB uploads, password protection, selectable expiries, and officially advertised no download or bandwidth limit. _(Max: 4 GB | Retention: Conditional | Account: No)_
- [FEX.NET](https://new.fex.net/en/) - Modern cloud storage and file-sharing service with online viewing, link sharing, Android app support, and encrypted-in-transit data handling. _(Max: Conditional | Retention: No automatic expiry | Account: Yes)_
- [File-Upload.net](https://www.file-upload.net/en/) - Guest-friendly German file host with 1 GB uploads, up to one year of storage, optional registration for management features, and desktop/mobile upload tools. _(Max: 1 GB | Retention: 365 days | Account: No)_
- [File.AL](https://file.al/) - Account-based file host with browser and remote URL uploads, a free registered tier, and structured premium comparison published on the site. _(Max: 20 GB | Retention: 30 days | Account: Yes)_
- [file.io](https://www.file.io/) - Temporary file sharing service with a public REST API and auto-delete behavior. _(Max: 4 GB | Retention: 1 download | Account: No | API | CLI)_
- [Filebin](https://filebin.net/) - Open-source no-account file sharing service with a public API and automatic short-lived deletion. _(Max: Conditional | Retention: 6 days | Account: No | API)_
- [Fileditch](https://new.fileditch.com/) - Anonymous file-sharing host with a no-auth HTTP API, 25 GB files, and low-disk cleanup only after 30 days of inactivity. _(Max: 25 GB | Retention: Conditional | Account: No | API | CLI)_
- [FileFactory](https://www.filefactory.com/) - Long-running file hosting service with free accounts, 5 GB upload limits, and 90-day storage for free members. _(Max: 5 GB | Retention: 90 days | Account: Yes)_
- [FileFast](https://file.fast/) - Modern file-sharing and cloud-storage service with guest uploads, file analytics, public API access, and a free tier with monthly bandwidth limits. _(Max: 6 GB | Retention: 7 days | Account: No | API | CLI)_
- [FileGarden](https://filegarden.com/) - Persistent file-linking service that lets users upload files for long-lived sharing, with active user gardens and lightweight account features. _(Max: Not published | Retention: No automatic expiry | Account: Unknown)_
- [FileKarelia](https://file.karelia.ru/) - Russian file-sharing service with account-based uploads, month-long retention after access, and larger limits for registered users. _(Max: 2 GB | Retention: 30 days | Account: Yes)_
- [Filen](https://filen.io/) - Open-source, zero-knowledge cloud storage service with end-to-end encryption, 10 GB free accounts, a public API, and an official CLI. _(Max: 10 GB | Retention: Conditional | Account: Yes | API | CLI | E2EE)_
- [files.dp.ua](https://files.dp.ua/en/) - Anonymous file-sharing service with selectable expiry, optional password protection, and unusually large free upload limits. _(Max: 100 GB | Retention: 25 days | Account: No)_
- [files.fm](https://files.fm/) - EU-based cloud storage and file-sharing platform with a free Basic tier, 5 GB max file size, apps across major platforms, and official API docs whose key access is gated to paid plans. _(Max: 5 GB | Retention: No automatic expiry | Account: Yes)_
- [Free Transfert](https://transfert.free.fr/) - Free's browser-based file transfer service with direct-link sharing, optional password protection, and a larger free allowance for Freebox subscribers. _(Max: 10 GB | Retention: 30 days | Account: No)_
- [Fshare](https://www.fshare.vn/) - Vietnamese cloud storage and file-sharing service with 50 GB free storage, browser/email sharing, and official desktop and mobile apps. _(Max: 50 GB | Retention: 45 days | Account: Yes)_
- [GiGa.GG](https://giga.gg/) - Private cloud storage and sharing service with 1 GB free storage, 5 GB per-file uploads, mobile apps, and official API documentation. _(Max: 1 GB | Retention: Conditional | Account: Yes | API)_
- [Gofile](https://gofile.io/) - Cloud storage and content distribution platform with guest uploads, ephemeral free storage, and a beta REST API. _(Max: Conditional | Retention: Conditional | Account: No | API | CLI)_
- [Google Drive](https://drive.google.com/) - Google's cloud storage service with 15 GB of free account storage and official desktop/mobile clients. _(Max: 15 GB | Retention: No automatic expiry | Account: Yes | API)_
- [Hightail](https://www.hightail.com/) - Creative-focused file-sharing service with a free Lite plan for smaller transfers, 2 GB of storage, and no-account-required recipient access. _(Max: 100 MB | Retention: 7 days | Account: Yes)_
- [Hostize](https://www.hostize.com/) - No-account file-sharing service with 20 GB free uploads, 24-hour file availability, hourly upload limits, and encrypted storage claims. _(Max: 20 GB | Retention: 24 hours | Account: No)_
- [Hostr](https://hostr.co/) - Simple instant-sharing service with free accounts, broad file-type support, desktop apps, and generous public limits for small everyday uploads. _(Max: 20 MB | Retention: Conditional | Account: Yes)_
- [Icedrive](https://icedrive.net/) - Cloud storage service with 10 GB free storage, 50 GB monthly bandwidth, official apps, and no service-side file-size limit. _(Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [Jumpshare](https://jumpshare.com/) - Visual file-sharing and screen-recording platform with a free Basic plan, desktop apps, and an iOS app. _(Max: 250 MB | Retention: 12 months | Account: Yes)_
- [Koofr](https://koofr.eu/) - European cloud storage service with 10 GB free forever, WebDAV and rclone access, public sharing, and strong privacy positioning without trackers. _(Max: 10 GB | Retention: No automatic expiry | Account: Yes | CLI)_
- [LimeWire](https://limewire.com/) - Modern browser-based file sharing platform with end-to-end encrypted transfers, guest uploads, and a free 4 GB upload allowance. _(Max: 4 GB | Retention: Conditional | Account: No | E2EE)_
- [Litterbox](https://litterbox.catbox.moe/) - Catbox's temporary anonymous upload service with 1 GB uploads and selectable expiries up to 3 days. _(Max: 1 GB | Retention: Conditional | Account: No)_
- [MediaFire](https://www.mediafire.com/) - File storage and sharing service with a free ad-supported basic plan and first-party mobile apps. _(Max: 5 GB | Retention: No automatic expiry | Account: Yes | API)_
- [MEGA](https://mega.nz/) - Privacy-focused cloud storage and file-sharing service with user-controlled encryption, web access, and official mobile apps. _(Max: 20 GB | Retention: No automatic expiry | Account: Yes | API | CLI | E2EE)_
- [MiMedia](https://www.mimedia.com/) - Personal cloud service with a free 10 GB starter tier, desktop and mobile apps, and a media-first sharing experience. _(Max: 5 GB | Retention: 30 days | Account: Yes)_
- [MobiDrive](https://www.mobidrive.com/) - Privacy-first cloud storage from MobiSystems with a free 20 GB tier and official web, Windows, Android, and iOS apps. _(Max: 200 MB | Retention: No automatic expiry | Account: Yes)_
- [My-Files.SU](https://my-files.ru/) - Russian file-hosting service positioned around no-registration uploads, direct links, and minimal download friction. _(Max: 100 GB | Retention: Conditional | Account: No)_
- [MyAirBridge](https://www.myairbridge.com/) - Large-file transfer and sharing service with free transfers up to 20 GB and optional online storage features. _(Max: 20 GB | Retention: 3 days | Account: No | API)_
- [Oblako Mail.ru](https://cloud.mail.ru/) - Mail.ru cloud storage service with 8 GB free space, link sharing, mobile apps, a Windows desktop app, and Linux access via WebDAV. _(Max: 1 GB | Retention: Conditional | Account: Yes | CLI)_
- [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/) - Microsoft's cloud storage service with a 5 GB free tier and official apps across desktop and mobile platforms. _(Max: 5 GB | Retention: No automatic expiry | Account: Yes | API)_
- [OpenDrive](https://www.opendrive.com/) - Cloud storage, backup, and sync service with a free personal plan, official apps across major platforms, and a public API. _(Max: 100 MB | Retention: No automatic expiry | Account: Yes | API)_
- [OwnDrive](https://owndrive.com/) - Hosted personal cloud service with a 1 GB free tier and limited access to built-in apps, positioned as a lightweight Nextcloud-style drive. _(Max: 1 GB | Retention: No automatic expiry | Account: Yes)_
- [pCloud](https://www.pcloud.com/) - Cloud storage service with a free tier, official apps across major desktop and mobile platforms, and a public developer API. _(Max: 10 GB | Retention: No automatic expiry | Account: Yes | API)_
- [Pillowcase](https://pillows.su/) - Audio-focused file host with anonymous uploads, permanent links, and larger upload limits for registered users and supporters. _(Max: 200 MB | Retention: No automatic expiry | Account: No)_
- [Pixeldrain](https://pixeldrain.com/) - Fast file sharing service with expiry-on-inactivity behavior, plus FTPS and rclone support for paid filesystem usage. _(Max: 100 GB | Retention: 60 days | Account: Unknown | API | CLI)_
- [PlusTransfer](https://www.plustransfer.com/) - No-account large-file transfer service now served through DataTransfer, with free transfers up to 10 GB and expiry controls. _(Max: 10 GB | Retention: Conditional | Account: No)_
- [put.re](https://put.re/) - Anonymous file-sharing service with browser uploads, direct links, optional albums, and a public API. _(Max: 200 MB | Retention: No automatic expiry | Account: No | API | CLI)_
- [Rakuten Drive](https://rakuten-drive.com/) - Cloud storage and transfer platform with 10 GB free cloud storage, 10 GB free uploads, 48-hour free transfer links, and mobile/web access. _(Max: 10 GB | Retention: Conditional | Account: Yes)_
- [Rootz](https://rootz.so/) - File-sharing platform with public upload and remote-upload flows, API documentation, and a free tier limited by bandwidth rather than bundled account storage. _(Max: Not published | Retention: Conditional | Account: No | API)_
- [SendSpace](https://www.sendspace.com/) - Transfer-oriented file sharing service with a current 300 MB free upload limit and optional recipient delivery without requiring recipient accounts. _(Max: 300 MB | Retention: 30 days | Account: No)_
- [ShareFile](https://sharefile.co/) - Anonymous file-sharing host with 5 GB uploads and a simple no-account upload flow. _(Max: 5000 MB | Retention: Not published | Account: No)_
- [SharePlace](https://shareplace.org/) - File hosting service with browser uploads, account-based management, and a documented public API. _(Max: 500 MB | Retention: 60 days | Account: No | API)_
- [Stashr](https://stashr.wtf/) - Guest-friendly file-sharing host with 500 MB files, selectable expiry or download limits, and optional client-side encryption. _(Max: 500 MB | Retention: Conditional | Account: No | E2EE)_
- [Sync](https://www.sync.com/) - Privacy-focused cloud storage service with a 5 GB free tier and end-to-end encrypted apps across desktop and mobile. _(Max: Conditional | Retention: No automatic expiry | Account: Yes | E2EE)_
- [TempSend](https://tempsend.com/) - Anonymous file-sharing service with selectable link lifetime, no registration requirement, and command-line-friendly uploads. _(Max: 2 GB | Retention: 1 year | Account: No | CLI)_
- [Tencent Weiyun](https://www.weiyun.com/index.html?WYTAG=weiyun.app.web.plugin_install) - Tencent cloud storage service with QQ or WeChat login, multi-device access, online document workflows, and official desktop and mobile apps. _(Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [TeraBox](https://www.terabox.com/) - Consumer cloud storage service that currently markets 1 TB of free storage and apps across Android, iOS, PC, and Mac. _(Max: 20 GB | Retention: No automatic expiry | Account: Yes)_
- [Tresorit Send](https://send.tresorit.com/) - Free browser-based file transfer service from Tresorit with end-to-end encrypted link sharing. _(Max: 5 GB | Retention: 7 days | Account: No | E2EE)_
- [UAFile.COM](https://www.uafile.com/) - Ukrainian free file host with browser uploads, direct sharing links, and plainly published per-file and inactivity limits. _(Max: 200 MB | Retention: 30 days | Account: No)_
- [Uguu](https://uguu.se/) - Temporary anonymous file hosting service with a simple public API, 128 MiB uploads, and automatic deletion after 3 hours. _(Max: 128 MiB | Retention: 3 hours | Account: No | API | CLI)_
- [Ulozto](https://ulozto.net/) - Modern cloud storage service whose free account starts at 1 GB and can unlock 25 GB after card verification, with official mobile apps, Windows backup tooling, end-to-end encryption claims, and a resumable upload API. _(Max: 1 GB | Retention: No automatic expiry | Account: Yes | API | CLI | E2EE)_
- [Upload.ee](https://www.upload.ee/) - Estonian file host with anonymous uploads, broad file-type support, and clear free retention rules for guest and registered users. _(Max: 100 MB | Retention: 50 days | Account: No)_
- [UploadFiles.io](https://ufile.io/) - Free file sharing service with no-registration guest uploads, 5 GB max file size, optional expiry controls, and an upgrade path to free managed storage. _(Max: 5 GB | Retention: 30 days | Account: No)_
- [UsersDrive](https://usersdrive.com/) - No-account file hosting service with password-protected links, remote URL uploads, and a clearly published max upload size on the public upload form. _(Max: 5250 MB | Retention: 14 days | Account: No)_
- [vgy.me](https://vgy.me/) - Simple image host with anonymous uploads, a public upload API, and longer retention for account-linked images. _(Max: 20 MB | Retention: Conditional | Account: No | API | CLI)_
- [ViKiNG FiLE](https://vikingfile.com/) - Anonymous file host advertising unlimited file size and storage, with a public API and 15-day free retention after the last download. _(Max: Unlimited | Retention: 15 days | Account: No | API | CLI)_
- [WeTransfer](https://wetransfer.com/) - Transfer-focused sharing service whose current free account includes up to 10 transfers or 3 GB over a rolling 30-day period. _(Max: 3 GB | Retention: Conditional | Account: Yes)_
- [WorkUpload](https://workupload.com/) - Browser-based file-sharing service with guest uploads, password protection, expiry controls, and optional account features for managing shared files. _(Max: 2 GB | Retention: Conditional | Account: No)_
- [Wormhole](https://wormhole.app/) - Privacy-focused file sending service with end-to-end encryption, up to 10 GB transfers, and peer-to-peer delivery for larger files. _(Max: 10 GB | Retention: 24 hours | Account: Unknown | E2EE)_
- [Yandex Disk](https://disk.yandex.com/) - Cloud storage service with a 5 GB base tier, official desktop and mobile apps, and a Linux console client. _(Max: 1 GB | Retention: No automatic expiry | Account: Yes)_
- [Your File Store](https://yourfilestore.com/) - Simple no-account file upload service with private download links, optional password protection, and long-lived files that stay active with periodic access. _(Max: 500 MB | Retention: 60 days | Account: No)_

## Data

- Dataset: [`data/hosts.json`](data/hosts.json)
- Candidate backlog: [`data/candidates.json`](data/candidates.json)
- Alternative methods: [`data/alternatives.json`](data/alternatives.json)
- Mirror uploaders: [`data/mirror_uploaders.json`](data/mirror_uploaders.json)
- Mirror uploader candidates: [`data/mirror_uploaders_candidates.json`](data/mirror_uploaders_candidates.json)
- Cloud migration tools: [`data/cloud_migration.json`](data/cloud_migration.json)
- Cloud migration candidates: [`data/cloud_migration_candidates.json`](data/cloud_migration_candidates.json)
- Schema: [`schema/hosts.schema.json`](schema/hosts.schema.json)
- Candidate schema: [`schema/candidates.schema.json`](schema/candidates.schema.json)
- Generator: [`scripts/generate-readme.js`](scripts/generate-readme.js)

The site is the best place to explore all columns, notes, references, queue status, and layout controls. The README stays intentionally compact so the list still reads like an awesome list instead of a database dump.

### Generate

```bash
npm run generate
npm run check
```

## Contributing

Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before opening a PR.

## Automation

- Pull requests run `npm run check` to make sure generated output stays in sync.
- Pushes to `main` regenerate `README.md` automatically and commit the result when needed.

## License

MIT via [`LICENSE`](LICENSE).
