# Native Code Editor

A small Linux-native text editor with no Electron or browser runtime.

The repository contains two editors:

- `bin/nce-gui`: the GTK windowed editor
- `src/main.c`: the terminal fallback editor

## Status

The GTK editor is the main app. SSH support is currently disabled in the UI and
code path because the remote refresh flow is crashing and needs to be fixed
before it is exposed again.

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
- `Ctrl-S`: save
- `Ctrl-Shift-S`: save as
- `Ctrl-N`: new tab
- `Ctrl-W`: close tab
- `Ctrl-Page Up` / `Ctrl-Page Down`: switch tabs
- `Ctrl-Shift-E`: toggle file explorer
- `Ctrl-Shift-J`: toggle console
- `Ctrl-Shift-P`: toggle live preview for HTML/PHP tabs
- `Ctrl-Shift-T`: cycle dark/light/custom theme
- `Ctrl-Shift-C`: edit custom theme colors
- `Ctrl-Q`: quit

Dark mode is the default. Light mode and Custom mode are both available in the
theme menu.

The header save button opens a compact menu with Save and Save As. Dirty tabs
are marked with `*` and must be saved before closing.

## Code Editing

- Toggleable left file explorer rooted at the current workspace folder
- GtkSourceView editor with line numbers and syntax highlighting
- Initial language support: JavaScript (`.js`, `.mjs`, `.cjs`), HTML, CSS, and
  PHP
- Toggleable bottom console for running shell commands in the workspace
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

Current scope: tabbed code editing, file explorer, shell console, JS/HTML/CSS
and PHP syntax highlighting, HTML/PHP preview, file open/save/save-as,
dark/light/custom themes, dirty state in the title and tab labels, and native
desktop launcher metadata. Search, richer project tools, and deeper code
intelligence can build on this base.

## License

MIT. See [LICENSE](LICENSE).
