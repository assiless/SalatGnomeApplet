const { 
    Clutter, 
    GObject,
    Gio, 
    GLib, 
    Soup, 
    St } = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const CURRENT_PATH = Me.dir.get_path();

imports.searchPath.push(CURRENT_PATH);
MyUtils = imports.src.myUtils;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
// const Keyboard = imports.ui.status.keyboard;

const Mainloop = imports.mainloop;
// const Lang = imports.lang;

const city = 'setif';
const url = `https://www.google.com/search?q=salat+fajr+${city}`
var matches;

let timeout;
var mainLabel; // for changing label every 60 sec

// ____________________________________________________________________________________________________

const MyPanelButtom = GObject.registerClass(
    class MyPanelButtom extends PanelMenu.Button {

    constructor(role) {
        super(0.5, role);
        let box = new St.BoxLayout();
        let icon =  new St.Label({ text: "🕋", y_align: Clutter.ActorAlign.CENTER });
		// mainLabel = new St.Label({ text: ' fetch ... ',
		mainLabel = new St.Label({ text: getNext(),
			y_expand: true,
			y_align: Clutter.ActorAlign.CENTER });
        box.add(icon);
		box.add(mainLabel);
        this.add_child(box);
        
        
        /* this.fajr = new PopupMenu.PopupMenuItem("");
    	this.fajrLabel = new St.Label({ text: "Fajr", y_align: Clutter.ActorAlign.CENTER });
        this.fajr.add_child(this.fajrLabel);
        this.menu.addMenuItem(this.fajr); */
        for (const match of matches) { // TODO
            let salat = new PopupMenu.PopupMenuItem("");
    	    let salatLabel = new St.Label({ text: String(match), y_align: Clutter.ActorAlign.CENTER });
            salat.add_child(salatLabel);
            this.menu.addMenuItem(salat);
        }
    }
});


class Extension {
    constructor() {this._indicator = null;}

    enable() {
        log(`enabling ${Me.metadata.name}`);
        let indicatorName = `${Me.metadata.name} Indicator`;
        this._indicator = new MyPanelButtom(indicatorName);
        Main.panel.addToStatusArea(this.indicatorName, this._indicator, 0, 'right');

        timeout = Mainloop.timeout_add_seconds(60.0, setButtonText);
    }

    disable() {
        Mainloop.source_remove(timeout);

        log(`disabling ${Me.metadata.name}`);

        this._indicator.destroy();
        this._indicator = null;
    }
}

// ______________________________________________________________--
function getTime(date) {
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

function isBigger(left, right) {
    left = "11/24/2014 " + left;
    right = "11/24/2014 " + right;

    let leftDate = new Date(left).getTime();
    let rightDate = new Date(right).getTime();

    if (leftDate > rightDate) {
        return true;
    } else if (leftDate < rightDate) {
        return false;
    } else {
        return true;
    }
}

function getNext(){
    let current_date = getTime(new Date());
    for (let index = 0; index < matches.length; index++) {
        let salat, time;
        [salat, time] = String(matches[index]).split(",");
        bigger = isBigger(time, current_date);
        if (bigger) return [salat, time].join(" ");
    }
}

function setButtonText() {

    // var date = getTime(new Date());
    mainLabel.set_text(getNext())

    /* // date by GLib
    var now = GLib.DateTime.new_now_local();
    var str = now.format("%Y-%m-%d %H-%M-%S");
    arr.push(str); */
    return true;
}


function init() {
    log(`initializing ${Me.metadata.name}`);
    matches = MyUtils.get(url, MyUtils.clean); // Sync Only
    return new Extension();
}
