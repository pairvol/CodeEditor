CC ?= gcc
CFLAGS ?= -std=c11 -Wall -Wextra -pedantic -O2

TARGET := nce
SRC := src/main.c
PREFIX ?= $(HOME)/.local
BINDIR := $(PREFIX)/bin
APPDIR := $(PREFIX)/share/applications
APPID := dev.pairvol.NativeCodeEditor

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
	update-desktop-database $(APPDIR) >/dev/null 2>&1 || true

uninstall:
	rm -f $(BINDIR)/nce $(BINDIR)/nce-gui $(APPDIR)/$(APPID).desktop
	update-desktop-database $(APPDIR) >/dev/null 2>&1 || true

clean:
	rm -f $(TARGET)
