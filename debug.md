```bash
clear ; gjs
cp -r /home/assil/Developer/gui/SalatGnomeApplet ~/.local/share/gnome-shell/extensions/example@shell.gnome.org
gnome-extensions disable example@shell.gnome.org ; gnome-extensions enable example@shell.gnome.org

# loop
{
    # do change
    # https://unix.stackexchange.com/q/139513/535745#comment607448_194058
    sudo journalctl --flush --rotate ; sudo journalctl --vacuum-time=1s 
    # alt + f2 -> r
    journalctl -f -o cat GNOME_SHELL_EXTENSION_UUID=example@shell.gnome.org
}
```