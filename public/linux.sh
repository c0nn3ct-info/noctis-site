#!/usr/bin/env bash
# Noctis helper installer for Linux.
# Usage:  curl -fsSL https://noctis.c0nn3ct.xyz/linux.sh | bash -s -- <chrome-extension-id>
set -euo pipefail

EXT_ID="${1:-}"
if [[ -z "$EXT_ID" ]]; then
  echo "Usage: bash linux.sh <extension-id>" >&2
  exit 1
fi
if [[ ! "$EXT_ID" =~ ^[a-p]{32}$ ]]; then
  echo "Invalid extension id: $EXT_ID (expected 32 chars a-p)" >&2
  exit 1
fi

REPO="c0nn3ct-xyz/noctis-host"

uname_m="$(uname -m)"
case "$uname_m" in
  x86_64|amd64)  ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported Linux arch: $uname_m" >&2; exit 1 ;;
esac

TAG="$(curl -fsSLI -o /dev/null -w '%{url_effective}\n' \
  "https://github.com/$REPO/releases/latest" | sed 's|.*/tag/||')"
if [[ -z "$TAG" || "$TAG" == *"/releases/latest"* ]]; then
  echo "Failed to resolve latest noctis-host release tag." >&2
  exit 1
fi

INSTALL_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/noctis"
mkdir -p "$INSTALL_DIR"
HOST_BIN="$INSTALL_DIR/noctis-host"
SINGBOX_BIN="$INSTALL_DIR/sing-box"

ARCHIVE="noctis-host-${TAG}-linux-${ARCH}.tar.gz"
URL="https://github.com/$REPO/releases/download/$TAG/$ARCHIVE"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "→ downloading $ARCHIVE"
curl -fL --progress-bar "$URL" -o "$TMP/$ARCHIVE"
tar -xzf "$TMP/$ARCHIVE" -C "$TMP"

SRC_DIR="$TMP/noctis-host-${TAG}-linux-${ARCH}"
install -m 0755 "$SRC_DIR/noctis-host" "$HOST_BIN"
install -m 0755 "$SRC_DIR/sing-box"   "$SINGBOX_BIN"

NM_NAME="com.noctis.host"
CONFIG_BASE="${XDG_CONFIG_HOME:-$HOME/.config}"
TARGETS=(
  "$CONFIG_BASE/google-chrome/NativeMessagingHosts"
  "$CONFIG_BASE/google-chrome-beta/NativeMessagingHosts"
  "$CONFIG_BASE/google-chrome-unstable/NativeMessagingHosts"
  "$CONFIG_BASE/chromium/NativeMessagingHosts"
  "$CONFIG_BASE/BraveSoftware/Brave-Browser/NativeMessagingHosts"
  "$CONFIG_BASE/microsoft-edge/NativeMessagingHosts"
  "$CONFIG_BASE/vivaldi/NativeMessagingHosts"
  "$CONFIG_BASE/opera/NativeMessagingHosts"
  "$CONFIG_BASE/yandex-browser/NativeMessagingHosts"
)

# Merge ids into allowed_origins instead of overwriting: each browser/profile has
# its own extension id, so running this from a second browser must not evict the
# first. Union of (ids already in the file) + the passed EXT_ID, deduped.
build_origins() {                       # $1 = manifest path
  { [[ -f "$1" ]] && grep -oE 'chrome-extension://[a-p]{32}/' "$1"
    echo "chrome-extension://$EXT_ID/"; } | sort -u \
  | awk 'NR>1{printf ",\n    "} {printf "\"%s\"", $0}'
}

written=0
for dir in "${TARGETS[@]}"; do
  parent="$(dirname "$dir")"
  [[ -d "$parent" ]] || continue
  mkdir -p "$dir"
  manifest="$dir/$NM_NAME.json"
  origins="$(build_origins "$manifest")"
  cat > "$manifest" <<JSON
{
  "name": "$NM_NAME",
  "description": "Noctis native helper",
  "path": "$HOST_BIN",
  "type": "stdio",
  "allowed_origins": [
    $origins
  ]
}
JSON
  echo "  wrote $manifest"
  written=$((written + 1))
done

if (( written == 0 )); then
  echo "No supported browser data dirs found." >&2
  exit 1
fi

echo
echo "Done. Installed for $written browser(s)."
echo "Helper:  $HOST_BIN"
echo "Reload Noctis on chrome://extensions to pick up the helper."
