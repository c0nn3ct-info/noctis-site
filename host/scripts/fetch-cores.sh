#!/usr/bin/env bash
# Download proxy-core binaries into embed/ (relative to this module).
#
# Usage: fetch-cores.sh [sing-box|xray|mihomo|all]   (default: all)
#
# Version pins (override via env):
#   SINGBOX_VERSION (default 1.13.13)
#   XRAY_VERSION    (default: latest release tag from GitHub)
#   MIHOMO_VERSION  (default: latest release tag from GitHub)
set -euo pipefail

WHICH="${1:-all}"
MODULE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$MODULE_ROOT/embed"
mkdir -p "$OUT_DIR"

OS_RAW="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH_RAW="$(uname -m)"
case "$OS_RAW" in
  darwin) OS="darwin" ;;
  linux)  OS="linux" ;;
  *) echo "unsupported OS: $OS_RAW" >&2; exit 1 ;;
esac
case "$ARCH_RAW" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="amd64" ;;
  *) echo "unsupported arch: $ARCH_RAW" >&2; exit 1 ;;
esac

latest_tag() { # repo -> tag (e.g. v1.2.3)
  curl -fsSL "https://api.github.com/repos/$1/releases/latest" \
    | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/'
}

strip_quarantine() { xattr -d com.apple.quarantine "$1" 2>/dev/null || true; }

fetch_singbox() {
  local v="${SINGBOX_VERSION:-1.13.13}"
  local name="sing-box-${v}-${OS}-${ARCH}"
  local url="https://github.com/SagerNet/sing-box/releases/download/v${v}/${name}.tar.gz"
  local tmp; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' RETURN
  echo "sing-box: $url"
  curl -fL "$url" -o "$tmp/sb.tar.gz"
  tar -xzf "$tmp/sb.tar.gz" -C "$tmp"
  cp "$tmp/$name/sing-box" "$OUT_DIR/sing-box"
  chmod +x "$OUT_DIR/sing-box"; strip_quarantine "$OUT_DIR/sing-box"
  "$OUT_DIR/sing-box" version | head -1
}

fetch_xray() {
  local v="${XRAY_VERSION:-$(latest_tag XTLS/Xray-core)}"
  # xray asset naming: macos|linux|windows, 64 | arm64-v8a
  local xos xarch
  case "$OS" in darwin) xos="macos" ;; linux) xos="linux" ;; esac
  case "$ARCH" in amd64) xarch="64" ;; arm64) xarch="arm64-v8a" ;; esac
  local name="Xray-${xos}-${xarch}"
  local url="https://github.com/XTLS/Xray-core/releases/download/${v}/${name}.zip"
  local tmp; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' RETURN
  echo "xray ${v}: $url"
  curl -fL "$url" -o "$tmp/xray.zip"
  unzip -oq "$tmp/xray.zip" -d "$tmp/xray"
  cp "$tmp/xray/xray" "$OUT_DIR/xray"
  chmod +x "$OUT_DIR/xray"; strip_quarantine "$OUT_DIR/xray"
  # Geo assets (only needed for geosite:/geoip: routing rules). xray reads these
  # from beside its binary or $XRAY_LOCATION_ASSET.
  curl -fsSL -o "$OUT_DIR/geoip.dat" \
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geoip.dat
  curl -fsSL -o "$OUT_DIR/geosite.dat" \
    https://github.com/Loyalsoldier/v2ray-rules-dat/releases/latest/download/geosite.dat
  "$OUT_DIR/xray" version | head -1
}

fetch_mihomo() {
  local v="${MIHOMO_VERSION:-$(latest_tag MetaCubeX/mihomo)}"
  # mihomo asset naming: mihomo-<os>-<arch>-<vTag>.gz  (single gzipped binary)
  local name="mihomo-${OS}-${ARCH}-${v}"
  local url="https://github.com/MetaCubeX/mihomo/releases/download/${v}/${name}.gz"
  local tmp; tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' RETURN
  echo "mihomo ${v}: $url"
  curl -fL "$url" -o "$tmp/mihomo.gz"
  gunzip -c "$tmp/mihomo.gz" > "$OUT_DIR/mihomo"
  chmod +x "$OUT_DIR/mihomo"; strip_quarantine "$OUT_DIR/mihomo"
  "$OUT_DIR/mihomo" -v | head -1
}

case "$WHICH" in
  sing-box) fetch_singbox ;;
  xray)     fetch_xray ;;
  mihomo)   fetch_mihomo ;;
  all)      fetch_singbox; fetch_xray; fetch_mihomo ;;
  *) echo "unknown core: $WHICH (use sing-box|xray|mihomo|all)" >&2; exit 1 ;;
esac

echo "done -> $OUT_DIR"
