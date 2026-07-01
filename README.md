# Noctis

Route your browser through proxy servers you control, with a local multi-core helper.

Noctis has two open parts, both in this repository:

- **`host/`** — the native helper (`noctis-host`), a small Go binary the browser launches over Chrome's Native Messaging channel. It supervises the active proxy engine (sing-box, xray, or mihomo), ships logs and status back to the extension, and rewrites the engine config on demand. MIT-licensed.
- **`site/`** — the marketing + docs site (Vite static build), served at <https://noctis.c0nn3ct.info>.

The browser extension itself is distributed on the Chrome Web Store:
<https://chromewebstore.google.com/detail/noctis/nmhobajopepdpihahepaddpdifdcenpn>

## Install

See the install guide at <https://noctis.c0nn3ct.info/install/> — a one-line command per OS installs the helper and the proxy cores.

## This repository

This is a public snapshot, synced from the private Noctis development repo. `host/` and `site/` are published here independently; the helper's binary releases are attached to this repo's [Releases](https://github.com/c0nn3ct-info/noctis/releases). Issues and pull requests are welcome.

## License

The native helper (`host/`) is MIT-licensed — see [`host/LICENSE`](./host/LICENSE). The bundled proxy cores are redistributed under their upstream licenses. The site content is covered by its own terms — see [`site/LICENSE.md`](./site/LICENSE.md).
