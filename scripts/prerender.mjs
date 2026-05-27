#!/usr/bin/env node
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import handler from 'serve-handler';
import puppeteer from 'puppeteer';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const distDir = resolve(root, 'dist');
const require = createRequire(import.meta.url);
const pkg = require(resolve(root, 'package.json'));

const ORIGIN = 'https://noctis.c0nn3ct.xyz';

const PAGE_PATH = {
  home: '/',
  install: '/install/',
  privacy: '/privacy/',
  license: '/license/',
};

const PRIORITY = { home: '1.0', install: '0.8', privacy: '0.5', license: '0.5' };

const EN = JSON.parse(await readFile(resolve(root, 'src/i18n/en.json'), 'utf8'));
const RU = JSON.parse(await readFile(resolve(root, 'src/i18n/ru.json'), 'utf8'));
const DICT = { en: EN, ru: RU };

function pathFor(page, locale) {
  const base = PAGE_PATH[page];
  if (locale === 'en') return base;
  if (base === '/') return '/ru/';
  return `/ru${base}`;
}

function diskPath(page, locale) {
  const p = pathFor(page, locale);
  if (p === '/') return resolve(distDir, 'index.html');
  if (p === '/ru/') return resolve(distDir, 'ru/index.html');
  return resolve(distDir, p.replace(/^\//, '').replace(/\/$/, ''), 'index.html');
}

function getMeta(page, locale) {
  const dict = DICT[locale];
  const path = pathFor(page, locale);
  const url = `${ORIGIN}${path}`;
  return {
    title: dict[`${page}.title`] ?? 'Noctis',
    description: dict[`${page}.description`] ?? '',
    canonical: url,
    hreflang: [
      { lang: 'en', href: `${ORIGIN}${pathFor(page, 'en')}` },
      { lang: 'ru', href: `${ORIGIN}${pathFor(page, 'ru')}` },
      { lang: 'x-default', href: `${ORIGIN}${pathFor(page, 'en')}` },
    ],
    og: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ru_RU',
      localeAlternate: locale === 'en' ? 'ru_RU' : 'en_US',
      image: `${ORIGIN}/og-cover.png`,
      url,
      siteName: 'Noctis',
    },
    twitter: {
      card: 'summary_large_image',
      image: `${ORIGIN}/og-cover.png`,
    },
  };
}

function jsonLdBlocks(page, locale, version) {
  const dict = DICT[locale];
  const url = `${ORIGIN}${pathFor(page, locale)}`;
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'c0nn3ct.xyz',
    url: 'https://c0nn3ct.xyz',
    logo: `${ORIGIN}/favicon.svg`,
    sameAs: ['https://github.com/c0nn3ct-xyz/noctis-host'],
  };
  const blocks = [organization];

  if (page === 'home') {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Noctis',
      applicationCategory: 'BrowserApplication',
      applicationSubCategory: 'Proxy',
      operatingSystem: 'Windows, macOS, Linux',
      description: dict['home.description'],
      url,
      inLanguage: ['en', 'ru'],
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: organization,
      softwareVersion: version,
      featureList: [
        'VLESS',
        'VLESS Reality',
        'VMess',
        'Trojan',
        'Shadowsocks',
        'Hysteria2',
        'TUIC',
        'WireGuard',
        'AnyTLS',
        'ShadowTLS',
      ],
    });

    const faqKeys = [
      'what',
      'vpn',
      'reality',
      'protocols',
      'safe',
      'platforms',
      'subscription',
      'bypass',
      'webrtc',
      'cost',
    ];
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqKeys.map((k) => ({
        '@type': 'Question',
        name: dict[`home.faq.${k}.q`],
        acceptedAnswer: { '@type': 'Answer', text: dict[`home.faq.${k}.a`] },
      })),
    });
  } else {
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Noctis',
          item: `${ORIGIN}${pathFor('home', locale)}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: dict[`${page}.h1`] ?? page,
          item: url,
        },
      ],
    });
  }

  return blocks;
}

function escapeHtmlAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtmlText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildHeadInjection(page, locale, version) {
  const meta = getMeta(page, locale);
  const blocks = jsonLdBlocks(page, locale, version);
  const lines = [];
  lines.push(`<link rel="canonical" href="${escapeHtmlAttr(meta.canonical)}" />`);
  for (const h of meta.hreflang) {
    lines.push(
      `<link rel="alternate" hreflang="${h.lang}" href="${escapeHtmlAttr(h.href)}" />`,
    );
  }
  lines.push(`<meta property="og:type" content="${meta.og.type}" />`);
  lines.push(`<meta property="og:site_name" content="${escapeHtmlAttr(meta.og.siteName)}" />`);
  lines.push(`<meta property="og:locale" content="${meta.og.locale}" />`);
  lines.push(
    `<meta property="og:locale:alternate" content="${meta.og.localeAlternate}" />`,
  );
  lines.push(`<meta property="og:url" content="${escapeHtmlAttr(meta.og.url)}" />`);
  lines.push(`<meta property="og:title" content="${escapeHtmlAttr(meta.title)}" />`);
  lines.push(
    `<meta property="og:description" content="${escapeHtmlAttr(meta.description)}" />`,
  );
  lines.push(`<meta property="og:image" content="${escapeHtmlAttr(meta.og.image)}" />`);
  lines.push(`<meta property="og:image:width" content="1200" />`);
  lines.push(`<meta property="og:image:height" content="630" />`);
  lines.push(`<meta name="twitter:card" content="${meta.twitter.card}" />`);
  lines.push(`<meta name="twitter:title" content="${escapeHtmlAttr(meta.title)}" />`);
  lines.push(
    `<meta name="twitter:description" content="${escapeHtmlAttr(meta.description)}" />`,
  );
  lines.push(`<meta name="twitter:image" content="${escapeHtmlAttr(meta.twitter.image)}" />`);
  for (const b of blocks) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(b)}</script>`,
    );
  }
  return lines.join('\n    ');
}

