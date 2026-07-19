#!/bin/bash

set -u

ROOT="$(cd "$(dirname "$0")" && pwd)"
PID_FILE="$ROOT/.server.pid"

if [ ! -f "$PID_FILE" ]; then
  exit 0
fi

PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ "$PID" =~ ^[0-9]+$ ]] && kill -0 "$PID" 2>/dev/null; then
  kill "$PID" 2>/dev/null || true
  attempt=0
  while [ "$attempt" -lt 20 ]; do
    if ! kill -0 "$PID" 2>/dev/null; then
      break
    fi
    sleep 0.1
    attempt=$((attempt + 1))
  done
  if kill -0 "$PID" 2>/dev/null; then
    kill -9 "$PID" 2>/dev/null || true
  fi
fi

rm -f "$PID_FILE"
exit 0
