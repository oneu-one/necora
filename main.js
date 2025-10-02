const { app, BrowserWindow, ipcMain, dialog } = require("electron/main");
const path = require("node:path");

let win;

/** Force disable security warning */
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";

function createWindow() {
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    icon: path.join(__dirname, "icon.png"),
    width: 1600,
    height: 900,
    webPreferences: {
      // preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // mainWindow.webContents.openDevTools();

  mainWindow.loadFile("index.html");

  win = mainWindow;
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// IPC
ipcMain.on("open_devtools", (ev) => {
  win.webContents.openDevTools();
});
