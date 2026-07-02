# Native Code Editor

> **spark branch**: this is the earliest, most experimental line of
> development. Things here can be unfinished or change shape entirely.
> Features move to `labs` once they're mostly settled, and to `main` once
> they're fully released.

A small Linux-native text editor with no Electron or browser runtime.

The repository contains two editors:

- `bin/nce-gui`: the GTK windowed editor
- `src/main.c`: the terminal fallback editor

## Status

The GTK editor is the main app. It supports opening, editing, and saving files
over SSH in addition to local files.

## Extensions (early, spark-only)

Drop `.js` files into `~/.config/native-code-editor/extensions/` and they run
once at startup, in filename-sort order, each with the running
`Gtk.Application` instance in scope as `app`. A script's top-level code is its
entire entry point — there's no registration contract, lifecycle, or
sandboxing yet. A script can reach into `app.get_windows()` to touch a live
editor window directly (add header buttons, register actions, etc.), but
expect the internals it pokes at to change without notice at this stage.

A failing extension is logged to stderr and skipped; it does not stop other
extensions from loading or crash the app.

This is intentionally the smallest possible foundation — a real extension API
(defined hooks, a manifest format, permissions) is future work once this
proves out.

## Build

```sh
make
```

## Run The Windowed App

```sh
./bin/nce-gui path/to/file.txt
```

Running without a file starts an empty buffer.

## Install As A Desktop App

```sh
make install
```

This installs:

- `~/.local/bin/nce-gui`
- `~/.local/bin/nce`
- `~/.local/share/applications/dev.pairvol.NativeCodeEditor.desktop`

After install, launch Native Code Editor from the desktop app launcher or open
text files with it from the file manager.

## Run The Terminal Editor

```sh
./nce path/to/file.txt
```

Running without a file starts an empty buffer.

## Shortcuts

Windowed app:

- `Ctrl-O`: open
- `Ctrl-Shift-O`: open folder
- `Ctrl-P`: quick open (fuzzy-find a file by name)
- `Ctrl-S`: save
- `Ctrl-Shift-S`: save as
- `Ctrl-N` / `Ctrl-T`: new tab
- `Ctrl-W`: close tab
- `Ctrl-Page Up` / `Ctrl-Page Down`: switch tabs
- `Ctrl-Shift-E`: toggle file explorer
- `Ctrl-Shift-J`: toggle console
- `` Ctrl-` ``: toggle terminal
- `Ctrl-Shift-K`: connect over SSH
- `Ctrl-Shift-P`: toggle live preview for HTML/PHP tabs
- `Ctrl-Shift-T`: cycle dark/light/custom theme
- `Ctrl-Shift-C`: edit custom theme colors
- `Ctrl-Q`: quit

Drag a tab out of the tab bar to open it in a new window.

Dark mode is the default. Light mode and Custom mode are both available in the
theme menu.

The header save button opens a compact menu with Save and Save As. Dirty tabs
are marked with `*` and must be saved before closing.

## Code Editing

- Toggleable left file explorer rooted at the current workspace folder
- Quick open: fuzzy-find and jump to any file in the workspace (local or, when
  connected, over SSH) without leaving the keyboard
- GtkSourceView editor with line numbers and syntax highlighting
- Initial language support: JavaScript (`.js`, `.mjs`, `.cjs`), HTML, CSS, and
  PHP
- Toggleable bottom console for running one-off shell commands in the
  workspace, plus a separate real interactive terminal (VTE-backed) in the
  same panel
- Drag a tab out of the tab bar to tear it off into its own window
- WebKitGTK live preview for HTML tabs
- PHP preview uses the saved file and requires a `php` command on `PATH`

## Terminal Editor

- `Ctrl-S`: save
- `Ctrl-Q`: quit
- Arrow keys: move cursor
- `Page Up` / `Page Down`: scroll
- `Home` / `End`: move to start/end of line
- `Backspace` / `Delete`: remove text
- `Enter`: insert a new line

## Scope

Current scope: tabbed code editing with tab tear-off into new windows, file
explorer, quick open, shell console, an embedded terminal, JS/HTML/CSS and PHP
syntax highlighting, HTML/PHP preview, file open/save/save-as,
dark/light/custom themes, dirty state in the title and tab labels, SSH remote
editing, and native desktop launcher metadata. Richer project tools and deeper
code intelligence can build on this base.

## Planned Features

- Find and replace within a file
- Session restore (reopen last session's tabs and workspace on launch)
- Git status indicators in the file explorer
- Richer SSH remote support: create, rename, and delete files/folders on the
  remote host (currently limited to browse/open/save)

## License

MIT. See [LICENSE](LICENSE).
