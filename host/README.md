# noctis-host

Native messaging helper for the [Noctis](https://noctis.c0nn3ct.info) browser extension. Supervises a local proxy-core process — [sing-box](https://github.com/SagerNet/sing-box), [xray-core](https://github.com/XTLS/Xray-core), or [mihomo](https://github.com/MetaCubeX/mihomo) — and ships logs and events back to the extension over Chrome's native-messaging channel.

This is the native helper source, published under `host/` in the public [c0nn3ct-info/noctis](https://github.com/c0nn3ct-info/noctis) repo — a snapshot synced from the private Noctis development repo. Issues and pull requests welcome on the public repo.

## What it does

- Reads native-messaging frames from `stdin`, writes them to `stdout`.
- Generates a proxy-core config file from the extension's server list + routing profile (sing-box/xray JSON or mihomo YAML).
- Spawns and supervises the active proxy core, restarts it on crash, streams its `stdout`/`stderr` back to the extension.
- Periodic health checks on the active proxy.

The helper is the only component that touches your filesystem and OS. The extension itself runs only inside the browser.

## Build

```bash
go build -o noctis-host .
```

You need Go 1.21 or newer. To download proxy cores for embedding, see `embed/` and the `fetch-cores.sh` script in the Noctis repo — it fetches sing-box, xray and mihomo (or download a release manually and place it on `PATH`).

## Install

Per-OS installer scripts live in `install/`. They:

1. Copy `noctis-host` and the proxy cores (sing-box, xray, mihomo) into a per-user data directory.
2. Write a `com.noctis.host.json` native-messaging manifest into every supported browser's profile folder.

```bash
# macOS
install/install-macos.sh <extension-id>
```

Linux and Windows installers are placeholders — contributions welcome.

## Protocol

The helper speaks the [Chrome native-messaging protocol](https://developer.chrome.com/docs/extensions/develop/concepts/native-messaging): little-endian uint32 length prefix followed by a UTF-8 JSON payload. Message schema is defined by the extension; see `ipc.go` for the dispatch surface.

## License

MIT — see [`LICENSE`](./LICENSE). The proxy cores — [sing-box](https://github.com/SagerNet/sing-box) (GPL-3.0), [xray-core](https://github.com/XTLS/Xray-core) (MPL-2.0) and [mihomo](https://github.com/MetaCubeX/mihomo) (GPL-3.0) — are redistributed under their upstream licenses.
