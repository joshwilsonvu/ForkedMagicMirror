/*
 * This file is a bare-bones shell for the client to run
 */

import electron from "electron";
import config from "../shared/config";
import core from "./core";
// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, MenuItem} = electron;


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
function createWindow() {
    if (mainWindow) {
        return;
    }
    // Create the browser window.
    mainWindow = new BrowserWindow({
        fullscreen: true,
        autoHideMenuBar: true,
        width: 800,
        height: 600,
        x: 0,
        y: 0,
        darkTheme: true,
        titleBarStyle: "hidden",
        webPreferences: {
            zoomFactor: config.zoom
        },
        backgroundColor: "#000",
        ...config.electronOptions
    });

    if (process.env.NODE_ENV === "production") {
        mainWindow.loadFile(config.root_path)
    }
    // and load the index.html of the app.
    mainWindow.loadURL('http://localhost:3000');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
});

app.on("before-quit", event => {
    event.preventDefault();
    setTimeout(() => process.exit(0), 3000);
    try {
        core.stop();
    } finally {
        process.exit(0);
    }
});