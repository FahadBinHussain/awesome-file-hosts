# awesome-file-hosts

> A JSON-first awesome list of file hosting services. `data/hosts.json` is the source of truth; `README.md` is generated.

## Why this repo exists

- Keep file host metadata structured and reviewable.
- Generate a human-friendly awesome-list style README from JSON.
- Make contributions safer by pushing edits through schema-backed data instead of ad hoc Markdown.

## Current hosts

Seeded with 59 hosts for now, with facts checked against official public pages on 2026-04-27.

| Name | Max file size | Retention | Bandwidth | Account required | API | CLI-friendly | E2EE | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [1FileSharing](https://1filesharing.com/) | 1 GB | Conditional | Not published | No | No | No | No | file-sharing, guest-upload, premium-upgrade, timed-hosting |
| [2Shared](https://www.2shared.com/) | 200 MB | See notes | Not published | No | No | No | No | file-sharing, guest-upload, public-index, browser-upload |
| [4shared](https://www.4shared.com/) | 2048 MB | Not published | See notes | Yes | No | No | No | cloud-storage, mobile-apps, free-tier, sharing |
| [Android File Host](https://androidfilehost.com/) | Not published | Not published | Conditional | Yes | [Yes](https://androidfilehost.com/api/docs/) | No | No | file-hosting, android-dev, api, mirror-downloads |
| [AnonFile](https://anonfile.co/) | Unlimited | Not published | 10 GB/day | No | [Yes](https://anonfile.link/docs/api) | Yes* | Yes | file-sharing, privacy, e2ee, guest-upload, api |
| [Baidu Pan](https://pan.baidu.com/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, backup, file-sharing, ios, mac |
| [Box](https://www.box.com/) | 250 MB | Not published | Not published | Yes | [Yes](https://developer.box.com/reference/) | No | No | cloud-storage, apps, api, single-user-free-plan |
| [Catbox](https://catbox.moe/) | 200 MB | See notes | Not published | Unknown | No | No | No | anonymous-friendly, simple-upload, permanent-links |
| [Clicknupload](https://clicknupload.click/) | 2 GB | 7 days | Unlimited | No | No | No | No | file-hosting, guest-uploads, unlimited-bandwidth, ad-supported |
| [CloudBeeline](https://cloudbeeline.ru/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, mobile-apps, password-protected-sharing, free-tier |
| [Cloudup](https://cloudup.com/) | Not published | Not published | Not published | Yes | [Yes](https://n.cloudup.com/) | No | No | file-sharing, api, private-by-default, direct-links, oembed |
| [Cozy Cloud](https://en.cozy.io/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, apps, france-hosted, open-source-adjacent |
| [Data.hu](https://data.hu/) | Not published | Not published | Not published | No | No | Yes* | No | file-sharing, guest-upload, ftp-upload, hungary, premium-download-gating |
| [DDownload](https://ddownload.com/) | Not published | 30 days | Not published | No | [Yes](https://ddownload.com/api) | Yes* | No | cloud-storage, file-sharing, api, guest-upload, free-tier |
| [Degoo](https://degoo.com/) | Not published | 90 days | Not published | Yes | No | No | No | cloud-storage, mobile-apps, web-app, backup |
| [DFiles](https://dfiles.eu/) | 10 GB | 90 days | Not published | No | No | Yes* | No | file-sharing, ftp-upload, remote-upload, mobile-apps, free-tier |
| [DirectUpload](https://www.directupload.eu/) | 8 MB | 1 year | Not published | No | No | No | No | image-hosting, anonymous-friendly, auto-delete-options, german-service |
| [Disroot Upload](https://disroot.org/en/services/upload) | Not published | Not published | Not published | No | No | No | Yes | file-sharing, temporary, e2ee, no-account-required |
| [Dropbox](https://www.dropbox.com/) | Not published | Not published | Not published | Yes | [Yes](https://www.dropbox.com/developers/documentation) | No | No | cloud-storage, apps, api, mainstream |
| [DropMeFiles](https://dropmefiles.com/) | 50 GB | 14 days | Not published | No | No | No | No | file-sharing, no-account-required, password-protection, link-expiry |
| [FEX.NET](https://new.fex.net/en/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, file-sharing, android-app, online-viewing, link-sharing |
| [File-Upload.net](https://www.file-upload.net/en/) | 1 GB | 365 days | See notes | No | No | No | No | file-sharing, guest-upload, desktop-tool, android-app, affiliate |
| [File.AL](https://file.al/) | 20 GB | 30 days | 5 GB/day | Yes | No | No | No | file-sharing, remote-upload, registered-tier, browser-upload |
| [file.io](https://www.file.io/) | 4 GB | 1 download | Not published | No | [Yes](https://www.file.io/developers) | Yes* | No | api, cli-friendly, ephemeral, anonymous-friendly |
| [Filebin](https://filebin.net/) | Not published | 6 days | Not published | No | [Yes](https://filebin.net/api) | No | No | file-sharing, no-account-required, api, open-source |
| [FileFactory](https://www.filefactory.com/) | 5 GB | 90 days | Not published | Yes | No | No | No | file-hosting, free-membership, large-files, long-running |
| [FileKarelia](https://file.karelia.ru/) | 2 GB | 30 days | Not published | Yes | No | No | No | file-sharing, account-required, russian, link-sharing |
| [files.dp.ua](https://files.dp.ua/en/) | 100 GB | 25 days | Not published | No | No | No | No | file-sharing, no-account-required, password-protection, large-file-limit |
| [files.fm](https://files.fm/) | 5 GB | 1 month | Not published | Yes | [Yes](https://files.fm/api/) | Yes | No | cloud-storage, apps, api, eu-based |
| [Free Transfert](https://transfert.free.fr/) | 10 GB | 30 days | Not published | No | No | No | No | file-sharing, password-protection, direct-links, france-hosted |
| [Gofile](https://gofile.io/) | Not published | 10 days | Not published | No | [Yes](https://gofile.io/api) | Yes* | No | guest-uploads, api, cli-friendly, premium-upgrade |
| [Google Drive](https://drive.google.com/) | Not published | Not published | Not published | Yes | [Yes](https://developers.google.com/drive/api/guides/about-sdk) | No | No | cloud-storage, apps, api, shared-google-quota |
| [Hightail](https://www.hightail.com/) | 100 MB | 7 days | Not published | Yes | No | No | No | file-sharing, creative-workflows, free-tier, recipient-no-account |
| [Hostr](https://hostr.co/) | 20 MB | See notes | See notes | Yes | No | No | No | file-sharing, desktop-apps, free-account, instant-sharing |
| [Jumpshare](https://jumpshare.com/) | 250 MB | Not published | Not published | Yes | No | No | No | file-sharing, desktop-apps, ios-app, screen-recording |
| [LimeWire](https://limewire.com/) | 4 GB | Not published | Not published | No | No | No | Yes | file-sharing, guest-uploads, e2ee, browser-based |
| [MediaFire](https://www.mediafire.com/) | 5 GB | Not published | Not published | Yes | No | No | No | cloud-storage, mobile-apps, ad-supported, sharing |
| [MiMedia](https://www.mimedia.com/) | Not published | 30 days | Not published | Yes | No | No | No | cloud-storage, desktop-apps, mobile-apps, media-focused |
| [MobiDrive](https://www.mobidrive.com/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, apps, privacy-first, office-integration |
| [MyAirBridge](https://www.myairbridge.com/) | 20 GB | Conditional | Not published | No | [Yes](https://info.myairbridge.com/cs/faq) | No | No | file-sharing, large-transfers, no-account-required, password-options |
| [Oblako Mail.ru](https://cloud.mail.ru/) | 1 GB | 3 months | Not published | Yes | No | Yes* | No | cloud-storage, mobile-apps, windows-app, webdav |
| [OneDrive](https://www.microsoft.com/en-us/microsoft-365/onedrive/) | Not published | Not published | Not published | Yes | [Yes](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/?view=odsp-graph-online) | No | No | cloud-storage, apps, api, microsoft-ecosystem |
| [OpenDrive](https://www.opendrive.com/) | 100 MB | Not published | Not published | Yes | [Yes](https://www.opendrive.com/api) | No | No | cloud-storage, apps, api, backup-and-sync |
| [OwnDrive](https://owndrive.com/) | Not published | Not published | Not published | Yes | No | No | No | cloud-storage, free-tier, limited-apps, hosted-cloud |
| [pCloud](https://www.pcloud.com/) | Not published | Not published | Not published | Yes | [Yes](https://docs.pcloud.com/) | No | No | cloud-storage, apps, api, optional-client-side-encryption |
| [Pixeldrain](https://pixeldrain.com/) | 100 GB | 60 days | 5 GB/day | Unknown | [Yes](https://pdx02.pixeldrain.com/api) | Yes* | No | rclone, ftps, api, expiry-on-activity |
| [SendSpace](https://www.sendspace.com/) | 300 MB | Not published | Not published | No | No | No | No | file-sharing, no-account-required, temporary-limit, recipient-delivery |
| [Sync](https://www.sync.com/) | Not published | Not published | Not published | Yes | No | No | Yes | cloud-storage, apps, e2ee, privacy-focused |
| [TempSend](https://tempsend.com/) | 2 GB | 1 year | Not published | No | No | Yes | No | file-sharing, anonymous-friendly, cli-friendly, no-account-required |
| [TeraBox](https://www.terabox.com/) | 20 GB | Not published | Not published | Yes | No | No | No | cloud-storage, apps, large-free-tier, consumer-backup |
| [Tresorit Send](https://send.tresorit.com/) | 5 GB | 7 days | Not published | No | No | No | Yes | file-sharing, e2ee, browser-based, password-protection |
| [Ulozto](https://ulozto.net/) | Not published | Not published | 150 GB/month | Yes | [Yes](https://ulozto.net/upload-resumable-api-beta) | Yes* | Yes | cloud-storage, apps, api, e2ee |
| [Upload.ee](https://www.upload.ee/) | 100 MB | 50 days | Not published | No | No | No | No | file-sharing, anonymous-friendly, password-protection, iframe-embed |
| [UploadFiles.io](https://ufile.io/) | 5 GB | 30 days | Not published | No | No | No | No | file-sharing, no-account-required, free-account-upgrade, expiry-options |
| [UsersDrive](https://usersdrive.com/) | 5250 MB | Not published | Not published | No | No | No | No | file-hosting, no-account-required, password-protection, remote-upload |
| [WeTransfer](https://wetransfer.com/) | 3 GB | See notes | Not published | Yes | No | No | No | file-sharing, mobile-apps, password-protection, rolling-transfer-limit |
| [Wormhole](https://wormhole.app/) | 5 GB | 24 hours | Not published | Unknown | No | No | Yes | e2ee, peer-to-peer, ephemeral, privacy-focused |
| [Yandex Disk](https://disk.yandex.com/) | 1 GB | Not published | Not published | Yes | No | No | No | cloud-storage, apps, linux-client, public-links |
| [Your File Store](https://yourfilestore.com/) | 500 MB | 60 days | Not published | No | No | No | No | file-sharing, no-account-required, password-protection, private-links |

`Yes*` in the CLI-friendly column means a concrete command or access example is included in the notes.
`Not published` means the cited public pages did not give a clean current number. `Conditional` means the limit depends on account type, inactivity, downloads, or another rule described in the notes.

## Notes

### 1FileSharing

Timed file-hosting service with guest uploads, 1 GB free uploads, and premium upgrades for larger files and longer retention.

- Max file size: The current upload page states a 1.00 GB maximum file size for free uploads.
- Retention: Current public pages describe free files as sharable for 30 days, while also saying free-member files may be removed after 7 days without downloads.
- Bandwidth: The cited public pages describe free download speed and waiting-time limits, but do not publish a clean bandwidth cap.
- Account: Guest uploads work without an account; paid accounts add faster downloads, larger uploads, and longer file retention.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy.
- Developer support: The cited public pages do not document a public API or CLI upload workflow.
- Security: The cited public pages do not claim end-to-end encryption for uploads.
- Sources: [Upload page](https://1filesharing.com/?f=120205716), [Download page](https://1filesharing.com/2dBo)

### 2Shared

Long-running file-sharing service with browser uploads, a 200 MB per-file upload limit, and a searchable public catalog.

- Max file size: The current upload page explicitly states a max. 200 MB upload size.
- Retention: The cited public pages do not clearly publish an automatic expiry policy for uploaded files.
- Bandwidth: The cited public pages do not publish a clean current bandwidth cap.
- Account: The public upload page allows direct browser uploads without requiring login before selecting a file.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy.
- Developer support: The cited public pages do not document a public API or CLI upload flow.
- Security: The cited public pages do not claim end-to-end encryption.
- Sources: [Upload page](https://www.2shared.com/)

### 4shared

Long-running cloud storage and file-sharing service with a free 15 GB tier, 2 GB max uploads, and official mobile apps.

- Max file size: The official features page currently lists a 2048 MB maximum upload file size for the free plan.
- Retention: The cited public pages do not state an automatic expiry period for files stored on the free plan.
- Bandwidth: The official features page lists the free plan bandwidth limitation as 0, but it does not clearly explain this as a numeric cap.
- Account: A 4shared account is required to use the free storage plan and mobile apps.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public developer API or CLI workflow.
- Security: The cited public pages do not claim end-to-end encryption for the free plan.
- Sources: [Features](https://www.4shared.com/features.jsp), [Mobile Overview](https://www.4shared.com/mobile.jsp), [iPhone App](https://www.4shared.com/iphone/)

### Android File Host

Large Android-focused file hosting network for developers with unlimited downloads, multiple mirrors, and a public beta API.

- Max file size: The cited public pages do not publish a general per-file upload cap for the free tier.
- Retention: The cited public pages do not publish an automatic expiry period for hosted files.
- Bandwidth: Android File Host publicly states it does not limit download speeds or bandwidth usage.
- Account: Developers need an account to upload and manage files; free visitors can browse and download files without registration.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: Android File Host publishes a beta API for browsing devices, developers, folders, updates, and files.
- Security: The cited public pages emphasize high-speed delivery and hosted storage, but do not claim end-to-end encryption.
- Sources: [Homepage](https://androidfilehost.com/), [API Docs](https://androidfilehost.com/api/docs/), [Membership Plans](https://androidfilehost.com/user/?w=select-membership-plans)

### AnonFile

Privacy-focused file hosting service with browser-side encryption, no-account sharing, public API docs, and optional free accounts.

- Max file size: The public upload page currently advertises unlimited max file size for uploads.
- Retention: The cited public pages do not publish a clean automatic expiry policy for stored files.
- Bandwidth: The public FAQ currently says free accounts get 10 GB daily transfer.
- Account: Anyone can share files by link without an account; free accounts add stored space and account-managed uploads.
- Allowed file types: The API docs imply some disallowed and banned file types through error codes, but the cited public pages do not publish a full allowlist.
- CLI example: `curl -F "file=@example.txt" "https://api.anonfile.link/upload?key={YOUR_API_KEY}"`
- Developer support: AnonFile publishes API docs with upload and file-info endpoints.
- Security: The current public pages claim files are encrypted before they leave the browser and that the service cannot read file contents.
- Sources: [Upload page](https://anonfile.co/), [API documentation](https://anonfile.link/docs/api)

### Baidu Pan

Baidu's large-scale cloud storage service with multi-device backup, file sharing, iPhone/Mac apps, and very large paid expansion tiers.

- Max file size: The cited public pages do not publish a clean current per-file upload limit.
- Retention: The cited public pages do not publish a clean automatic expiry policy for stored files.
- Bandwidth: The cited public pages do not publish a clean numeric bandwidth cap for free users.
- Account: A Baidu account is required for cloud backup, syncing, and sharing across devices.
- Allowed file types: The cited public pages describe support for photos, videos, documents, app files, messages, and call records, but do not publish a narrow allowlist.
- Developer support: The cited public consumer pages do not document a public API or CLI upload workflow.
- Security: The App Store listing says the service uses multiple data centers and cites ISO27001 and ISO27018 security certifications, but it does not claim end-to-end encryption.
- Sources: [Baidu homepage navigation](https://www.baidu.com/), [Baidu Pan App Store listing](https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98/id547166701), [Baidu Pan HD App Store listing](https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-hd/id554602005), [Baidu Pan feature page](https://yun.baidu.com/disk/dilatation)

### Box

Cloud storage and file-sharing platform with a free single-user plan and first-party desktop and mobile apps.

- Max file size: The Individual free plan currently lists a 250 MB file upload limit.
- Retention: The cited public pages do not state an automatic expiry period for files on the free plan.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: The free Individual plan is a single-user Box account with storage, native e-signatures, and app access.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: Box provides official developer documentation and API reference through Box Dev Docs.
- Security: The cited pages emphasize secure file sharing and 2-factor authentication, but they do not claim end-to-end encryption for the consumer plan.
- Sources: [Pricing](https://www.box.com/pricing), [Downloads](https://www.box.com/en-gb/resources/downloads?url_redirect=direct), [API Reference](https://developer.box.com/reference/)

### Catbox

Long-running, user-funded file host with a simple public upload flow.

- Max file size: Homepage currently states uploads up to 200 MB.
- Retention: Files are kept indefinitely according to the FAQ.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Accounts exist, but the cited public pages do not clearly describe account-specific benefits.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited homepage and FAQ do not document an official API or CLI workflow.
- Security: No end-to-end encryption claim is made on the cited pages.
- Sources: [Homepage](https://catbox.moe/), [FAQ](https://catbox.moe/faq.php)

### Clicknupload

Ad-supported file hosting service with free guest uploads, large per-file limits, and unlimited bandwidth for current free accounts.

- Max file size: The current official FAQ states free and guest users can upload files up to 2 GB each, while registered users can upload up to 3 GB.
- Retention: The current official FAQ says inactive guest-uploaded files are removed after about a week, while inactive member files are removed after 20 to 30 days.
- Bandwidth: The official FAQ currently says bandwidth is unlimited for free users.
- Account: Guests can upload without an account, while members get a higher per-file upload limit and can manage files through My Files.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages do not document a public API or CLI upload workflow.
- Security: The cited FAQ mentions account security controls such as a security lock, but the public pages do not claim end-to-end encryption.
- Sources: [Homepage](https://clicknupload.click/), [FAQ](https://clicknupload.click/faq.html)

### CloudBeeline

Beeline consumer cloud storage service with 10 GB free storage, password-protected sharing, and mobile apps.

- Max file size: The cited public pages do not publish a clean current per-file upload limit.
- Retention: The cited public pages do not publish a clean automatic expiry policy for stored or shared files.
- Bandwidth: The public pages say Beeline customers can use the service without traffic limits on the Beeline network, but do not publish a clean general bandwidth cap.
- Account: The current sign-in flow uses phone-number login; accounts enable storage, sharing, backups, and app access.
- Allowed file types: The public pages describe storage for photos, videos, presentations, contacts, and other files, but do not publish a narrow allowlist.
- Developer support: The cited public pages do not document a public API or CLI upload flow.
- Security: The public pages position it as secure cloud storage and mention password-protected access to files and folders, but do not claim end-to-end encryption.
- Sources: [CloudBeeline homepage](https://cloudbeeline.ru/), [Google Play listing](https://play.google.com/store/apps/details?hl=en_US&id=ru.beeline.cloud), [App Store listing](https://apps.apple.com/us/app/%D0%BE%D0%B1%D0%BB%D0%B0%D0%BA%D0%BE-%D0%B1%D0%B8%D0%BB%D0%B0%D0%B9%D0%BD-%D0%BF%D0%BE%D1%87%D0%B8%D1%81%D1%82%D0%B8%D1%82%D1%8C-%D0%BF%D0%B0%D0%BC%D1%8F%D1%82%D1%8C/id1495684365)

### Cloudup

Private-by-default file and link sharing service from Automattic with public API docs, direct links, and stream-based sharing.

- Max file size: The cited official public pages do not publish a clean current maximum upload size.
- Retention: The cited official public pages do not publish a clean automatic expiry policy for files or streams.
- Bandwidth: The cited official public pages do not publish a clean current bandwidth cap.
- Account: Cloudup accounts are required for authenticated API use, stream management, and application registration.
- Allowed file types: Official posts describe support for files, URLs, HTML, XML, SVG, and media embeds, but do not publish a full restrictive allowlist.
- Developer support: Cloudup publishes official API documentation for streams, items, uploads, OAuth, and oEmbed.
- Security: The official docs require HTTPS and describe private-by-default sharing, but do not claim end-to-end encryption.
- Sources: [API documentation](https://n.cloudup.com/), [Direct links update](https://blog.cloudup.com/2017/02/16/a-new-home-for-cloudup-direct-links/), [Privacy policy update](https://blog.cloudup.com/2018/08/24/privacy-policy-update/)

### Cozy Cloud

French personal cloud platform now branded as Twake Workplace, with a free 5 GB tier and official desktop and mobile apps.

- Max file size: The cited current public pages describe storage tiers but do not publish a per-file upload limit for the free plan.
- Retention: The cited current public pages do not state an automatic expiry period for files stored on the free plan.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free account includes 5 GB of storage, unlimited authorized devices, chat, and collaborative notes.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages document end-user apps and self-hosting, but they do not present a public developer API.
- Security: Twake emphasizes privacy, GDPR compliance, and French hosting on the cited pages, but these pages do not claim end-to-end encryption for the hosted free plan.
- Sources: [Homepage](https://en.cozy.io/), [Pricing](https://en.cozy.io/pricing), [Download](https://en.cozy.io/download)

### Data.hu

Hungarian file-sharing service with free browser uploads, unlimited advertised storage, optional FTP uploads, and premium-gated large downloads.

- Max file size: The official public pages promote large-file sharing but do not publish a clean current maximum upload size.
- Retention: The cited official public pages do not publish a clean automatic expiry policy for hosted files.
- Bandwidth: The official pages do not publish a clean bandwidth cap, but free downloads above 200 MB are restricted to premium users.
- Account: Guest uploads work through the homepage; registered users can track uploads, organize files, and use free FTP upload access.
- Allowed file types: The homepage explicitly mentions videos, music, and large files; the cited public pages do not publish a narrow allowlist.
- CLI example: `Use any FTP client after logging in; the help page says FTP upload is free for registered users.`
- Developer support: The service does not publish a public API, but official help documents free FTP upload for registered users.
- Security: The cited official public pages do not claim end-to-end encryption.
- Sources: [Homepage](https://data.hu/), [Help / FAQ](https://data.hu/segitseg), [Example download page](https://data.hu/get/14779606/Gylksmmr_3-grbcstl.z01?pid=1976132609), [Premium page](https://data.hu/premium)

### DDownload

Cloud storage and file-sharing service with a free 5 TB plan, 30-day inactivity policy, guest uploads, and a public API.

- Max file size: The cited official public pages do not publish a clean current maximum upload size.
- Retention: The official pricing page currently lists 30 days of file inactivity for the free plan.
- Bandwidth: The official pricing page says the free plan has limited traffic per day, but does not publish a clean numeric cap.
- Account: Guest uploads appear to be supported; creating an account unlocks the free storage plan, file manager, folders, stats, and API key access.
- Allowed file types: The official FAQ says all kinds of files may be uploaded except pornography, nudity, sexual images, offensive material, and copyrighted material.
- CLI example: `curl "https://api-v2.ddownload.com/api/account/info?key=YOUR_KEY"`
- Developer support: DDownload publishes official API documentation for account info, uploads, files, and folders.
- Security: The official pages describe secure storage and HTTPS delivery, but do not claim end-to-end encryption.
- Sources: [Homepage and pricing](https://ddownload.com/), [FAQ](https://ddownload.com/faq.html), [API documentation](https://ddownload.com/api)

### Degoo

Consumer cloud backup service with a free 20 GB tier, web access, and mobile apps, but no current desktop client.

- Max file size: The cited official public pages do not publish a current per-file upload limit for the free plan.
- Retention: The Degoo homepage currently says free accounts are subject to 90 days of account inactivity.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Degoo account is required for the free plan, which currently includes web access and up to 3 devices.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public developer API or CLI workflow.
- Security: Degoo publicly markets encrypted communication and an optional zero-knowledge storage feature, but the cited pages do not establish end-to-end encryption as the default free-plan model.
- Sources: [Homepage](https://degoo.com/), [Android and iOS](https://help.degoo.com/support/solutions/articles/77000065527-can-i-use-degoo-on-android-or-ios-), [Desktop App](https://help.degoo.com/support/solutions/articles/77000065535-do-you-have-a-native-desktop-app-for-windows-osx-or-linux-)

### DFiles

Long-running file hosting service under the DepositFiles brand with free uploads up to 10 GB, 90-day retention after downloads, mobile apps, and FTP/remote upload support.

- Max file size: The official DepositFiles FAQ and homepage state that users can upload files up to 10 GB.
- Retention: The official FAQ says uploaded files are stored for 90 days, and each download extends retention by another 90 days.
- Bandwidth: The official public pages do not publish a clean numeric bandwidth cap for free users.
- Account: Free use is available without payment; creating an account enables easier file management, removal options, and additional account features.
- Allowed file types: The official FAQ says many file types are allowed, while copyrighted or illegal content may be removed.
- CLI example: `Upload by FTP or remote HTTP/FTP transfer after creating an account.`
- Developer support: The official pages document FTP upload and remote HTTP/FTP upload, but do not publish a public developer API.
- Security: The official pages position it as safe file transfer and storage, but do not claim end-to-end encryption.
- Sources: [DepositFiles homepage](https://depositfiles.com/), [DepositFiles FAQ](https://depositfiles.com/en/faq.html)

### DirectUpload

Long-running German image host with free anonymous uploads, short custom auto-delete options, and a 1-year minimum storage period.

- Max file size: The current upload page lists a maximum of 8 MB per file.
- Retention: The homepage currently advertises a 1-year minimum storage duration, while uploaders can also choose shorter auto-delete periods during upload.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Anonymous uploads are supported; registered members can store images free and long-term.
- Allowed file types: The current upload page supports JPG, GIF, PNG, WEBP, BMP, HEIC, and PDF uploads, with some formats converted automatically.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The cited public pages focus on image hosting features and do not claim end-to-end encryption.
- Sources: [Homepage](https://www.directupload.net/)

### Disroot Upload

Privacy-focused temporary file sharing from Disroot, powered by Lufi and encrypted in the browser before upload.

- Max file size: The cited current public Upload pages for this batch do not publish a maximum file size.
- Retention: Disroot describes the service as temporary and Lufi-based, but the cited current public pages do not state a specific expiry duration.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: No account is needed to upload files; users receive download and deletion links.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages do not document a public API or CLI workflow for this hosted instance.
- Security: Disroot states files are encrypted in the browser before upload, so administrators cannot see the file contents.
- Sources: [Upload Service](https://disroot.org/en/services/upload), [Lufi About](https://upload.disroot.org/about)

### Dropbox

Mainstream cloud storage service with a free 2 GB Basic plan, official desktop and mobile apps, and a well-documented developer API.

- Max file size: The cited current public free-plan pages do not publish a per-file upload cap for Dropbox Basic.
- Retention: The cited public free-plan pages do not state an automatic expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit for the free plan.
- Account: A Dropbox account is required to use the Basic free plan, sync files, and access desktop and mobile apps.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: Dropbox provides official developer documentation and APIs for file storage and sharing integrations.
- Security: Dropbox publicly documents encryption and secure sharing, but the cited Basic-plan pages do not present the service as end-to-end encrypted by default.
- Sources: [Dropbox Basic](https://help.dropbox.com/plans/dropbox-basic-faq), [Desktop App](https://help.dropbox.com/installs/download-dropbox), [Mobile App](https://help.dropbox.com/installs/access-dropbox), [Developer Docs](https://www.dropbox.com/developers/documentation)

### DropMeFiles

Browser-based file sharing service with no registration requirement, large free uploads, password protection, and selectable link lifetime.

- Max file size: The homepage currently states the maximum size of uploaded files is up to 50 GB.
- Retention: The current upload flow offers 3-day, 7-day, and 14-day storage options, plus a one-download deletion option.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: No registration is required for the standard upload and sharing flow.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The current public site does not document an official API or command-line upload workflow.
- Security: The service supports password-protected links, but the cited public page does not claim end-to-end encryption.
- Sources: [Homepage](https://dropmefiles.com/)

### FEX.NET

Modern cloud storage and file-sharing service with online viewing, link sharing, Android app support, and encrypted-in-transit data handling.

- Max file size: The cited public pages do not publish a clean current maximum upload size.
- Retention: The cited public pages do not publish a clean automatic expiry policy for shared files.
- Bandwidth: The cited public pages do not publish a clean numeric bandwidth cap.
- Account: The current product pages and app positioning revolve around account-based cloud storage, online viewing, and shared links.
- Allowed file types: The cited public pages describe storing photos, videos, documents, and music, but do not publish a full allowlist.
- Developer support: The cited public pages do not document a public API or CLI upload workflow.
- Security: The Google Play listing says data is encrypted in transit and can be deleted on request, but the cited pages do not claim end-to-end encryption.
- Sources: [FEX homepage](https://new.fex.net/en/), [Google Play listing](https://play.google.com/store/apps/details?id=net.fex.androidv2), [Pricing page](https://new.fex.net/pricing)

### File-Upload.net

Guest-friendly German file host with 1 GB uploads, up to one year of storage, optional registration for management features, and desktop/mobile upload tools.

- Max file size: The English upload page currently states a maximum size of 1 GB per file.
- Retention: The English upload page says files are stored up to one year, and the FAQ says images stay at least one year before later cleanup rules apply.
- Bandwidth: The registration page advertises no traffic limit, but the public pages do not present a clean numeric bandwidth cap.
- Account: Guest uploads work without registration; free registration adds file overview, statistics, and management features.
- Allowed file types: The FAQ says there are no file-format limits as long as uploads do not violate the terms and conditions.
- Developer support: The service offers upload tools and an uploader app, but the cited public pages do not document a public developer API or CLI workflow.
- Security: The FAQ describes randomly generated file names and delete links, but the public pages do not claim end-to-end encryption.
- Sources: [English upload page](https://www.file-upload.net/en/), [FAQ](https://www.file-upload.net/hilfe.php), [Register page](https://www.file-upload.net/en/registrieren.php), [Upload tools](https://www.file-upload.net/tools.php)

### File.AL

Account-based file host with browser and remote URL uploads, a free registered tier, and structured premium comparison published on the site.

- Max file size: The premium comparison currently lists a 20 GB maximum upload file size for registered users.
- Retention: The premium comparison currently says registered-user files are deleted 30 days after the last download.
- Bandwidth: The premium comparison currently lists 5 GB of download volume per day for registered users.
- Account: Uploads are enabled for confirmed users only, and registration enables remote URL upload plus the published registered-user tier.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy.
- Developer support: The site navigation mentions API, but the cited public pages do not expose a clear public developer documentation page for verification.
- Security: The public pages position File.AL as secure storage and sharing, but do not claim end-to-end encryption.
- Sources: [Homepage](https://file.al/), [Premium comparison](https://file.al/?op=subscribe&usr_id=302491), [Login navigation page](https://file.al/login.html)

### file.io

Temporary file sharing service with a public REST API and auto-delete behavior.

- Max file size: Homepage FAQ says file transfers are limited to a total of 4 GB. The plans page lists 2 GB for the free managed plan, so this entry reflects the public upload flow on the homepage.
- Retention: Files are deleted after the first download by default. The homepage also documents a default 14-day expiry if the file is not downloaded.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Accounts let you manage shared files in the web app.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- CLI example: `curl -F "file=@example.txt" https://file.io`
- Developer support: The homepage and developer docs both show curl-based upload flows.
- Security: Homepage states files are encrypted in transit and at rest, but the service can still access them server-side.
- Sources: [Homepage](https://www.file.io/), [Developer Docs](https://www.file.io/developers), [Plans](https://www.file.io/plans)

### Filebin

Open-source no-account file sharing service with a public API and automatic short-lived deletion.

- Max file size: The cited public pages do not publish a per-file upload size limit.
- Retention: The homepage currently states uploaded files are automatically deleted 6 days after upload.
- Bandwidth: The cited public pages do not publish a numeric bandwidth cap, but uploads can be blocked when the overall service storage capacity is reached.
- Account: No registration is required; anyone with the link can upload, download, or manually delete the bin contents.
- Allowed file types: The terms prohibit illegal, copyrighted, malicious, obscene, and abusive uses, but the service otherwise accepts arbitrary uploaded content.
- Developer support: Filebin publishes API documentation for uploading, listing, downloading, and deleting files.
- Security: Filebin says HTTPS protects data in transit, but files are not encrypted on the server side and should be client-encrypted if needed.
- Sources: [Homepage](https://filebin.net/), [API Documentation](https://filebin.net/api), [About](https://filebin.net/about), [Privacy](https://filebin.net/privacy)

### FileFactory

Long-running file hosting service with free accounts, 5 GB upload limits, and 90-day storage for free members.

- Max file size: The current premium comparison page lists a 5 GB max upload file size for free members.
- Retention: The current premium comparison page lists 90 days of file storage time for free members.
- Bandwidth: The current comparison page says free members face hourly download limits but does not publish a clean numeric bandwidth cap.
- Account: A free member account is required for uploads and 90-day storage; anonymous users can only download with heavier limits.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The cited public pages emphasize hosted download service features but do not claim end-to-end encryption.
- Sources: [Premium Comparison](https://www.filefactory.com/premium/)

### FileKarelia

Russian file-sharing service with account-based uploads, month-long retention after access, and larger limits for registered users.

- Max file size: The published terms currently allow files up to 2 GB for registered users, while the landing page advertises smaller limits in some unauthenticated states.
- Retention: The published terms say files are deleted after 30 days since the last access for ordinary uploads.
- Bandwidth: The cited public pages do not publish a clean numeric bandwidth cap.
- Account: The current landing page says only registered users can upload, and registration enables larger upload sizes and upload management.
- Allowed file types: The terms prohibit malware, copyrighted material without permission, spam, encrypted archive file lists, and other disallowed content.
- Developer support: The cited public pages do not document a public API or CLI upload flow.
- Security: The service is delivered over HTTPS, but the cited public pages do not claim end-to-end encryption.
- Sources: [Landing page](https://file.karelia.ru/), [Terms of service](https://file.karelia.ru/terms)

### files.dp.ua

Anonymous file-sharing service with selectable expiry, optional password protection, and unusually large free upload limits.

- Max file size: The current homepage and terms say the maximum upload size is 100 GB.
- Retention: The homepage and terms say files are stored for up to 25 days, with shorter options like 24 hours, 7 days, and 20 days available at upload time.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Files can be uploaded and shared without registration, with optional password protection and one-download expiry.
- Allowed file types: The current terms broadly allow file uploads but prohibit malware, illegal material, certain copyright violations, misleading files, and some public-file categories.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The service offers password-protected files, but the cited public pages do not claim end-to-end encryption.
- Sources: [Homepage](https://files.dp.ua/en/), [Terms of Use](https://www.files.dp.ua/en/terms_of_use/)

### files.fm

EU-based cloud storage and file-sharing platform with a free Basic tier, 5 GB max file size, apps across major platforms, and official developer API support.

- Max file size: The current Basic plan lists a 5 GB file size limit.
- Retention: The current Basic plan lists 20 GB of storage for a month.
- Bandwidth: The current Basic plan does not publish a numeric data-transfer cap on the cited pricing page.
- Account: A free account provides the Basic tier with storage, private sharing, file inbox, and conversion tools.
- Allowed file types: The homepage positions Files.fm as handling photos, videos, audio, and documents, but contributors should still verify prohibited-content rules from the service terms before refining this field further.
- Developer support: Files.fm publicly advertises an API for developers, plus WebDAV and FTP access in its apps and tools section.
- Security: Files.fm markets secure European data-center storage, GDPR compliance, and advanced encryption, but the cited pages do not claim end-to-end encryption.
- Sources: [Homepage](https://files.fm/), [Developer API](https://files.fm/api/)

### Free Transfert

Free's browser-based file transfer service with direct-link sharing, optional password protection, and a larger free allowance for Freebox subscribers.

- Max file size: Official support currently states transfers are free up to 10 GB for non-Freebox users, while Freebox subscribers get unlimited volume.
- Retention: Official support says transfer validity can be set up to 30 days for Freebox subscribers and up to 7 days for non-Freebox users.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: The service is free to use from a browser, with expanded limits for Freebox subscribers.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited official support pages describe browser-based sharing only and do not document a public API or CLI flow.
- Security: Free states transferred files are encrypted with HTTPS and stored in datacenters in Paris until expiration; the cited pages do not claim end-to-end encryption.
- Sources: [Service Overview](https://assistance.free.fr/articles/dlfreefr-quest-ce-que-cest--625), [How To Share](https://assistance.free.fr/articles/dlfreefr-comment-utiliser-ce-service--626), [Free News](https://portail.free.fr/mag-free/nouveautes/free-transfert-le-service-denvoi-et-de-partage-de-fichiers-evolue/)

### Gofile

Cloud storage and content distribution platform with guest uploads and a beta REST API.

- Max file size: The cited FAQ and API docs do not publish a current max upload size.
- Retention: Free content is ephemeral by default and kept for 10 days, with longer retention if it remains actively downloaded.
- Bandwidth: The cited public pages position Gofile as having no download limits, but they do not publish a numeric bandwidth quota.
- Account: Free accounts keep uploads across sessions; Premium unlocks permanent storage and advanced features.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- CLI example: `curl -F "file=@example.txt" https://upload.gofile.io/uploadfile`
- Developer support: API is in beta. Most endpoints require Premium, but basic upload and content management are available to free accounts.
- Security: FAQ states content is encrypted on Gofile servers, but not end-to-end encrypted.
- Sources: [FAQ](https://gofile.io/faq), [API Docs](https://gofile.io/api), [Premium](https://gofile.io/premium)

### Google Drive

Google's cloud storage service with 15 GB of free account storage and official desktop/mobile clients.

- Max file size: The cited public pages used for this batch do not publish a current per-file upload limit.
- Retention: The cited public pages do not state an automatic expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Google Account provides shared Google storage and access to Drive across web, desktop, and mobile.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: Google provides official Google Drive API documentation for apps that integrate with Drive storage.
- Security: The cited storage and app pages do not claim end-to-end encryption for standard Google Drive storage.
- Sources: [Storage Help](https://support.google.com/drive/answer/9312312?hl=en-en), [Drive for Desktop](https://support.google.com/drive/answer/7329379?hl=en), [Download a File](https://support.google.com/drive/answer/2423534?co=GENIE.Platform%3DAndroid&hl=en), [Drive API Overview](https://developers.google.com/drive/api/guides/about-sdk)

### Hightail

Creative-focused file-sharing service with a free Lite plan for smaller transfers, 2 GB of storage, and no-account-required recipient access.

- Max file size: The Lite plan currently lists a 100 MB file size send limit.
- Retention: The Lite plan currently lists a 7-day file expiration.
- Bandwidth: The cited pricing page does not publish a numeric bandwidth cap for the Lite plan.
- Account: A Hightail Lite account provides free storage and smaller-file sharing, while recipients do not need an account to access shared files.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public developer API or CLI workflow.
- Security: The cited public pages describe secure file sharing but do not claim end-to-end encryption.
- Sources: [Pricing](https://www.hightail.com/pricing), [File Sharing](https://www.hightail.com/file-sharing)

### Hostr

Simple instant-sharing service with free accounts, broad file-type support, desktop apps, and generous public limits for small everyday uploads.

- Max file size: The homepage FAQ currently says the largest file size is 20 MB.
- Retention: The homepage FAQ currently says files are stored as long as the account is active.
- Bandwidth: The homepage FAQ currently says there are no bandwidth limits, aside from possible hotlinking suspension in abuse cases.
- Account: A Hostr account is required; free accounts can upload up to 15 files per day and keep files as long as the account remains active.
- Allowed file types: The homepage currently says all file types are supported, though prohibited or abusive content may still be restricted under the service rules.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The homepage says files are redundantly backed up to Amazon Web Services, but it does not claim end-to-end encryption.
- Sources: [Homepage](https://hostr.co/)

### Jumpshare

Visual file-sharing and screen-recording platform with a free Basic plan, desktop apps, and an iOS app.

- Max file size: Jumpshare's free Basic plan currently lists a 250 MB maximum file size per upload.
- Retention: The cited current public pages for this batch do not state an automatic file expiry period on the free Basic plan.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free Basic account enables uploads, screenshot capture, screen recording, and shareable links.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API or CLI workflow.
- Security: Jumpshare's pricing page mentions secure sharing over SSL, but the cited pages do not claim end-to-end encryption.
- Sources: [Pricing](https://jumpshare.com/pricing), [Apps](https://jumpshare.com/apps), [Free Cloud Storage](https://jumpshare.com/cloud-storage-photos)

### LimeWire

Modern browser-based file sharing platform with end-to-end encrypted transfers, guest uploads, and a free 4 GB upload allowance.

- Max file size: The current upload page states files can be uploaded free up to 4 GB.
- Retention: LimeWire's terms say automatic deletion policies exist for the basic tier, but the current cited public pages do not publish a fixed public retention duration.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Basic features like uploading and sharing files can be used without an account; creating an account enables permanent access and file management.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public developer API or command-line workflow.
- Security: LimeWire publicly markets its file sharing platform as end-to-end encrypted, and its terms state file transfers are encrypted.
- Sources: [Upload Page](https://limewire.com/), [Help Center](https://help.limewire.com/hc/en-us/articles/21895621025309-Create-your-Account), [Terms](https://limewire.com/terms)

### MediaFire

File storage and sharing service with a free ad-supported basic plan and first-party mobile apps.

- Max file size: The Basic plan currently lists a 5 GB per-file limit.
- Retention: The cited public pages do not publish an automatic shelf-life value for the free plan.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Basic account provides storage, sharing, and access to MediaFire's apps.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API.
- Security: MediaFire describes secure storage in marketing copy, but the cited pages do not claim end-to-end encryption.
- Sources: [Upgrade](https://www.mediafire.com/upgrade/?promo=1), [Mobile](https://mediafire.mediafire.com/software/mobile/), [About](https://www.mediafire.com/about/)

### MiMedia

Personal cloud service with a free 10 GB starter tier, desktop and mobile apps, and a media-first sharing experience.

- Max file size: The cited public pages do not publish a current per-file upload cap for the free plan.
- Retention: MiMedia's terms say files may be deleted within 30 days after a subscription ends, and the free tier itself does not list an automatic file-expiry period while active.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A MiMedia account is required for the free Starter tier with desktop, web, and mobile access.
- Allowed file types: MiMedia officially supports common image, video, audio, and document formats including JPG, PNG, MP4, MP3, PDF, DOCX, XLSX, and PPTX.
- Developer support: The cited public pages do not document a public developer API or CLI workflow.
- Security: MiMedia markets privacy and secure storage, but the cited public pages do not claim end-to-end encryption.
- Sources: [Homepage](https://www.mimedia.com/), [Terms of Service](https://mimedia.com/support/article/mimedia-terms-of-service/), [Supported File Types](https://support.mimedia.com/article/what-file-types-are-supported-by-mimedia/)

### MobiDrive

Privacy-first cloud storage from MobiSystems with a free 20 GB tier and official web, Windows, Android, and iOS apps.

- Max file size: The cited current public pages for this batch do not publish a per-file upload limit.
- Retention: The cited public pages do not state an automatic expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A MobiDrive account provides cloud storage, syncing, and integration with MobiOffice and MobiPDF.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API.
- Security: MobiDrive describes a privacy-first approach and says user data is encrypted and not reviewed, but the cited pages do not claim end-to-end encryption.
- Sources: [Homepage](https://www.mobidrive.com/)

### MyAirBridge

Large-file transfer and sharing service with free transfers up to 20 GB and optional online storage features.

- Max file size: MyAirBridge currently states that free individual transfers can be up to 20 GB.
- Retention: For free use, MyAirBridge's FAQ says data is deleted after 3 days, or after 2 days for transfers larger than 2 GB.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Basic sending and downloading do not require registration, though registration and paid plans unlock extra benefits.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: MyAirBridge's FAQ navigation exposes an API section, but the cited accessible pages for this batch do not provide public endpoint documentation.
- Security: MyAirBridge emphasizes encrypted transfers and strong transport security, but the cited pages do not claim end-to-end encryption.
- Sources: [Overview](https://info.myairbridge.com/), [FAQ](https://info.myairbridge.com/cs/faq)

### Oblako Mail.ru

Mail.ru cloud storage service with 8 GB free space, link sharing, mobile apps, a Windows desktop app, and Linux access via WebDAV.

- Max file size: Current official help says the free tier includes 8 GB and allows uploads up to 1 GB per file, with paid plans increasing this to 100 GB.
- Retention: Official help says if you do not use the cloud for 3 months, it is frozen.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Mail account is required; the same account is used for Mail and Cloud, with web access, mobile apps, and desktop features.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- CLI example: `davs://<login>@webdav.cloud.mail.ru:443`
- Developer support: The public help pages do not document a general developer API, but they do document WebDAV access including Linux setup.
- Security: Mail.ru highlights account protection, antivirus scanning, and link controls on current official pages, but it does not claim end-to-end encryption.
- Sources: [What Is Mail Cloud](https://help.mail.ru/cloud_web/about/what/), [Getting Started](https://help.mail.ru/cloud_web/account/), [Upload Files](https://help.mail.ru/cloud_web/files/upload/), [Desktop App](https://help.mail.ru/cloud_web/app/desktop/other/), [WebDAV Access](https://help.mail.ru/cloud_web/app/webdav/), [Security](https://cloud.mail.ru/promo/security/)

### OneDrive

Microsoft's cloud storage service with a 5 GB free tier and official apps across desktop and mobile platforms.

- Max file size: The cited public free-plan pages do not publish a per-file upload cap.
- Retention: The cited public pages do not state an automatic expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Microsoft account unlocks OneDrive storage, backup, sharing, and access across devices.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: Microsoft provides official OneDrive API documentation through Microsoft Learn.
- Security: The cited free-plan pages mention file encryption and ransomware protection, but they do not present OneDrive personal storage as end-to-end encrypted by default.
- Sources: [Free Plan](https://www.microsoft.com/en-us/microsoft-365/onedrive/free-online-cloud-storage), [OneDrive API](https://learn.microsoft.com/en-us/onedrive/developer/rest-api/getting-started/?view=odsp-graph-online)

### OpenDrive

Cloud storage, backup, and sync service with a free personal plan, official apps across major platforms, and a public API.

- Max file size: OpenDrive's free personal plan currently lists a 100 MB max file size.
- Retention: The cited public pages do not state an automatic expiry period for files on the free plan.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free OpenDrive account provides storage, syncing, backup, online tools, notes, and tasks.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: OpenDrive publishes an official HTTP-based API for storage and file operations.
- Security: The cited free-plan pages do not claim end-to-end encryption for the standard free account. Premium-only secure files are described separately.
- Sources: [Pricing](https://www.opendrive.com/pricing), [Apps](https://www.opendrive.com/opendrive-apps), [API](https://www.opendrive.com/api)

### OwnDrive

Hosted personal cloud service with a 1 GB free tier and limited access to built-in apps, positioned as a lightweight Nextcloud-style drive.

- Max file size: The cited public free-plan pages do not publish a per-file upload cap.
- Retention: The cited public free-plan pages do not state an automatic expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free OwnDrive account provides 1 GB of storage with limited access to apps and can be upgraded later.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public developer API or CLI workflow for the hosted free plan.
- Security: The cited public pages describe a trusted hosted environment and in-transit TLS for hosted plans, but they do not claim end-to-end encryption for the free plan.
- Sources: [Free Drive](https://portal.owndrive.com/index.php/order/main/index/freedrive), [Pro Drive](https://portal.owndrive.com/order/main/packages/prodrive/)

### pCloud

Cloud storage service with a free tier, official apps across major desktop and mobile platforms, and a public developer API.

- Max file size: The cited public free-plan pages for this batch do not publish a current per-file upload limit.
- Retention: The cited public pages do not state an automatic expiry period for standard stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A pCloud account provides cloud storage, sharing, and access to desktop/mobile apps.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: pCloud publishes official developer documentation, SDK references, and HTTP/JSON API docs.
- Security: The cited app/download pages describe an optional zero-knowledge encrypted Crypto area rather than default end-to-end encryption for the whole account.
- Sources: [Plan Details](https://help.pcloud.com/article/plan-details), [Downloads](https://www.pcloud.com/download-free-online-cloud-file-storage.html), [Developer Docs](https://docs.pcloud.com/)

### Pixeldrain

Fast file sharing service with expiry-on-inactivity behavior, plus FTPS and rclone support for paid filesystem usage.

- Max file size: The documented 100 GB limit applies to the paid filesystem feature.
- Retention: Files are removed if they are not accessed for 60 days; downloading more than 10% of the file resets the timer.
- Bandwidth: The cited public pages state that anonymous downloads are limited to 5 GB per day.
- Account: Paid accounts unlock the filesystem feature and higher transfer-related capabilities.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- CLI example: `rclone copy ./backup pixeldrain:/me/backup`
- Developer support: Official docs mention a public filesystem API, FTPS access, and rclone support.
- Security: The cited docs do not claim end-to-end encryption.
- Sources: [Questions and Answers](https://pixeldrain.com/about), [Filesystem Guide](https://docs.pixeldrain.com/filesystem/), [API Docs](https://pdx02.pixeldrain.com/api)

### SendSpace

Transfer-oriented file sharing service with a current 300 MB free upload limit and optional recipient delivery without requiring recipient accounts.

- Max file size: The current upload page says the free-user upload limit is temporarily set to 300 MB while new servers are brought online.
- Retention: The cited public upload pages do not publish a clean automatic expiry period for free uploads.
- Bandwidth: The cited public upload pages do not publish a numeric bandwidth cap for free users.
- Account: Files can be uploaded and shared instantly from the public upload page, while paid plans unlock password protection and higher limits.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The cited public pages position SendSpace as secure file transfer, but do not claim end-to-end encryption.
- Sources: [Homepage](https://www.sendspace.com/)

### Sync

Privacy-focused cloud storage service with a 5 GB free tier and end-to-end encrypted apps across desktop and mobile.

- Max file size: The cited current public free-plan pages for this batch do not publish a per-file upload cap.
- Retention: The cited current free-plan pages do not state a default file expiry period for stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free Sync account provides storage, sharing, and apps for Windows, macOS, iOS, Android, and the web.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API.
- Security: Sync describes its cloud storage as end-to-end encrypted and says only the user can access the files.
- Sources: [Free Cloud Storage](https://www.sync.com/free-cloud-storage/), [Cloud Storage](https://www.sync.com/cloud-storage/)

### TempSend

Anonymous file-sharing service with selectable link lifetime, no registration requirement, and command-line-friendly uploads.

- Max file size: TempSend currently lists a 2 GB file size limit.
- Retention: The upload form currently allows links to be valid for one hour, one day, one week, one month, or one year.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Anyone can upload or download without registration.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: TempSend explicitly states JavaScript is not required and that uploads can be done with terminal-based command-line programs.
- Security: TempSend states that files are stored with AES-256 encryption at rest and protected by strong TLS in transit.
- Sources: [Homepage](https://tempsend.com/)

### TeraBox

Consumer cloud storage service that currently markets 1 TB of free storage and apps across Android, iOS, PC, and Mac.

- Max file size: TeraBox's official blog currently states that large file transfers can be up to 20 GB.
- Retention: The cited current public pages for this batch do not state an automatic expiry period for standard stored files.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A TeraBox account provides cloud storage, sync, backup, and cross-device access.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API.
- Security: The cited marketing pages describe secure storage and privacy protection, but they do not claim end-to-end encryption.
- Sources: [Android Download Page](https://www.terabox.com/terabox-cloud-storage-for-apk-free-download), [Official Blog](https://blog.terabox.com/ultimate-solution-for-1tb-free-cloud-storage/)

### Tresorit Send

Free browser-based file transfer service from Tresorit with end-to-end encrypted link sharing.

- Max file size: Tresorit Send currently supports up to 5 GB per upload and 5 GB total at once.
- Retention: Shared links remain available for 7 days before files are automatically deleted from availability.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: You do not need a Tresorit account to use Tresorit Send, though email verification and an admin link are used for link management.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages for this batch do not document a public developer API.
- Security: Tresorit Send is described as using client-side, end-to-end encryption before files leave the device.
- Sources: [What is Tresorit Send](https://support.tresorit.com/hc/en-us/articles/360007285294-What-is-Tresorit-Send), [How it Works](https://support.tresorit.com/hc/en-us/articles/360007285474-How-it-works), [Tresorit Send FAQ](https://support.tresorit.com/hc/en-us/articles/360012183493-Tresorit-Send-FAQ)

### Ulozto

Modern cloud storage service with a free 25 GB plan, official mobile apps, Windows backup tooling, end-to-end encryption claims, and a resumable upload API.

- Max file size: The cited public product pages do not publish a general single-file upload cap for the free plan.
- Retention: The cited public free-plan pages do not state an automatic expiry period for stored files in an active account.
- Bandwidth: The current pricing page lists 150 GB of data transfer per month for the free plan.
- Account: A Ulozto account is required for the free 25 GB cloud plan, app access, sync, and API-based uploads.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- CLI example: `bash sample uploader available from the official resumable upload API page`
- Developer support: Ulozto publishes a resumable upload API and includes official Bash and Python example scripts.
- Security: Ulozto Disk currently markets its cloud plan as end-to-end encrypted and says the service does not know the file contents.
- Sources: [Homepage](https://ulozto.net/), [Plans and Pricing](https://ulozto.net/koupit-disk), [Upload API](https://ulozto.net/upload-resumable-api-beta), [Android App](https://ulozto.net/androidapp), [iOS App](https://ulozto.net/iosapp)

### Upload.ee

Estonian file host with anonymous uploads, broad file-type support, and clear free retention rules for guest and registered users.

- Max file size: The FAQ currently says unregistered users can upload up to 100 MB files, while registered users can upload up to 200 MB.
- Retention: The FAQ and rules currently say anonymous files expire 50 days after last download, while registered users' files expire after 120 days.
- Bandwidth: The upload page says there is no waiting time and references maximum download speed, but the cited pages do not publish a numeric bandwidth cap.
- Account: Anonymous uploads are supported; registered users get larger uploads, longer retention, galleries, and privacy controls.
- Allowed file types: The FAQ currently says Upload.ee supports all known and unknown file formats, but executables like exe, msi, pif, com, and bat can only be uploaded by registered users, and illegal/copyrighted content is forbidden.
- Developer support: The cited public pages show iframe embedding and an old Java upload helper, but they do not document a public developer API or CLI workflow.
- Security: The cited public pages do not claim end-to-end encryption.
- Sources: [Upload Page](https://www.upload.ee/), [FAQ](https://www.upload.ee/faq.html), [Rules](https://www.upload.ee/?page=rules)

### UploadFiles.io

Free file sharing service with no-registration guest uploads, 5 GB max file size, optional expiry controls, and an upgrade path to free managed storage.

- Max file size: The current homepage lists a 5 GB per-file limit for free users.
- Retention: The homepage currently says guest uploads are hosted for a maximum of 30 days, with optional shorter settings like 1 hour, 1 day, 7 days, or 1 download.
- Bandwidth: The homepage markets the service as having no restrictions for sharing and advertises direct downloads up to 1,000 times per day, but it does not publish a clean numeric bandwidth cap.
- Account: Guest uploads work without registration; a free account unlocks management features, 10 GB permanent storage, more simultaneous uploads, passwords, and other controls.
- Allowed file types: The homepage currently says there are no restrictions on file types for uploads, though prohibited content may still be restricted under the service terms.
- Developer support: The cited public pages do not document a public API or CLI workflow.
- Security: The homepage says uploads use SHA-256 SSL in transit and encrypted cloud storage, but these claims do not establish end-to-end encryption.
- Sources: [Homepage](https://ufile.io/)

### UsersDrive

No-account file hosting service with password-protected links, remote URL uploads, and a clearly published max upload size on the public upload form.

- Max file size: The current upload page publicly states a maximum file size of 5250 MB.
- Retention: The cited FAQ says expired files are automatically removed, but the public pages do not publish a fixed retention period.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: Uploads can be started directly from the public form without creating an account, with optional recipient email, folders, and password-protected links.
- Allowed file types: The current FAQ says all kinds of files can be uploaded except pornography, offensive material, and copyrighted material restricted by the service terms.
- Developer support: The cited public pages do not document a public API or CLI upload workflow.
- Security: The service supports password-protected links, but the cited public pages do not claim end-to-end encryption.
- Sources: [Upload Page](https://usersdrive.com/), [FAQ](https://usersdrive.com/faq.html), [Terms of Service](https://usersdrive.com/tos.html)

### WeTransfer

Transfer-focused sharing service whose current free account includes up to 10 transfers or 3 GB over a rolling 30-day period.

- Max file size: WeTransfer's current free plan supports transfers up to 3 GB.
- Retention: Free-account transfers can currently remain active for 1 to 3 days depending on the chosen setting.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A free WeTransfer account provides transfer management, requests, password protection, and mobile app access.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public support pages for this batch do not document a public developer API.
- Security: The cited pages document password-protected transfers, but they do not claim end-to-end encryption.
- Sources: [Free Account Offer](https://help.wetransfer.com/hc/en-us/articles/360036942752-What-does-a-free-WeTransfer-account-offer-me), [New Subscription Plans](https://help.wetransfer.com/hc/en-us/articles/23265597795346-New-WeTransfer-subscription-plans)

### Wormhole

Privacy-focused file sending service with end-to-end encryption and peer-to-peer support for larger transfers.

- Max file size: Files up to 5 GB are stored on Wormhole servers for 24 hours. Larger files use peer-to-peer transfer while the sender keeps the page open.
- Retention: Server-stored files are permanently deleted after 24 hours.
- Bandwidth: The cited public pages do not publish a numeric bandwidth cap for transfers.
- Account: The cited FAQ focuses on the transfer flow and does not describe account requirements.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited FAQ does not document an official public API or CLI flow.
- Security: FAQ states Wormhole uses end-to-end encryption and encrypts files before they leave the browser.
- Sources: [FAQ](https://wormhole.app/faq), [Legal](https://wormhole.app/legal)

### Yandex Disk

Cloud storage service with a 5 GB base tier, official desktop and mobile apps, and a Linux console client.

- Max file size: Without an active Yandex 360 plan, the maximum size of a single uploaded file is currently 1 GB.
- Retention: The cited public pages do not state an automatic expiry for files stored within a normal Yandex Disk account.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: A Yandex account is required to use Yandex Disk storage, sharing, desktop sync, and mobile apps.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited current public pages describe official apps and a Linux console client, but they do not document a public developer API.
- Security: The cited help pages do not claim end-to-end encryption for standard Yandex Disk storage.
- Sources: [Storage Space Help](https://yandex.com/support/yandex-360/customers/disk/web/en/enlarge/disk-space), [Desktop Help](https://yandex.com/support/yandex-360/customers/disk/web/en/desktop), [Mobile Help](https://yandex.com/support/yandex-360/customers/disk/web/en/disk-app), [Upload Help](https://yandex.com/support/yandex-360/customers/disk/web/en/uploading)

### Your File Store

Simple no-account file upload service with private download links, optional password protection, and long-lived files that stay active with periodic access.

- Max file size: The current official upload page and FAQ both state files can be up to 500 MB in size.
- Retention: Files remain available indefinitely as long as they are accessed at least once every 60 days.
- Bandwidth: The cited public pages do not publish a current bandwidth limit.
- Account: No membership or signup is required to upload and share files.
- Allowed file types: The cited public pages do not clearly publish a complete allowed-file-types policy; prohibited content may still apply under the service terms.
- Developer support: The cited public pages do not document a public API or command-line upload workflow.
- Security: The service uses private download links and optional password protection, but the cited public pages do not claim end-to-end encryption.
- Sources: [Upload Page](https://yourfilestore.com/), [FAQ](https://yourfilestore.com/faq.html), [About](https://yourfilestore.com/about.html)

## Data model

- Dataset: [`data/hosts.json`](data/hosts.json)
- Candidate backlog: [`data/candidates.json`](data/candidates.json)
- Schema: [`schema/hosts.schema.json`](schema/hosts.schema.json)
- Candidate schema: [`schema/candidates.schema.json`](schema/candidates.schema.json)
- Generator: [`scripts/generate-readme.js`](scripts/generate-readme.js)

## Usage

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