function injectIntoHead(html, injection, newTitle, newDescription) {
  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtmlText(newTitle)}</title>`);
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtmlAttr(newDescription)}" />`,
  );
  out = out.replace('</head>', `    ${injection}\n  </head>`);
  return out;
}

function startServer(port) {
  const server = createServer((req, res) => handler(req, res, { public: distDir }));
  return new Promise((resolveP) => server.listen(port, () => resolveP(server)));
}

async function generateOgCover(browser) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    html,body{margin:0;padding:0;width:1200px;height:630px;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a2e 50%,#16213e 100%);font-family:-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif;color:#fff;overflow:hidden;}
    .wrap{display:flex;flex-direction:column;justify-content:center;height:100%;padding:80px;box-sizing:border-box;}
    .badge{display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:999px;font-size:18px;letter-spacing:.04em;width:fit-content;color:#a78bfa;}
    .dot{width:8px;height:8px;border-radius:50%;background:#a78bfa;}
    h1{font-size:88px;font-weight:700;letter-spacing:-.02em;line-height:1.04;margin:32px 0 24px;}
    .accent{background:linear-gradient(90deg,#a78bfa 0%,#60a5fa 100%);-webkit-background-clip:text;background-clip:text;color:transparent;}
    p{font-size:30px;color:#9ca3af;line-height:1.3;margin:0;max-width:900px;}
    .protos{display:flex;flex-wrap:wrap;gap:10px;margin-top:auto;}
    .proto{padding:8px 18px;border:1px solid rgba(255,255,255,.18);border-radius:8px;font-size:20px;font-family:'JetBrains Mono','SF Mono',monospace;color:#e5e7eb;}
  </style></head><body><div class="wrap">
    <div class="badge"><span class="dot"></span>Noctis · VLESS Browser Extension</div>
    <h1>Browser proxy<br/><span class="accent">VLESS, VMess, Trojan, Reality</span></h1>
    <p>Free Chrome extension. Routes browser traffic through your own proxies via sing-box.</p>
    <div class="protos">
      <span class="proto">VLESS</span><span class="proto">Reality</span><span class="proto">VMess</span><span class="proto">Trojan</span><span class="proto">Shadowsocks</span><span class="proto">Hysteria2</span><span class="proto">TUIC</span><span class="proto">WireGuard</span>
    </div>
  </div></body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  const png = await page.screenshot({ type: 'png', omitBackground: false });
  await writeFile(resolve(distDir, 'og-cover.png'), png);
  await page.close();
}

function buildSitemap(lastmod) {
  const pages = ['home', 'install', 'privacy', 'license'];
  const locales = ['en', 'ru'];
  const urls = [];
  for (const page of pages) {
    for (const locale of locales) {
      const url = `${ORIGIN}${pathFor(page, locale)}`;
      const alts = locales
        .map(
          (l) =>
            `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathFor(page, l)}" />`,
        )
        .join('\n');
      urls.push(
        `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${PRIORITY[page]}</priority>
${alts}
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(page, 'en')}" />
  </url>`,
      );
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;
}

function findSystemChrome() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidates =
    process.platform === 'darwin'
      ? [
          '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
          '/Applications/Chromium.app/Contents/MacOS/Chromium',
          '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
        ]
      : process.platform === 'linux'
        ? ['/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser']
        : ['C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'];
  return candidates.find((p) => {
    try {
      return statSync(p).isFile();
    } catch {
      return false;
    }
  });
}

async function main() {
  const port = 4321 + Math.floor(Math.random() * 1000);
  const server = await startServer(port);
  const executablePath = findSystemChrome();
  const launchOpts = { headless: true };
  if (executablePath) {
    launchOpts.executablePath = executablePath;
    console.log(`using system Chrome: ${executablePath}`);
  }
  const browser = await puppeteer.launch(launchOpts);

  try {
    const pages = ['home', 'install', 'privacy', 'license'];
    const locales = ['en', 'ru'];

    for (const page of pages) {
      for (const locale of locales) {
        const url = `http://localhost:${port}${pathFor(page, locale)}`;
        const target = diskPath(page, locale);
        const p = await browser.newPage();
        await p.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await p.waitForFunction(
          () => {
            const r = document.getElementById('root');
            return r && r.children.length > 0;
          },
          { timeout: 10000 },
        );
        const html = await p.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML);
        await p.close();

        const injection = buildHeadInjection(page, locale, pkg.version);
        const meta = getMeta(page, locale);
        const final = injectIntoHead(html, injection, meta.title, meta.description);
        await writeFile(target, final, 'utf8');
        console.log(`✓ prerendered ${pathFor(page, locale)} → ${target.replace(distDir, '')}`);
      }
    }

    await generateOgCover(browser);
    console.log('✓ generated og-cover.png');

    const lastmod = new Date().toISOString().slice(0, 10);
    await writeFile(resolve(distDir, 'sitemap.xml'), buildSitemap(lastmod), 'utf8');
    console.log(`✓ wrote sitemap.xml (lastmod=${lastmod})`);
  } finally {
    await browser.close();
    server.close();
  }
}

await main();
