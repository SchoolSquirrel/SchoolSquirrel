/**
 * This is the startup file for the Electron version.
 */

import {
    app, BrowserWindow, globalShortcut, ipcMain,
} from "electron";
import * as path from "path";
import * as url from "url";
import { setup as setupPushReceiver } from "electron-push-receiver";

let win: BrowserWindow;
const args = process.argv.slice(1);
const serve = args.some((val) => val === "--serve");
function createWindow() {
    // Create the browser window.

    win = new BrowserWindow({
        frame: false,
        icon: path.join(__dirname, "src/favicon.ico"),
        show: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        },
        x: 0,
        y: 0,
        title: "SchoolSquirrel",
        minHeight: 500,
        minWidth: 1000,
    });
    setupPushReceiver(win.webContents);
    if (serve) {
        // eslint-disable-next-line
        require("electron-reload")(__dirname, {
            // eslint-disable-next-line
            electron: require(`${__dirname}/node_modules/electron`),
        });
        win.loadURL("http://localhost:4200");
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, "dist/index.html"),
                protocol: "file:",
                slashes: true,
            }),
        );
    }
    globalShortcut.register("CommandOrControl+Shift+R", () => {
        win.reload();
    });
    globalShortcut.register("CommandOrControl+Shift+I", () => {
        win.webContents.toggleDevTools();
    });

    if (serve) {
        win.webContents.openDevTools();
    }
    /* const hideSplashscreen = initSplashScreen({
        color: "#55BDCA",
        height: 225,
        logo: path.join(__dirname, "src/favicon.png"),
        mainWindow: win,
        productName: "SchoolSquirrel",
        text: "Initializing ...",
        url: OfficeTemplate,
        website: "https://SchoolSquirrel.github.io",
        width: 375,
    }); */

    const splashScreen = new BrowserWindow({
        frame: false,
        center: true,
        height: 300,
        width: 620,
        resizable: false,
        skipTaskbar: true,
        icon: path.join(__dirname, "src/favicon.ico"),
        title: "SchoolSquirrel",
        show: false,
    });
    splashScreen.webContents.on("did-finish-load", () => {
        splashScreen.show();
    });
    splashScreen.loadFile("electron-splash-screen.html");

    ipcMain.on("ready", () => {
        splashScreen.destroy();
        win.show();
    });

    win.on("closed", () => {
        win = null;
    });
}

try {
    app.on("ready", createWindow);
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });

    app.on("activate", () => {
        if (win === null) {
            createWindow();
        }
    });
} catch (e) {
    // eslint-disable-next-line
    console.error(e);
}
