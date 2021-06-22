const {app, BrowserWindow} = require('electron'), stateKeeper = require('electron-window-state'), fs = require("fs");

function create() {
    const filePrefs = {preload: __dirname + "/preload.js", enableRemoteModule: true, devTools: true, show: false},
        urlPrefs = {devTools: false, show: false};
    fs.stat("url.conf", (err1, stat) => {
        if (!err1 && stat.isFile()) fs.readFile("url.conf", "utf8", (err2, url) => {
            if (!err2) createWindow(urlPrefs, url);
            else createWindow(filePrefs);
        });
        else createWindow(filePrefs);
    });
}

function createWindow(webPreferences, url = null) {
    const state = stateKeeper({defaultWidth: 1000, defaultHeight: 800}), window = new BrowserWindow({
        center: true,
        resizable: true,
        frame: false,
        icon: __dirname + "/icon.png",
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
        backgroundColor: "#0082c9",
        webPreferences: webPreferences
    });
    state.manage(window);
    if (url) window.loadURL(url);
    else {
        require('@electron/remote/main').initialize();
        window.loadFile(__dirname + "/page.html");
    }
    window.once("ready-to-show", () => window.show());
}

app.whenReady().then(() => {
    create();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) create()
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})