#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FILTER_SCRIPT="$REPO_ROOT/scripts/git-rewrite-author-filter.sh"
cd "$REPO_ROOT"
git filter-branch -f --env-filter ". \"$FILTER_SCRIPT\"" main
