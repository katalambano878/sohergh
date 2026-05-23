#!/bin/sh
# Used once with: git filter-branch -f --env-filter '. scripts/git-rewrite-author-filter.sh' main
# Rewrites Drrbarns / placeholder authors to ecrimah's GitHub noreply (Vercel Hobby team owner).
case "$GIT_AUTHOR_EMAIL" in
  drrbarns@users.noreply.github.com|you@example.com)
    export GIT_AUTHOR_NAME=ecrimah
    export GIT_AUTHOR_EMAIL=91695724+ecrimah@users.noreply.github.com
    ;;
esac
case "$GIT_COMMITTER_EMAIL" in
  drrbarns@users.noreply.github.com|you@example.com)
    export GIT_COMMITTER_NAME=ecrimah
    export GIT_COMMITTER_EMAIL=91695724+ecrimah@users.noreply.github.com
    ;;
esac
