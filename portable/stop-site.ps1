$ErrorActionPreference = "SilentlyContinue"
$pidFile = Join-Path $PSScriptRoot ".server.pid"

if (-not (Test-Path -LiteralPath $pidFile)) {
  exit 0
}

$serverPid = [int](Get-Content -Raw -LiteralPath $pidFile)
$processInfo = Get-CimInstance Win32_Process -Filter "ProcessId = $serverPid"
if ($processInfo -and $processInfo.CommandLine -like "*local-server.ps1*") {
  Stop-Process -Id $serverPid -Force
}

Remove-Item -LiteralPath $pidFile -Force
