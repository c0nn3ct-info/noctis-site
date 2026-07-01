# noctis-site

Marketing and documentation site for [Noctis](https://noctis.c0nn3ct.info), the VLESS browser extension — a static Vite + React build, prerendered to HTML and deployed to GitHub Pages at <https://noctis.c0nn3ct.info>.

This is the site source, published under `site/` in the public [c0nn3ct-info/noctis](https://github.com/c0nn3ct-info/noctis) repo — a snapshot synced from the private Noctis development repo. The full project overview (features, install, FAQ) is in the [repo README](../README.md).

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # prerenders to dist/ (static HTML + sitemaps)
```

## Layout

- `src/` — React pages, components, and i18n (6 locales: en, ru, es, zh-CN, fa, ar).
- `public/` — helper install scripts (`macos.sh`, `linux.sh`, `windows.ps1`), pinned core versions (`cores.env`), and the Pages `CNAME`.
- `scripts/prerender.mjs` — Puppeteer prerender + sitemap generation.
- `PRIVACY.md`, `LICENSE.md` — legal text, also served at `/privacy/` and `/license/`.

## License

Site content is under a proprietary EULA — see [`LICENSE.md`](./LICENSE.md). The Noctis native helper is MIT-licensed — see [`../host`](../host).
