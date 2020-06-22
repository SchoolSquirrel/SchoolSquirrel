"use strict";
/**
 * This is the startup file for the Electron version.
 */
exports.__esModule = true;
var electron_1 = require("electron");
var electron_splashscreen_1 = require("electron-splashscreen");
var path = require("path");
var url = require("url");
var electron_push_receiver_1 = require("electron-push-receiver");
var win;
var args = process.argv.slice(1);
var serve = args.some(function (val) { return val === "--serve"; });
function createWindow() {
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        frame: false,
        icon: path.join(__dirname, "src/favicon.ico"),
        show: false,
        webPreferences: { nodeIntegration: true },
        x: 0,
        y: 0,
        title: "SchoolSquirrel",
        minHeight: 500,
        minWidth: 1000
    });
    electron_push_receiver_1.setup(win.webContents);
    if (serve) {
        // eslint-disable-next-line
        require("electron-reload")(__dirname, {
            // eslint-disable-next-line
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL("http://localhost:4200");
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, "dist/index.html"),
            protocol: "file:",
            slashes: true
        }));
    }
    electron_1.globalShortcut.register("CommandOrControl+Shift+R", function () {
        win.reload();
    });
    electron_1.globalShortcut.register("CommandOrControl+Shift+I", function () {
        win.webContents.toggleDevTools();
    });
    if (serve) {
        win.webContents.openDevTools();
    }
    var hideSplashscreen = electron_splashscreen_1.initSplashScreen({
        color: "#55BDCA",
        height: 225,
        logo: path.join(__dirname, "src/favicon.png"),
        mainWindow: win,
        productName: "SchoolSquirrel",
        text: "Initializing ...",
        url: electron_splashscreen_1.OfficeTemplate,
        website: "https://SchoolSquirrel.github.io",
        width: 375
    });
    electron_1.ipcMain.on("ready", function () {
        hideSplashscreen();
        win.show();
    });
    win.on("closed", function () {
        win = null;
    });
}
try {
    electron_1.app.on("ready", createWindow);
    electron_1.app.on("window-all-closed", function () {
        if (process.platform !== "darwin") {
            electron_1.app.quit();
        }
    });
    electron_1.app.on("activate", function () {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // eslint-disable-next-line
    console.error(e);
}
