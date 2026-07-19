param(
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"
$packageRoot = $PSScriptRoot
$serverScript = Join-Path $packageRoot "local-server.ps1"
$siteRoot = Join-Path $packageRoot "site"
$pidFile = Join-Path $packageRoot ".server.pid"
$port = 4173
$url = "http://127.0.0.1:$port/"

function Test-LocalSite {
  try {
    $request = [System.Net.HttpWebRequest]::Create($url)
    $request.Method = "GET"
    $request.Timeout = 500
    $request.ReadWriteTimeout = 500
    $response = $request.GetResponse()
    $reader = New-Object System.IO.StreamReader($response.GetResponseStream())
    $content = $reader.ReadToEnd()
    $reader.Close()
    $response.Close()
    return $content.Contains("MAKEINE ARCHIVE")
  } catch {
    return $false
  }
}

if (-not (Test-LocalSite)) {
  $quotedServer = '"' + $serverScript + '"'
  $quotedRoot = '"' + $siteRoot + '"'
  $quotedPid = '"' + $pidFile + '"'
  $arguments = "-NoProfile -ExecutionPolicy Bypass -File $quotedServer -Root $quotedRoot -Port $port -PidFile $quotedPid"
  Start-Process -FilePath "powershell.exe" -ArgumentList $arguments -WindowStyle Hidden | Out-Null

  $ready = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    Start-Sleep -Milliseconds 100
    if (Test-LocalSite) {
      $ready = $true
      break
    }
  }

  if (-not $ready) {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show("The local website could not start. Make sure port 4173 is available.", "MAKEINE ARCHIVE") | Out-Null
    exit 1
  }
}

if (-not $NoBrowser) {
  Start-Process $url
}
