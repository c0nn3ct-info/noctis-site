# Noctis helper installer for Windows.
# Usage:
#   $env:NOCTIS_EXT_ID='<extension-id>'; iwr -useb https://noctis.c0nn3ct.xyz/windows.ps1 | iex
# Or, if you have the script saved locally:
#   .\windows.ps1 -ExtensionId <extension-id>

[CmdletBinding()]
param(
  [string]$ExtensionId = $env:NOCTIS_EXT_ID
)

$ErrorActionPreference = 'Stop'

if (-not $ExtensionId) {
  Write-Error 'Pass the extension ID via $env:NOCTIS_EXT_ID or -ExtensionId.'
  exit 1
}

$repo = 'c0nn3ct-xyz/noctis-host'

$arch = switch -Wildcard ((Get-CimInstance Win32_Processor).Architecture) {
  9 { 'amd64' }                # x64
  12 { 'arm64' }
  default { 'amd64' }
}

$latest = Invoke-WebRequest -UseBasicParsing -MaximumRedirection 5 -Uri "https://github.com/$repo/releases/latest"
$tag = ($latest.BaseResponse.ResponseUri.AbsolutePath -replace '.*/tag/','').Trim('/')
if (-not $tag -or $tag -match 'releases/latest') {
  Write-Error 'Failed to resolve latest noctis-host release tag.'
  exit 1
}

$installDir = Join-Path $env:LOCALAPPDATA 'Noctis'
New-Item -ItemType Directory -Force -Path $installDir | Out-Null

$hostBin = Join-Path $installDir 'noctis-host.exe'
$singboxBin = Join-Path $installDir 'sing-box.exe'

$archive = "noctis-host-$tag-windows-$arch.zip"
$url     = "https://github.com/$repo/releases/download/$tag/$archive"

$tmp = Join-Path $env:TEMP ("noctis-" + [guid]::NewGuid())
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
try {
  Write-Host "-> downloading $archive"
  Invoke-WebRequest -UseBasicParsing -Uri $url -OutFile (Join-Path $tmp $archive)
  Expand-Archive -Path (Join-Path $tmp $archive) -DestinationPath $tmp -Force
  $src = Join-Path $tmp "noctis-host-$tag-windows-$arch"
  Copy-Item (Join-Path $src 'noctis-host.exe') $hostBin -Force
  Copy-Item (Join-Path $src 'sing-box.exe')    $singboxBin -Force
} finally {
  Remove-Item -Recurse -Force $tmp
}

$manifest = [pscustomobject]@{
  name             = 'com.noctis.host'
  description      = 'Noctis native helper'
  path             = $hostBin
  type             = 'stdio'
  allowed_origins  = @("chrome-extension://$ExtensionId/")
} | ConvertTo-Json -Depth 4

$manifestPath = Join-Path $installDir 'com.noctis.host.json'
[System.IO.File]::WriteAllText($manifestPath, $manifest)

$registryRoots = @(
  'HKCU:\Software\Google\Chrome\NativeMessagingHosts',
  'HKCU:\Software\Chromium\NativeMessagingHosts',
  'HKCU:\Software\BraveSoftware\Brave-Browser\NativeMessagingHosts',
  'HKCU:\Software\Microsoft\Edge\NativeMessagingHosts',
  'HKCU:\Software\Vivaldi\NativeMessagingHosts',
  'HKCU:\Software\Opera Software\Opera Stable\NativeMessagingHosts',
  'HKCU:\Software\Yandex\YandexBrowser\NativeMessagingHosts'
)

$written = 0
foreach ($root in $registryRoots) {
  New-Item -Path $root -Force | Out-Null
  $key = Join-Path $root 'com.noctis.host'
  New-Item -Path $key -Force | Out-Null
  Set-ItemProperty -Path $key -Name '(Default)' -Value $manifestPath
  Write-Host "  registered $key"
  $written++
}

Write-Host ''
Write-Host "Done. Registered for $written browser(s)."
Write-Host "Helper:    $hostBin"
Write-Host "Manifest:  $manifestPath"
Write-Host 'Reload Noctis on chrome://extensions to pick up the helper.'
