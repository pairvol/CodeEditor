# Contributing

This project is small and local-first.

## Before Sending Changes

1. Build the terminal editor with `make`.
2. Launch the GTK app with `./bin/nce-gui`.
3. Keep changes focused and avoid adding dependencies unless they are needed.
4. Update `README.md` when behavior or shortcuts change.

## Current Known Issue

SSH support is temporarily disabled in `bin/nce-gui` because the remote
connection path is crashing and needs to be repaired before it is exposed
again.
