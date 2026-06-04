# Privacy Policy

_Last updated: 2026-05-15_

Noctis is built to do one thing — route your browser's traffic through proxy servers you have configured. This policy explains exactly what data the Software touches, what it does with that data, and what it deliberately does not do. It applies to the Noctis browser extension and its native helper (`noctis-host`).

The authoritative, always-current version of this document is published at <https://noctis.c0nn3ct.xyz/privacy/>.

## 1. What Noctis stores

The extension stores the following inside your browser's local extension storage (`chrome.storage.local`):

- The list of proxy servers you have added.
- Routing profiles and rules.
- Subscription URLs and refresh schedules.
- UI preferences (theme, side panel pin, log verbosity, and similar).

The native helper (`noctis-host`) writes a sing-box configuration file under your operating-system user-data directory. This file mirrors the same servers and rules.

## 2. What Noctis sends over the network

The only network traffic Noctis itself generates is:

1. **Proxied traffic** — your browser's requests, routed through the proxy servers you configured. Noctis does not pick destinations; you do.
2. **Subscription refreshes** — if you add a subscription URL, Noctis periodically fetches that URL to update the server list it represents. No subscription URL is added unless you add it.
3. **IP check** — only while connected, an on-demand request to `api.ipify.org` that travels through your active proxy so the popup can show your visible exit IP. It confirms the proxy is working; it does not run when you are disconnected, and it never reveals your real IP to that service.

That is all. Noctis has no analytics SDK, no crash reporter, no remote configuration endpoint, no opt-in or opt-out telemetry, and no account system.

## 3. What Noctis does not do

- It does not send your browsing history, server list, settings, or any identifier to the developer. The only third-party request it makes is the optional IP check above, which rides your active proxy and exposes your exit IP — never your real one.
- It does not embed third-party trackers or fingerprinting libraries.
- It does not require a sign-up or login.
- It does not write to disk outside the helper's user-data directory (the sing-box configuration and logs, which you can read yourself).

## 4. Permissions Noctis requests, and why

| Permission | What it's for |
| --- | --- |
| `proxy` | Tell Chrome to use sing-box's local SOCKS listener when a routing profile is active. |
| `storage` | Persist your servers, rules, and settings inside the browser. |
| `nativeMessaging` | The only channel by which the extension talks to the local helper. |
| `privacy` | Required by the Chrome proxy API surface for proxy-setting scope. |
| `alarms` | Run periodic health checks and refresh subscriptions on a schedule. |
| `tabs` | Side panel and per-tab status context. |
| `declarativeNetRequestWithHostAccess` | Block ad/tracker domains per active routing profile. |
| `host_permissions: <all_urls>` | Routing rules match arbitrary destinations; per-URL proxy decisions require visibility into the URL. |

## 5. Children's privacy

Noctis is not designed for or directed at children under 13, and it collects no information from anyone.

## 6. Contact

For privacy questions, write to <help@c0nn3ct.xyz>.

## 7. Changes to this policy

Material changes will be published here with a new "Last updated" date, and the Chrome Web Store listing will be updated to match.
