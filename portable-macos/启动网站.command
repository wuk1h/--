#!/bin/bash

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$ROOT/site"
PID_FILE="$ROOT/.server.pid"
LOG_FILE="$ROOT/.server.log"
PORT=4173
URL="http://127.0.0.1:$PORT/"

site_is_ready() {
  /usr/bin/curl --silent --fail --max-time 1 "$URL" 2>/dev/null | /usr/bin/grep --quiet "MAKEINE ARCHIVE"
}

wait_for_site() {
  local attempt=0
  while [ "$attempt" -lt 40 ]; do
    if site_is_ready; then
      return 0
    fi
    sleep 0.1
    attempt=$((attempt + 1))
  done
  return 1
}

stop_stale_process() {
  if [ -f "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE" 2>/dev/null || true)"
    if [[ "$pid" =~ ^[0-9]+$ ]] && kill -0 "$pid" 2>/dev/null; then
      kill "$pid" 2>/dev/null || true
      sleep 0.2
    fi
    rm -f "$PID_FILE"
  fi
}

start_with_python() {
  if command -v python3 >/dev/null 2>&1; then
    nohup python3 -m http.server "$PORT" --bind 127.0.0.1 --directory "$SITE" >>"$LOG_FILE" 2>&1 &
    echo $! >"$PID_FILE"
    wait_for_site
    return $?
  fi
  return 1
}

start_with_native_server() {
  local machine server
  machine="$(uname -m)"
  case "$machine" in
    arm64|aarch64)
      server="$ROOT/bin/local-server-arm64"
      ;;
    x86_64|amd64)
      server="$ROOT/bin/local-server-amd64"
      ;;
    *)
      return 1
      ;;
  esac

  chmod +x "$server" 2>/dev/null || true
  nohup "$server" -root "$SITE" -port "$PORT" -pid "$PID_FILE" >>"$LOG_FILE" 2>&1 &
  wait_for_site
}

if site_is_ready; then
  open "$URL"
  exit 0
fi

stop_stale_process
: >"$LOG_FILE"

if ! start_with_python; then
  stop_stale_process
  if ! start_with_native_server; then
    stop_stale_process
    osascript -e 'display dialog "The local website could not start. Open 使用说明-macOS.txt for troubleshooting." with title "MAKEINE ARCHIVE" buttons {"OK"} default button "OK"' >/dev/null 2>&1 || true
    open -a TextEdit "$ROOT/使用说明-macOS.txt" >/dev/null 2>&1 || true
    exit 1
  fi
fi

open "$URL"
exit 0
