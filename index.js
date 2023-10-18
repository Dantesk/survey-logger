const { app, BrowserWindow, autoUpdater, dialog, Menu, protocol, ipcMain } = require('electron');
const log = require('electron-log');

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

const server = 'https://update.electronjs.org'
const feed = `${server}/Dantesk/survey-logger/${process.platform}-${process.arch}/${app.getVersion()}`

autoUpdater.setFeedURL(feed)

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

// function sendStatusToWindow(text) {
//     log.info(text);
//     win.webContents.send('message', text);
// }

autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  console.log('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available.');
})
autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded');
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

// Listen for the update-downloaded event
autoUpdater.on('update-downloaded', (ev, info) => {
  // Prompt the user to install the update
  dialog.showMessageBox({
    type: 'question',
    buttons: ['Install and Relaunch', 'Later'],
    defaultId: 0,
    message: 'A new version of the app has been downloaded',
    detail: 'It will be installed the next time you restart the application',
  }, (response) => {
    if (response === 0) {
      // Install and relaunch the app
      autoUpdater.quitAndInstall();
    }
  });
});

// Check for updates when the app is ready
app.on('ready', function () {
  console.log('CheckForUpdates')
  autoUpdater.checkForUpdates();
});