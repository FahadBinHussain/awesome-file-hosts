# Baidu Pan findings

Date: 2026-04-28

## Official pages used

- App Store listing: https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98/id547166701
- iPad listing: https://apps.apple.com/us/app/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98-hd/id554602005
- Feature page: https://yun.baidu.com/disk/dilatation
- PCS open platform: https://openapi.baidu.com/ms/pcs

## Findings

### Consumer product

The current first-party surfaces still support Baidu Pan as a large consumer cloud-storage product focused on:

- multi-device backup
- file sharing
- online handling of files
- paid expansion up to 16 TB

The App Store text also says shared links can be created without file-size limits and can be encrypted or given an expiry. That helps with feature notes, but it still does not expose a clean free-tier upload cap.

### Developer surface

The strongest new finding is that Baidu still publishes an official PCS open-platform page for personal cloud storage.

That page explicitly advertises:

- file APIs
- structured-data APIs
- OAuth access
- SDK downloads
- multi-device sync and file sharing

That is enough to mark `api_available: true` and attach an official API URL.

### Limits that still remain unclear

The official pages I checked still do **not** cleanly expose:

- a default free storage quota
- a clean free-tier upload cap
- a numeric free bandwidth cap

So those fields should remain conservative.
