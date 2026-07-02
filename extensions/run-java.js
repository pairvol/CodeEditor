// run-java.js — Native Code Editor extension (spark, early extension API)
//
// Adds a "Run Java" button/action that saves the current tab (if it's a
// local .java file) and runs it with `java <file>` (single-file source
// launch, works with a JDK 11+ `java` binary on PATH — no separate javac
// step needed for simple programs). Output goes to the built-in Console
// panel.
//
// Install: copy this file into ~/.config/native-code-editor/extensions/
//
// This extension exists to exercise the extension loader itself. There is
// no formal extension API yet, so it reaches directly into EditorWindow
// internals (`_currentTab`, `_appendConsole`, `save`, etc.) the same way
// the app's own code does.

const {Gio, GLib, Gtk} = imports.gi;

const RUN_JAVA_ACCEL = '<Primary><Shift>r';

function wireWindow(win) {
    if (win._nceRunJavaWired)
        return;
    win._nceRunJavaWired = true;

    const action = new Gio.SimpleAction({name: 'run-java'});
    action.connect('activate', () => runJava(win));
    win.add_action(action);
    win.get_application().set_accels_for_action('win.run-java', [RUN_JAVA_ACCEL]);

    const headerBar = win.get_titlebar();
    if (headerBar && headerBar.pack_end) {
        const button = new Gtk.Button({
            icon_name: 'media-playback-start-symbolic',
            tooltip_text: `Run Java (${RUN_JAVA_ACCEL.replace('<Primary>', 'Ctrl+').replace('<Shift>', 'Shift+')})`,
        });
        button.connect('clicked', () => runJava(win));
        headerBar.pack_end(button);
    }
}

function runJava(win) {
    const tab = win._currentTab();
    if (!tab) {
        win._setStatus('Run Java: no active tab');
        return;
    }

    const path = tab.file ? tab.file.get_path() : null;
    if (!path || !path.endsWith('.java')) {
        win._setStatus('Run Java: current tab is not a saved local .java file');
        return;
    }

    const runNow = () => {
        win._setConsoleVisible(true);
        win._appendConsole(`\n$ java ${path}\n`);

        try {
            const launcher = new Gio.SubprocessLauncher({
                flags: Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE,
            });
            const process = launcher.spawnv(['java', path]);
            process.communicate_utf8_async(null, null, (proc, result) => {
                let stdout = '';
                let stderr = '';
                try {
                    [, stdout, stderr] = proc.communicate_utf8_finish(result);
                } catch (error) {
                    stderr = error.message || String(error);
                }

                GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
                    if (stdout)
                        win._appendConsole(stdout.endsWith('\n') ? stdout : `${stdout}\n`);
                    if (stderr)
                        win._appendConsole(stderr.endsWith('\n') ? stderr : `${stderr}\n`);
                    win._appendConsole(`[exit ${proc.get_exit_status()}]\n`);
                    return GLib.SOURCE_REMOVE;
                });
            });
        } catch (error) {
            win._appendConsole(`Run Java failed: ${error.message}\n`);
        }
    };

    if (tab.dirty)
        win.save(tab, ok => { if (ok) runNow(); });
    else
        runNow();
}

app.connect('window-added', (_app, win) => wireWindow(win));
for (const win of app.get_windows())
    wireWindow(win);
