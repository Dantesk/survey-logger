const { app, BrowserWindow, dialog, Menu, protocol, ipcMain } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require("electron-updater");

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function createWindow() {
    const win = new BrowserWindow({
        width: 517,
        height: 530,
        minWidth: 317, // Imposta la larghezza minima della finestra a 400 pixel
        minHeight: 330, // Imposta l'altezza minima della finestra a 400 pixel
        maxWidth: 517, // Imposta la larghezza minima della finestra a 400 pixel
        minHeight: 530, // Imposta l'altezza minima della finestra a 400 pixel
        resizable: true,
        maximizable: true,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    win.loadFile('index.html')
    win.setMinimumSize(317, 330); // Imposta le dimensioni minime della finestra a 400x400 pixel
    // win.webContents.openDevTools()
    win.setMenu(null);
    // win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
    // win.removeMenu(null); // Rimuove il menu forse
}

function sendStatusToWindow(text) {
    log.info(text);
    win.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
  });

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
// })
// autoUpdater.on('update-not-available', (ev, info) => {
// })
// autoUpdater.on('error', (ev, err) => {
// })
// autoUpdater.on('download-progress', (ev, progressObj) => {
// })
autoUpdater.on('update-downloaded', (ev, info) => {
    // Wait 5 seconds, then quit and install
    // In your application, you don't need to wait 5 seconds.
    // You could call autoUpdater.quitAndInstall(); immediately
    setTimeout(function () {
        autoUpdater.quitAndInstall();
    }, 5000)
})

app.on('ready', function () {
    autoUpdater.checkForUpdates();
});