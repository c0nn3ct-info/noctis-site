#!/usr/bin/env bash
# Download a pinned sing-box release into embed/sing-box (relative to this module).
set -euo pipefail

VERSION="${SINGBOX_VERSION:-1.13.13}"
MODULE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$MODULE_ROOT/embed"
OUT="$OUT_DIR/sing-box"

OS_RAW="$(uname -s | tr '[:upper:]' '[:lower:]')"
case "$OS_RAW" in
  darwin) OS="darwin" ;;
  linux)  OS="linux" ;;
  *) echo "unsupported OS: $OS_RAW" >&2; exit 1 ;;
esac

ARCH_RAW="$(uname -m)"
case "$ARCH_RAW" in
  arm64|aarch64) ARCH="arm64" ;;
  x86_64|amd64)  ARCH="amd64" ;;
  *) echo "unsupported arch: $ARCH_RAW" >&2; exit 1 ;;
esac

NAME="sing-box-${VERSION}-${OS}-${ARCH}"
URL="https://github.com/SagerNet/sing-box/releases/download/v${VERSION}/${NAME}.tar.gz"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "downloading $URL"
curl -fL "$URL" -o "$TMP/sb.tar.gz"
tar -xzf "$TMP/sb.tar.gz" -C "$TMP"

mkdir -p "$OUT_DIR"
cp "$TMP/$NAME/sing-box" "$OUT"
chmod +x "$OUT"
xattr -d com.apple.quarantine "$OUT" 2>/dev/null || true

echo "installed sing-box ${VERSION} at $OUT"
"$OUT" version | head -1
