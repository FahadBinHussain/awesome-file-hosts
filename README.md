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

- 145 verified hosts checked against current public sources as of 2026-05-01.
- 2 main-host leads still in review and 184 rejected entries preserved in [`data/candidates.json`](data/candidates.json) with reasons and references.
- 0 other-ways-to-share candidates, 0 mirror-uploader candidates, and 0 cloud-migration candidates staged in their own pending files.
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

- [/TMP/FILES](https://tmpfiles.org/) - Temporary anonymous upload service with 100 MB files, automatic deletion after 60 minutes, and a simple upload API. _(Free: Free forever | Max: 100 MB | Retention: 1 hour | Account: No | API | CLI)_
- [0x0.st](https://0x0.st/) - Minimal temporary file host with 512 MiB uploads, HTTP POST and remote URL upload support, and formula-based retention from 30 days to 1 year. _(Free: Free forever | Max: 512 MiB | Retention: Conditional | Account: No | API | CLI)_
- [1FileSharing](https://1filesharing.com/) - Timed file-hosting service with guest uploads, 1 GB free uploads, and premium upgrades for larger files and longer retention. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: No)_
- [4shared](https://www.4shared.com/) - Long-running cloud storage and file-sharing service with a free 15 GB tier, 2 GB max uploads, and official mobile apps. _(Free: Free forever | Max: 2048 MB | Retention: Conditional | Account: Yes)_
- [Akira Box](https://akirabox.com/) - Freemium file-sharing host with guest uploads, 5 GB free guest files, 20 GB free registered uploads, and longer retention for account users. _(Free: Free forever | Max: 5 GB | Retention: Conditional | Account: No)_
- [Android File Host](https://androidfilehost.com/) - Large Android-focused file hosting network for developers with unlimited downloads, multiple mirrors, and a public beta API. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: Yes | API)_
- [AnonFile](https://anonfile.co/) - Privacy-focused file hosting service with browser-side encryption, no-account sharing, public API docs, and optional free accounts. _(Free: Free forever | Max: Unlimited | Retention: No automatic expiry | Account: No | API | CLI | E2EE)_
- [AnonTransfer](https://anontransfer.com/) - General file-transfer host with anonymous uploads, 10 GB free-plan uploads, 30-day anonymous/free retention, first-party encryption claims, and optional permanent account storage. _(Free: Free forever | Max: 10 GB | Retention: 30 days | Account: No | E2EE)_
- [Anoxinon Share](https://share.anoxinon.de/) - Jirafeau-based sharing tool with 100 MB uploads, optional one-time download/password controls, and selectable expiries up to one quarter. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [AXFC Uploader](https://www.axfc.net/u/) - Long-running Japanese upload board with public file listings, guest upload flow, optional download keyword, optional download-count limit, and optional expiry controls. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: No)_
- [Backblaze B2](https://www.backblaze.com/cloud-storage) - Object storage service with a 10 GB free tier, public APIs, and official iPhone and Android access. _(Free: Free forever | Max: 10 TB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [Box](https://www.box.com/) - Cloud storage and file-sharing platform with a free single-user plan and first-party desktop and mobile apps. _(Free: Free forever | Max: 250 MB | Retention: No automatic expiry | Account: Yes | API)_
- [Buzzheavier](https://buzzheavier.com/) - Anonymous file-sharing host with no free file-size cap, curl-friendly APIs, and activity-based retention that can become effectively permanent. _(Free: Free forever | Max: Unlimited | Retention: Conditional | Account: No | API | CLI)_
- [Catbox](https://catbox.moe/) - Long-running, user-funded file host with a simple public upload flow. _(Free: Free forever | Max: 200 MB | Retention: No automatic expiry | Account: No)_
- [Clicknupload](https://clicknupload.click/) - Ad-supported file hosting service with free guest uploads, large per-file limits, and unlimited bandwidth for current free accounts. _(Free: Free forever | Max: 2 GB | Retention: 7 days | Account: No)_
- [CliUpload](https://cliupload.com/) - Anonymous web and command-line file sharing service with optional client-side encryption, custom expiry, and curl-friendly uploads. _(Free: Free forever | Max: 2 GB | Retention: Conditional | Account: No | CLI | E2EE)_
- [CloudBeeline](https://cloudbeeline.ru/) - Beeline consumer cloud storage service with 10 GB free storage, password-protected sharing, and mobile apps. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [Cloudflare R2](https://developers.cloudflare.com/r2/) - S3-compatible object storage with an ongoing free tier, zero egress fees from R2, public bucket options, and CLI/API workflows. _(Free: Free forever | Max: 5 TB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [CloudMe](https://www.cloudme.com/en) - European cloud storage service with a 3 GB free account, WebShare folder publishing, and WebDAV access for desktop and CLI workflows. _(Free: Free forever | Max: 150 MB | Retention: Conditional | Account: Yes | API | CLI)_
- [Cloudup](https://cloudup.com/) - Private-by-default file and link sharing service from Automattic with public API docs, direct links, and stream-based sharing. _(Free: Free forever | Max: 200 MB | Retention: No automatic expiry | Account: Yes | API)_
- [Cozy Cloud](https://cozy.io/en/) - French personal cloud platform now branded around Cozy Cloud and Twake Workplace, with a free 5 GB tier and official desktop and mobile apps. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [Darkibox](https://darkibox.com/) - Video-focused host with 50 GB transfers, browser-side encryption claims, public search for marked-public videos, and a documented upload/file-management API. _(Free: Free forever | Max: 50 GB | Retention: No automatic expiry | Account: Unknown | API | CLI | E2EE)_
- [Data.hu](https://data.hu/) - Hungarian file-sharing service with free browser uploads, unlimited advertised storage, optional FTP uploads, and premium-gated large downloads. _(Free: Free forever | Max: 2 GB | Retention: 60 days | Account: No | CLI)_
- [Degoo](https://degoo.com/) - Consumer cloud backup service with a free 20 GB tier, web access, and mobile apps, but no current desktop client. _(Free: Free forever | Max: 256 MB | Retention: 90 days | Account: Yes)_
- [DFiles](https://dfiles.eu/) - Long-running file hosting service under the DepositFiles brand with free uploads up to 10 GB, 90-day retention after downloads, mobile apps, and FTP/remote upload support. _(Free: Free forever | Max: 10 GB | Retention: 90 days | Account: No | CLI)_
- [DirectUpload](https://www.directupload.eu/) - Long-running German image host with free anonymous uploads, short custom auto-delete options, and a 1-year minimum storage period. _(Free: Free forever | Max: 8 MB | Retention: 1 year | Account: No)_
- [Disroot Upload](https://disroot.org/en/services/upload) - Privacy-focused temporary file sharing from Disroot, powered by Lufi and encrypted in the browser before upload. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: No | E2EE)_
- [DoodStream](https://doodstream.com/) - Ad-supported video host with 5 GB free uploads, 20 GB premium uploads, 60-day inactive-video deletion for free users, no bandwidth limitation, browser/FTP/remote/API uploads, and a public API. _(Free: Free forever | Max: 5 GB | Retention: 60 days | Account: Yes | API | CLI)_
- [Drime](https://drime.cloud/) - European cloud storage and collaboration platform with 20 GB free storage, secure sharing, an official API, and an optional end-to-end encrypted Vault space. _(Free: Free forever | Max: 20 GB | Retention: Conditional | Account: Yes | API | CLI)_
- [Dropbox](https://www.dropbox.com/) - Mainstream cloud storage service with a free 2 GB Basic plan, official desktop and mobile apps, and a well-documented developer API. _(Free: Free forever | Max: 2 GB | Retention: No automatic expiry | Account: Yes | API)_
- [DropMeAFile](https://dropmeafile.com/) - Simple no-account file-sharing service for sending files between computers or to other people. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: No)_
- [DropMeFiles](https://dropmefiles.com/) - Browser-based file sharing service with no registration requirement, large free uploads, password protection, and selectable link lifetime. _(Free: Free forever | Max: 50 GB | Retention: 14 days | Account: No)_
- [Dubz](https://dubz.co/) - Simple free video host for quick link sharing with 100 MB uploads, popular video-format support, browser editing, and view-based retention language. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [Easyupload.io](https://easyupload.io/) - Guest-friendly upload host with free 4 GB uploads, password protection, selectable expiries, and officially advertised no download or bandwidth limit. _(Free: Free forever | Max: 4 GB | Retention: Conditional | Account: No)_
- [F2H.io](https://f2h.io/) - Free browser-based file sharing service with guest uploads up to 1 GB, no signup requirement, password protection, and user-selected or default permanent retention. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: No)_
- [Fast.io](https://fast.io/) - Team-oriented cloud content workspace with a permanent 50 GB free tier, share links, and a documented API. _(Free: Free forever | Max: 1 GB | Retention: 60 days | Account: Yes | API | CLI)_
- [FastPic](https://fastpic.org/) - Russian image host with guest uploads, 25 MB local image uploads, URL uploads for small files, and several resize/preview options. _(Free: Free forever | Max: 25 MB | Retention: Conditional | Account: No)_
- [FEX.NET](https://new.fex.net/en/) - Modern cloud storage and file-sharing service with online viewing, link sharing, Android app support, and encrypted-in-transit data handling. _(Free: Free forever | Max: Conditional | Retention: No automatic expiry | Account: Yes)_
- [File-Upload.net](https://www.file-upload.net/en/) - Guest-friendly German file host with 1 GB uploads, up to one year of storage, optional registration for management features, and desktop/mobile upload tools. _(Free: Free forever | Max: 1 GB | Retention: 365 days | Account: No)_
- [File.AL](https://file.al/) - Account-based file host with browser and remote URL uploads, a free registered tier, and structured premium comparison published on the site. _(Free: Free forever | Max: 20 GB | Retention: 30 days | Account: Yes)_
- [file.io](https://www.file.io/) - Temporary file sharing service with a public REST API and auto-delete behavior. _(Free: Free forever | Max: 4 GB | Retention: 1 download | Account: No | API | CLI)_
- [Filebin](https://filebin.net/) - Open-source no-account file sharing service with a public API and automatic short-lived deletion. _(Free: Free forever | Max: Conditional | Retention: 6 days | Account: No | API)_
- [Fileditch](https://new.fileditch.com/) - Anonymous file-sharing host with a no-auth HTTP API, 25 GB files, and low-disk cleanup only after 30 days of inactivity. _(Free: Free forever | Max: 25 GB | Retention: Conditional | Account: No | API | CLI)_
- [FileFactory](https://www.filefactory.com/) - Long-running file hosting service with free accounts, 5 GB upload limits, and 90-day storage for free members. _(Free: Free forever | Max: 5 GB | Retention: 90 days | Account: Yes)_
- [FileFast](https://file.fast/) - Modern file-sharing and cloud-storage service with guest uploads, file analytics, public API access, and a free tier with monthly bandwidth limits. _(Free: Free forever | Max: 6 GB | Retention: 7 days | Account: No | API | CLI)_
- [FileGarden](https://filegarden.com/) - Persistent file-linking service that lets users upload files for long-lived sharing, with active user gardens and lightweight account features. _(Free: Free forever | Max: 100 MiB | Retention: No automatic expiry | Account: No)_
- [FileKarelia](https://file.karelia.ru/) - Russian file-sharing service with account-based uploads, month-long retention after access, and larger limits for registered users. _(Free: Free forever | Max: 2 GB | Retention: 30 days | Account: Yes)_
- [Filen](https://filen.io/) - Open-source, zero-knowledge cloud storage service with end-to-end encryption, 10 GB free accounts, a public API, and an official CLI. _(Free: Free forever | Max: 10 GB | Retention: Conditional | Account: Yes | API | CLI | E2EE)_
- [FileRift](https://filerift.com/) - Free file-sharing host with 1 GB guest uploads, 5 GB free-account upload limits, direct linking for code/text files, and password-protected storage. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: No)_
- [files.dp.ua](https://files.dp.ua/en/) - Anonymous file-sharing service with selectable expiry, optional password protection, and unusually large free upload limits. _(Free: Free forever | Max: 100 GB | Retention: 25 days | Account: No)_
- [files.fm](https://files.fm/) - EU-based cloud storage and file-sharing platform with a free Basic tier, 5 GB max file size, apps across major platforms, and official API docs whose key access is gated to paid plans. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes)_
- [Free Transfert](https://transfert.free.fr/) - Free's browser-based file transfer service with direct-link sharing, optional password protection, and a larger free allowance for Freebox subscribers. _(Free: Free forever | Max: 10 GB | Retention: 30 days | Account: No)_
- [FreeImage.Host](https://freeimage.host/) - Chevereto-based free image host with 64 MB guest uploads, direct links, API documentation, and ShareX setup instructions. _(Free: Free forever | Max: 64 MB | Retention: No automatic expiry | Account: No | API | CLI)_
- [Fshare](https://www.fshare.vn/) - Vietnamese cloud storage and file-sharing service with 50 GB free storage, browser/email sharing, and official desktop and mobile apps. _(Free: Free forever | Max: 50 GB | Retention: 45 days | Account: Yes)_
- [Gifyu](https://gifyu.com/) - Free image host with guest uploads up to 100 MB, direct links, account-managed albums, and a guest auto-delete default of one year. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [GiGa.GG](https://giga.gg/) - Private cloud storage and sharing service with 1 GB free storage, 5 GB per-file uploads, mobile apps, and official API documentation. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: Yes | API)_
- [Gofile](https://gofile.io/) - Cloud storage and content distribution platform with guest uploads, ephemeral free storage, and a beta REST API. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: No | API | CLI)_
- [Google Drive](https://drive.google.com/) - Google's cloud storage service with 15 GB of free account storage and official desktop/mobile clients. _(Free: Free forever | Max: 15 GB | Retention: No automatic expiry | Account: Yes | API)_
- [Hightail](https://www.hightail.com/) - Creative-focused file-sharing service with a free Lite plan for smaller transfers, 2 GB of storage, and no-account-required recipient access. _(Free: Free forever | Max: 100 MB | Retention: 7 days | Account: Yes)_
- [Hostize](https://www.hostize.com/) - No-account file-sharing service with 20 GB free uploads, 24-hour file availability, hourly upload limits, and encrypted storage claims. _(Free: Free forever | Max: 20 GB | Retention: 24 hours | Account: No)_
- [Hostr](https://hostr.co/) - Simple instant-sharing service with free accounts, broad file-type support, desktop apps, and generous public limits for small everyday uploads. _(Free: Free forever | Max: 20 MB | Retention: Conditional | Account: Yes)_
- [i by Tikolu](https://tikolu.net/i/) - Minimal JavaScript-required image uploader from Tikolu; the public page confirms the upload workflow but does not publish first-party quota or retention details. _(Free: Free forever | Max: 8 MB | Retention: Conditional | Account: No)_
- [Icedrive](https://icedrive.net/) - Cloud storage service with 10 GB free storage, 50 GB monthly bandwidth, official apps, and no service-side file-size limit. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [iCloud](https://www.icloud.com/iclouddrive/) - Apple cloud storage service with 5 GB free storage, iCloud Drive file/folder sharing, and optional Advanced Data Protection. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes)_
- [IDrive](https://www.idrive.com/) - Online backup and cloud storage service with a 10 GB free Basic plan and web share links. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes | E2EE)_
- [ImageBam](https://www.imagebam.com/) - Long-running free image host with guest uploads, galleries, CDN-backed delivery, optional free accounts, and first-party forever-hosting messaging. _(Free: Free forever | Max: 10240 MB | Retention: No automatic expiry | Account: No)_
- [ImageVenue](https://www.imagevenue.com/) - Free image hosting service with guest uploads, no-compression positioning, embed-friendly links, and persistent sharing language. _(Free: Free forever | Max: 20 MB | Retention: No automatic expiry | Account: No)_
- [ImgBB](https://imgbb.com/) - Free image host with 32 MB guest uploads, direct links and embed codes, optional auto-delete, and a documented upload API. _(Free: Free forever | Max: 32 MB | Retention: Conditional | Account: No | API | CLI)_
- [imgbox](https://imgbox.com/) - Fast free image host with guest uploads for JPG/GIF/PNG up to 10 MB, unlimited storage space, unlimited storage time, and hotlinking support. _(Free: Free forever | Max: 10 MB | Retention: Unlimited | Account: No)_
- [IMGPile](https://imgpile.com/) - Free image and video host with guest uploads up to 100 MB, permanent links, account/API features, ShareX support, and explicit rate limits. _(Free: Free forever | Max: 100 MB | Retention: No automatic expiry | Account: No | API | CLI)_
- [Imouto](https://imouto.kawaii.su/) - Small self-hosted upload service with 20 MB file uploads, 8 MB proxied URL uploads, media-only extensions, and configurable automatic deletion periods. _(Free: Free forever | Max: 20 MB | Retention: No automatic expiry | Account: No)_
- [Jumpshare](https://jumpshare.com/) - Visual file-sharing and screen-recording platform with a free Basic plan, desktop apps, and an iOS app. _(Free: Free forever | Max: 250 MB | Retention: 12 months | Account: Yes)_
- [Kepkuldes](https://kepkuldes.com/) - Hungarian free image-upload service with 40 MB uploads and direct/embed links, but free uploads are deleted after one week unless the user has Premium. _(Free: Free forever | Max: 40 MB | Retention: 1 week | Account: No)_
- [Koofr](https://koofr.eu/) - European cloud storage service with 10 GB free forever, WebDAV and rclone access, public sharing, and strong privacy positioning without trackers. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes | CLI)_
- [LimeWire](https://limewire.com/) - Modern browser-based file sharing platform with end-to-end encrypted transfers, guest uploads, and a free 4 GB upload allowance. _(Free: Free forever | Max: 4 GB | Retention: Conditional | Account: No | E2EE)_
- [Litterbox](https://litterbox.catbox.moe/) - Catbox's temporary anonymous upload service with 1 GB uploads and selectable expiries up to 3 days. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: No)_
- [Lulustream](https://lulustream.com/) - Video-streaming reward platform with unlimited storage, no bandwidth limitation, 60-day inactive deletion for free users, 20 GB premium uploads, and browser/FTP/remote/API upload methods. _(Free: Free forever | Max: Not published | Retention: 60 days | Account: Yes | API | CLI)_
- [Lutim](https://lutim.lagout.org/) - Free anonymous image host and AGPL software instance with optional no-time-limit storage, first-view deletion, selectable expiry, URL upload, and server-side keyless encryption. _(Free: Free forever | Max: Conditional | Retention: No automatic expiry | Account: No | E2EE)_
- [MediaFire](https://www.mediafire.com/) - File storage and sharing service with a free ad-supported basic plan and first-party mobile apps. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes | API)_
- [MEGA](https://mega.nz/) - Privacy-focused cloud storage and file-sharing service with user-controlled encryption, web access, and official mobile apps. _(Free: Free forever | Max: 20 GB | Retention: No automatic expiry | Account: Yes | API | CLI | E2EE)_
- [MiMedia](https://www.mimedia.com/) - Personal cloud service with a free 10 GB starter tier, desktop and mobile apps, and a media-first sharing experience. _(Free: Free forever | Max: 5 GB | Retention: 30 days | Account: Yes)_
- [MixDrop](https://mixdrop.ag/) - Cloud hosting and streaming platform for files, videos, and audio with 60-day inactive deletion, any-file uploads, remote upload, and a documented API. _(Free: Free forever | Max: Not published | Retention: 60 days | Account: Yes | API | CLI)_
- [MobiDrive](https://www.mobidrive.com/) - Privacy-first cloud storage from MobiSystems with a free 20 GB tier and official web, Windows, Android, and iOS apps. _(Free: Free forever | Max: 200 MB | Retention: No automatic expiry | Account: Yes)_
- [MoePantsu](https://www.moepantsu.com/) - Kawaii-styled public file host with 128 MiB uploads, drag-and-drop browser uploading, and a public GitHub/source link. _(Free: Free forever | Max: 128 MiB | Retention: Conditional | Account: No)_
- [MyAirBridge](https://www.myairbridge.com/) - Large-file transfer and sharing service with free transfers up to 20 GB and optional online storage features. _(Free: Free forever | Max: 20 GB | Retention: 3 days | Account: No | API)_
- [NetU](https://netu.to/) - Free video host with guest browser upload, remote URLs, FTP upload, 8096 MB / 500 minute video limits, and recommended MP4/H.264/AAC encoding. _(Free: Free forever | Max: 8096 MB | Retention: No automatic expiry | Account: No)_
- [Nutstore](https://www.jianguoyun.com/) - Chinese cloud sync and sharing service with a free traffic-based plan and WebDAV support. _(Free: Free forever | Max: Conditional | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [Oblako Mail.ru](https://cloud.mail.ru/) - Mail.ru cloud storage service with 8 GB free space, link sharing, mobile apps, a Windows desktop app, and Linux access via WebDAV. _(Free: Free forever | Max: 1 GB | Retention: Conditional | Account: Yes | CLI)_
- [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/) - Microsoft's cloud storage service with a 5 GB free tier and official apps across desktop and mobile platforms. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes | API)_
- [OpenDrive](https://www.opendrive.com/) - Cloud storage, backup, and sync service with a free personal plan, official apps across major platforms, and a public API. _(Free: Free forever | Max: 100 MB | Retention: No automatic expiry | Account: Yes | API)_
- [Oracle Cloud Infrastructure Object Storage](https://www.oracle.com/cloud/storage/object-storage/) - OCI object storage with Always Free capacity, 10 TiB objects, REST/S3-compatible APIs, CLI access, and public/pre-authenticated sharing options. _(Free: Free forever | Max: 10 TiB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [OwnDrive](https://owndrive.com/) - Hosted personal cloud service with a 1 GB free tier and limited access to built-in apps, positioned as a lightweight Nextcloud-style drive. _(Free: Free forever | Max: 1 GB | Retention: No automatic expiry | Account: Yes)_
- [pCloud](https://www.pcloud.com/) - Cloud storage service with a free tier, official apps across major desktop and mobile platforms, and a public developer API. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes | API)_
- [pic.maxiol](https://pic.maxiol.com/) - Russian image host with guest uploads and URL-based image upload, supporting JPG, PNG, and GIF files up to 100 MB. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [Pikky](https://pikky.net/) - Small guest-friendly image host with web/URL uploads, batches up to 15 images, and a current 19.5 MB per-image upload limit. _(Free: Free forever | Max: 19.5 MB | Retention: Conditional | Account: No)_
- [Pillowcase](https://pillows.su/) - Audio-focused file host with anonymous uploads, permanent links, and larger upload limits for registered users and supporters. _(Free: Free forever | Max: 200 MB | Retention: No automatic expiry | Account: No)_
- [Pixeldrain](https://pixeldrain.com/) - Fast file sharing service with expiry-on-inactivity behavior, plus FTPS and rclone support for paid filesystem usage. _(Free: Free forever | Max: 100 GB | Retention: 60 days | Account: Yes | API | CLI)_
- [PixVid](https://pixvid.org/) - Public media host for images and short videos with direct links, NSFW flagging, optional expiry, and a documented upload API. _(Free: Free forever | Max: 16 MB | Retention: Conditional | Account: No | API | CLI)_
- [PlusTransfer](https://www.plustransfer.com/) - No-account large-file transfer service now served through DataTransfer, with free transfers up to 10 GB and expiry controls. _(Free: Free forever | Max: 10 GB | Retention: Conditional | Account: No)_
- [Proton Drive](https://proton.me/drive) - End-to-end encrypted cloud storage with 5 GB free storage, secure share links, and no official public API. _(Free: Free forever | Max: 5 GB | Retention: No automatic expiry | Account: Yes | E2EE)_
- [put.re](https://put.re/) - Anonymous file-sharing service with browser uploads, direct links, optional albums, and a public API. _(Free: Free forever | Max: 200 MB | Retention: No automatic expiry | Account: No | API | CLI)_
- [qu.ax](https://qu.ax/) - Simple public file host with 256 MB uploads, selectable storage duration from 1 day to permanent, ShareX support, and an explicit supported-file list. _(Free: Free forever | Max: 256 MB | Retention: Conditional | Account: No | CLI)_
- [Rakuten Drive](https://rakuten-drive.com/) - Cloud storage and transfer platform with 10 GB free cloud storage, 10 GB free uploads, 48-hour free transfer links, and mobile/web access. _(Free: Free forever | Max: 10 GB | Retention: Conditional | Account: Yes)_
- [RapidGrab](https://rdgb.net/) - Small media-oriented upload service with 100 MB uploads and selectable auto-delete windows. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [Rapidshare.io](https://rapidshare.io/) - Current Rapidshare.io file host with free anonymous uploads up to 1 GB, 30-day free retention, registered no-expiry messaging, and premium speed upgrades. _(Free: Free forever | Max: 1 GB | Retention: 30 days | Account: No)_
- [Riseup Share](https://share.riseup.net/) - Up1-based temporary sharing service from Riseup with 50 MB uploads, 12-hour retention, and CLI/source links. _(Free: Free forever | Max: 50 MB | Retention: 12 hours | Account: No | CLI)_
- [Rootz](https://rootz.so/) - File-sharing platform with public upload and remote-upload flows, API documentation, and a free tier limited by bandwidth rather than bundled account storage. _(Free: Free forever | Max: 25 GB | Retention: Conditional | Account: No | API)_
- [SendSpace](https://www.sendspace.com/) - Transfer-oriented file sharing service with a current 300 MB free upload limit and optional recipient delivery without requiring recipient accounts. _(Free: Free forever | Max: 300 MB | Retention: 30 days | Account: No)_
- [SharePlace](https://shareplace.org/) - File hosting service with browser uploads, account-based management, and a documented public API. _(Free: Free forever | Max: 500 MB | Retention: 60 days | Account: No | API)_
- [Stashr](https://stashr.wtf/) - Guest-friendly file-sharing host with 500 MB files, selectable expiry or download limits, and optional client-side encryption. _(Free: Free forever | Max: 500 MB | Retention: Conditional | Account: No | E2EE)_
- [Streamable](https://streamable.com/) - Short-form video sharing platform with a free 250 MB / 10 minute limit, 90-day free-account retention, URL/file uploads, and a limited read-only metadata/oEmbed API. _(Free: Free forever | Max: 250 MB | Retention: 90 days | Account: No | API | CLI)_
- [Streamain](https://streamain.com/) - Free drag-and-drop MP4/WEBM video sharing service with unlimited-size and unlimited-time claims, password protection, and optional auto-delete settings. _(Free: Free forever | Max: Unlimited | Retention: Unlimited | Account: No)_
- [Streamtape](https://streamtape.com/) - Video host with unlimited storage/bandwidth claims, 15 GB uploads, Streamtape API support, remote upload, file/folder management, and monetized streaming. _(Free: Free forever | Max: 15 GB | Retention: Conditional | Account: Yes | API | CLI)_
- [sxcu.net](https://sxcu.net/) - Free anonymous ShareX-oriented image/file uploader with a 95 MB cap, custom domains/subdomains, public collection links, and an advertised API. _(Free: Free forever | Max: 95 MB | Retention: Conditional | Account: No | API | CLI)_
- [Sync](https://www.sync.com/) - Privacy-focused cloud storage service with a 5 GB free tier and end-to-end encrypted apps across desktop and mobile. _(Free: Free forever | Max: Conditional | Retention: No automatic expiry | Account: Yes | E2EE)_
- [Synology C2 Object Storage](https://c2.synology.com/en-global/object-storage/overview) - S3-compatible cloud object storage from Synology with a 15 GB freemium tier, 15 GB/month included downloads, and web/S3 client access. _(Free: Free forever | Max: 15 GB | Retention: No automatic expiry | Account: Yes | API | CLI)_
- [take-me-to.space](https://take-me-to.space/) - Modern self-hosted upload service for small media files, with 50 MB local uploads, 32 MB proxied URL uploads, and browser extension/source links. _(Free: Free forever | Max: 50 MB | Retention: No automatic expiry | Account: No | CLI)_
- [TempSend](https://tempsend.com/) - Anonymous file-sharing service with selectable link lifetime, no registration requirement, and command-line-friendly uploads. _(Free: Free forever | Max: 2 GB | Retention: 1 year | Account: No | CLI)_
- [Tencent Weiyun](https://www.weiyun.com/index.html?WYTAG=weiyun.app.web.plugin_install) - Tencent cloud storage service with QQ or WeChat login, multi-device access, online document workflows, and official desktop and mobile apps. _(Free: Free forever | Max: 10 GB | Retention: No automatic expiry | Account: Yes)_
- [TeraBox](https://www.terabox.com/) - Consumer cloud storage service that currently markets 1 TB of free storage and apps across Android, iOS, PC, and Mac. _(Free: Free forever | Max: 20 GB | Retention: No automatic expiry | Account: Yes)_
- [ThumbSnap](https://thumbsnap.com/) - Free photo and video host with 48 MB uploads, optional accounts for albums/batch uploads, adult-content marking, and a first-party API link. _(Free: Free forever | Max: 48 MB | Retention: Conditional | Account: No | API)_
- [Tresorit Basic](https://tresorit.com/pricing/basic) - Free Tresorit cloud-storage plan with 3 GB of end-to-end encrypted storage, 500 MB files, and limited secure links. _(Free: Free forever | Max: 500 MB | Retention: 210 days | Account: Yes | E2EE)_
- [Tresorit Send](https://send.tresorit.com/) - Free browser-based file transfer service from Tresorit with end-to-end encrypted link sharing. _(Free: Free forever | Max: 5 GB | Retention: 7 days | Account: No | E2EE)_
- [UAFile.COM](https://www.uafile.com/) - Ukrainian free file host with browser uploads, direct sharing links, and plainly published per-file and inactivity limits. _(Free: Free forever | Max: 200 MB | Retention: 30 days | Account: No)_
- [Uguu](https://uguu.se/) - Temporary anonymous file hosting service with a simple public API, 128 MiB uploads, and automatic deletion after 3 hours. _(Free: Free forever | Max: 128 MiB | Retention: 3 hours | Account: No | API | CLI)_
- [Ulozto](https://ulozto.net/) - Modern cloud storage service whose free account starts at 1 GB and can unlock 25 GB after card verification, with official mobile apps, Windows backup tooling, end-to-end encryption claims, and a resumable upload API. _(Free: Free forever | Max: 1 GB | Retention: No automatic expiry | Account: Yes | API | CLI | E2EE)_
- [Upload.ee](https://www.upload.ee/) - Estonian file host with anonymous uploads, broad file-type support, and clear free retention rules for guest and registered users. _(Free: Free forever | Max: 100 MB | Retention: 50 days | Account: No)_
- [UploadFiles.io](https://ufile.io/) - Free file sharing service with no-registration guest uploads, 5 GB max file size, optional expiry controls, and an upgrade path to free managed storage. _(Free: Free forever | Max: 5 GB | Retention: 30 days | Account: No)_
- [UploadNow](https://uploadnow.io/) - Free-first file sharing and cloud storage service with guest uploads, unlimited download count and speed, and optional accounts for permanent storage plus advanced file management. _(Free: Free forever | Max: Conditional | Retention: Conditional | Account: No)_
- [UsersDrive](https://usersdrive.com/) - No-account file hosting service with password-protected links, remote URL uploads, and a clearly published max upload size on the public upload form. _(Free: Free forever | Max: 5250 MB | Retention: 14 days | Account: No)_
- [vgy.me](https://vgy.me/) - Simple image host with anonymous uploads, a public upload API, and longer retention for account-linked images. _(Free: Free forever | Max: 20 MB | Retention: Conditional | Account: No | API | CLI)_
- [Videy](https://videy.co/) - Free simple short-form video host where accounts are not required for uploading or viewing; public terms warn that availability is not guaranteed. _(Free: Free forever | Max: Not published | Retention: Conditional | Account: No)_
- [VidMoly](https://vidmoly.net/) - Cloud video hosting platform with a linked VidMoly.me control surface, 5000 GB free registered storage, 1-year inactive-video policy for free accounts, premium-only API services, and global CDN features. _(Free: Free forever | Max: Not published | Retention: 365 days | Account: Yes | API)_
- [Vidoza](https://vidoza.net/) - Free video host with 15 GB uploads, 1.5 TB free-account storage, 15-day inactive deletion for regular accounts, FTP/remote/torrent upload, and a documented API. _(Free: Free forever | Max: 15 GB | Retention: 15 days | Account: Yes | API | CLI)_
- [ViKiNG FiLE](https://vikingfile.com/) - Anonymous file host advertising unlimited file size and storage, with a public API and 15-day free retention after the last download. _(Free: Free forever | Max: Unlimited | Retention: 15 days | Account: No | API | CLI)_
- [VOE](https://voe.sx/) - Video cloud platform with a free 3 TB storage tier, 60-day inactivity reset on views, common video-format support, and a documented API. _(Free: Free forever | Max: Not published | Retention: 60 days | Account: Yes | API | CLI)_
- [webmshare](https://webmshare.com/) - Small free WebM/GIF hosting tool with 20 MB uploads, selectable expiry up to 180 days, and automatic deletion after 30 days without opens. _(Free: Free forever | Max: 20 MB | Retention: 30 days | Account: No)_
- [WeTransfer](https://wetransfer.com/) - Transfer-focused sharing service whose current free account includes up to 10 transfers or 3 GB over a rolling 30-day period. _(Free: Free forever | Max: 3 GB | Retention: Conditional | Account: Yes)_
- [WorkUpload](https://workupload.com/) - Browser-based file-sharing service with guest uploads, password protection, expiry controls, and optional account features for managing shared files. _(Free: Free forever | Max: 2 GB | Retention: Conditional | Account: No)_
- [Wormhole](https://wormhole.app/) - Privacy-focused file sending service with end-to-end encryption, up to 10 GB transfers, and peer-to-peer delivery for larger files. _(Free: Free forever | Max: 10 GB | Retention: 24 hours | Account: No | E2EE)_
- [x0.at](https://x0.at/) - Minimal file host with 1024 MiB uploads, browser/curl/netcat/SSH upload paths, open-source server code, and size-based retention from 3 to 100 days. _(Free: Free forever | Max: 1024 MiB | Retention: Conditional | Account: No | API | CLI)_
- [Yandex Disk](https://disk.yandex.com/) - Cloud storage service with a 5 GB base tier, official desktop and mobile apps, and a Linux console client. _(Free: Free forever | Max: 1 GB | Retention: No automatic expiry | Account: Yes)_
- [Your File Store](https://yourfilestore.com/) - Simple no-account file upload service with private download links, optional password protection, and long-lived files that stay active with periodic access. _(Free: Free forever | Max: 500 MB | Retention: 60 days | Account: No)_
- [YourImageShare](https://yourimageshare.com/) - Image and video hosting platform with anonymous uploads, free accounts for more control, CDN-backed sharing, and a 100 MB total-per-upload-batch limit. _(Free: Free forever | Max: 100 MB | Retention: Conditional | Account: No)_
- [Zero Upload](https://zeroupload.com/) - Free/premium file host with free uploads up to 5 GB, 70-day free retention, public API documentation, and account-based file management. _(Free: Free forever | Max: 5 GB | Retention: 70 days | Account: No | API)_

## Data

- Dataset: [`data/hosts.json`](data/hosts.json)
- Candidate backlog: [`data/candidates.json`](data/candidates.json)
- Other ways to share: [`data/alternatives.json`](data/alternatives.json)
- Other ways to share candidates: [`data/alternatives_candidates.json`](data/alternatives_candidates.json)
- Mirror uploaders: [`data/mirror_uploaders.json`](data/mirror_uploaders.json)
- Mirror uploader candidates: [`data/mirror_uploaders_candidates.json`](data/mirror_uploaders_candidates.json)
- Cloud migration tools: [`data/cloud_migration.json`](data/cloud_migration.json)
- Cloud migration candidates: [`data/cloud_migration_candidates.json`](data/cloud_migration_candidates.json)
- Schema: [`schema/hosts.schema.json`](schema/hosts.schema.json)
- Candidate schema: [`schema/candidates.schema.json`](schema/candidates.schema.json)
- Adjacent schema: [`schema/adjacent.schema.json`](schema/adjacent.schema.json)
- Adjacent candidate schema: [`schema/adjacent-candidates.schema.json`](schema/adjacent-candidates.schema.json)
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
