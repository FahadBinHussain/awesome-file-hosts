# Findings Batch 13

Date: 2026-04-29

Updated hosts:

## Jumpshare
- retention -> `12 months`
- storage -> `2 GB`
- basis:
  - official inactivity help says Basic-user files are deleted after 12 months of inactivity
  - official lost-content help references the free plan's `2 GB` storage limit

Sources:
- https://support.jumpshare.com/article/210-how-long-will-my-files-stay-online-if-im-inactive
- https://support.jumpshare.com/article/202-i-cannot-find-posted-content-i-have-lost-my-content

## MediaFire
- retention notes now support `No automatic expiry`
- basis:
  - official retention policy says content not in Trash is retained indefinitely for free registered accounts that are not abandoned
  - free registered accounts are not considered abandoned if accessed at least once every 8 months
  - free-account Trash retention is 30 days

Sources:
- https://www.mediafire.com/policies/data_retention.php

## MobiDrive
- retention notes now support `No automatic expiry`
- basis:
  - official support says synced files live between folder and cloud
  - deleting from the sync folder moves files to Bin where they remain accessible online
  - permanent removal happens only after Delete Forever from Bin

Sources:
- https://support.mobisystems.com/hc/en-us/articles/9750437496093-Delete-files-from-MobiDrive-folder-on-Windows
- https://support.mobisystems.com/hc/en-us/articles/9750457864093-Delete-files-permanently-and-free-up-storage-space-in-MobiDrive-on-Windows
- https://support.mobisystems.com/hc/en-us/articles/9750562801437-Have-my-files-been-synced-in-MobiDrive

## Yandex Disk
- retention notes now support `No automatic expiry`
- bandwidth -> `10 GB/month`
- basis:
  - official security help says files are stored until deleted if there are no access issues
  - same help documents 30 days of Trash recovery plus long-term edge-case deletions
  - official storage help says monthly uploads are capped at twice plan storage, so a `5 GB` base plan yields `10 GB/month` uploads

Sources:
- https://yandex.com/support/yandex-360/customers/disk/web/en/security
- https://yandex.com/support/yandex-360/customers/disk/web/en/enlarge/disk-space
