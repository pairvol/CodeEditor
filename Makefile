CC ?= gcc
CFLAGS ?= -std=c11 -Wall -Wextra -pedantic -O2

TARGET := nce
SRC := src/main.c
PREFIX ?= $(HOME)/.local
BINDIR := $(PREFIX)/bin
APPDIR := $(PREFIX)/share/applications
ICONDIR := $(PREFIX)/share/icons/hicolor
APPID := dev.pairvol.NativeCodeEditor
ICON_SIZES := 16x16 24x24 32x32 48x48 64x64 96x96 128x128 256x256 512x512

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(SRC)
	$(CC) $(CFLAGS) -o $@ $(SRC)

run: $(TARGET)
	./$(TARGET)

.PHONY: run-gui install uninstall

run-gui:
	./bin/nce-gui

install: $(TARGET)
	install -d $(BINDIR) $(APPDIR)
	install -m 0755 $(TARGET) $(BINDIR)/nce
	install -m 0755 bin/nce-gui $(BINDIR)/nce-gui
	install -m 0644 data/$(APPID).desktop $(APPDIR)/$(APPID).desktop
	for size in $(ICON_SIZES); do \
		install -d $(ICONDIR)/$$size/apps; \
		install -m 0644 data/icons/hicolor/$$size/apps/$(APPID).png $(ICONDIR)/$$size/apps/$(APPID).png; \
	done
	update-desktop-database $(APPDIR) >/dev/null 2>&1 || true
	gtk-update-icon-cache -f -t $(ICONDIR) >/dev/null 2>&1 || true

uninstall:
	rm -f $(BINDIR)/nce $(BINDIR)/nce-gui $(APPDIR)/$(APPID).desktop
	for size in $(ICON_SIZES); do \
		rm -f $(ICONDIR)/$$size/apps/$(APPID).png; \
	done
	update-desktop-database $(APPDIR) >/dev/null 2>&1 || true
	gtk-update-icon-cache -f -t $(ICONDIR) >/dev/null 2>&1 || true

clean:
	rm -f $(TARGET)
