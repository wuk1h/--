param(
  [Parameter(Mandatory = $true)]
  [string]$Root,
  [int]$Port = 4173,
  [string]$PidFile = ""
)

$ErrorActionPreference = "Stop"
$siteRoot = [System.IO.Path]::GetFullPath($Root)
$rootPrefix = $siteRoot.TrimEnd([System.IO.Path]::DirectorySeparatorChar) + [System.IO.Path]::DirectorySeparatorChar
$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $Port)

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".txt" = "text/plain; charset=utf-8"
  ".xml" = "application/xml; charset=utf-8"
  ".svg" = "image/svg+xml"
  ".webp" = "image/webp"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif" = "image/gif"
  ".ico" = "image/x-icon"
  ".woff" = "font/woff"
  ".woff2" = "font/woff2"
  ".mp4" = "video/mp4"
  ".webm" = "video/webm"
}

function Write-Response {
  param(
    [System.Net.Sockets.NetworkStream]$Stream,
    [int]$StatusCode,
    [string]$StatusText,
    [string]$ContentType,
    [byte[]]$Body,
    [bool]$HeadOnly = $false
  )

  $header = "HTTP/1.1 $StatusCode $StatusText`r`nContent-Type: $ContentType`r`nContent-Length: $($Body.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
  $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
  $Stream.Write($headerBytes, 0, $headerBytes.Length)
  if (-not $HeadOnly -and $Body.Length -gt 0) {
    $Stream.Write($Body, 0, $Body.Length)
  }
}

try {
  if (-not [System.IO.Directory]::Exists($siteRoot)) {
    throw "Site directory not found: $siteRoot"
  }

  $listener.Start()
  if ($PidFile) {
    [System.IO.File]::WriteAllText($PidFile, "$PID", [System.Text.Encoding]::ASCII)
  }

  while ($true) {
    $client = $listener.AcceptTcpClient()
    try {
      $stream = $client.GetStream()
      $reader = New-Object System.IO.StreamReader($stream, [System.Text.Encoding]::ASCII, $false, 4096, $true)
      $requestLine = $reader.ReadLine()
      if ([string]::IsNullOrWhiteSpace($requestLine)) {
        continue
      }

      do {
        $line = $reader.ReadLine()
      } while ($null -ne $line -and $line.Length -gt 0)

      $requestParts = $requestLine.Split(" ")
      if ($requestParts.Length -lt 2) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Bad request")
        Write-Response $stream 400 "Bad Request" "text/plain; charset=utf-8" $body
        continue
      }

      $method = $requestParts[0].ToUpperInvariant()
      $headOnly = $method -eq "HEAD"
      if ($method -ne "GET" -and -not $headOnly) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("Method not allowed")
        Write-Response $stream 405 "Method Not Allowed" "text/plain; charset=utf-8" $body
        continue
      }

      $requestUri = New-Object System.Uri("http://127.0.0.1$($requestParts[1])")
      $relativePath = [System.Uri]::UnescapeDataString($requestUri.AbsolutePath).TrimStart("/")
      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = "index.html"
      }

      $platformPath = $relativePath.Replace("/", [System.IO.Path]::DirectorySeparatorChar)
      $candidate = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($siteRoot, $platformPath))
      if ([System.IO.Directory]::Exists($candidate)) {
        $candidate = [System.IO.Path]::Combine($candidate, "index.html")
      } elseif (-not [System.IO.File]::Exists($candidate) -and [string]::IsNullOrEmpty([System.IO.Path]::GetExtension($candidate))) {
        $candidate = [System.IO.Path]::Combine($candidate, "index.html")
      }

      $homePage = [System.IO.Path]::Combine($siteRoot, "index.html")
      $isInsideRoot = $candidate.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase) -or $candidate.Equals($homePage, [System.StringComparison]::OrdinalIgnoreCase)
      if (-not $isInsideRoot -or -not [System.IO.File]::Exists($candidate)) {
        $body = [System.Text.Encoding]::UTF8.GetBytes("404 - File not found")
        Write-Response $stream 404 "Not Found" "text/plain; charset=utf-8" $body $headOnly
        continue
      }

      $body = [System.IO.File]::ReadAllBytes($candidate)
      $extension = [System.IO.Path]::GetExtension($candidate).ToLowerInvariant()
      $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { "application/octet-stream" }
      Write-Response $stream 200 "OK" $contentType $body $headOnly
    } catch {
      try {
        $body = [System.Text.Encoding]::UTF8.GetBytes("500 - Local server error")
        Write-Response $stream 500 "Internal Server Error" "text/plain; charset=utf-8" $body
      } catch {
        # The browser may close the connection before the response completes.
      }
    } finally {
      $client.Close()
    }
  }
} finally {
  $listener.Stop()
  if ($PidFile -and [System.IO.File]::Exists($PidFile)) {
    $storedPid = [System.IO.File]::ReadAllText($PidFile).Trim()
    if ($storedPid -eq "$PID") {
      [System.IO.File]::Delete($PidFile)
    }
  }
}
