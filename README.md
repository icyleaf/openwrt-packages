# icyleaf's Openwrt package feed.


## Usage

To enable this feed add the following line to your feeds.conf:

```bash
src-git icyleaf https://github.com/icyleaf/openwrt-packages.git
```

To install all its package definitions, run:

```
./scripts/feeds update icyleaf
./scripts/feeds install -a -p icyleaf
```
