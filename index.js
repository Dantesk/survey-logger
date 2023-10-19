const { app, BrowserWindow, dialog, autoUpdater, Menu } = require('electron');
const log = require('electron-log');
require('update-electron-app')({
  updateInterval: '1 hour',
  logger: log
})
//-------------------------------------------------------------------
// Ignore certificate errors
//
// THIS SECTION IS REQUIRED
//
//-------------------------------------------------------------------

app.commandLine.appendSwitch('ignore-certificate-errors');
app.commandLine.appendSwitch('ignore-certificate-errors-spki-list');
autoUpdater.allowUnsigned = true;
autoUpdater.allowUnverified = true;
autoUpdater.autoDownload = false;
autoUpdater.arguments = ['--ignore-certificate-errors', '--ignore-certificate-errors-spki-list'];

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
  //win.webContents.openDevTools()
  // win.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  // win.removeMenu(null); // Rimuove il menu forse
}

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        click: () => {
          app.quit();
        }
      }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Update Info',
        click: () => {
          const options = {
            type: 'info',
            title: 'Survey Logger Release',
            message: `(Versione Attuale: ${app.getVersion()})` +"\n Il link al repository GitHub è:",
            detail: 'https://github.com/Dantesk/survey-logger/releases/latest',
            buttons: ['OK']
          };
          dialog.showMessageBox(null, options);
        }
      },
    ]
  }
]);
Menu.setApplicationMenu(menu);


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

autoUpdater.on('checking-for-update', () => {
  log.info('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  log.info('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  log.info('Update not available.');
})
autoUpdater.on('error', (err) => {
  log.info('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  log.info(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded');
});

// Listen for the update-downloaded event
autoUpdater.on('update-downloaded', (ev, info) => {
  log.info('update-downloaded - dialog show');
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
  log.info('App ready - check for update');
  autoUpdater.checkForUpdates();
});