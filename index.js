const { app, BrowserWindow, dialog, autoUpdater, Menu, ipcMain, nativeTheme, Notification } = require('electron');
const { updateElectronApp } = require('update-electron-app')
const log = require('electron-log');
const path = require('node:path')

const NOTIFICATION_TITLE = 'Survey Logger Update';
const CHECK_UPDATE = 'Checking for updates...';
const NO_UPDATE = 'No update available';
let LIMIT_NOTIFICATION = false

function showNotification (info) {
  if(!LIMIT_NOTIFICATION){
    new Notification({ title: NOTIFICATION_TITLE, body: info ? NO_UPDATE : CHECK_UPDATE }).show()
    LIMIT_NOTIFICATION = true;
  }
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

updateElectronApp()

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
    minWidth: 317, // Imposta la larghezza minima della finestra a 317 pixel
    minHeight: 330, // Imposta l'altezza minima della finestra a 330 pixel
    // maxWidth: 517, // Imposta la larghezza minima della finestra a 517 pixel
    // minHeight: 530, // Imposta l'altezza minima della finestra a 530 pixel
    resizable: true,
    maximizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      webSecurity: true,
      contextIsolation: false,
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadFile(path.join(__dirname, 'index.html'));
  win.setMinimumSize(317, 330); // Imposta le dimensioni minime della finestra a 317x330 pixel
  win.webContents.openDevTools()

}

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light'
  } else {
    nativeTheme.themeSource = 'dark'
  }
  return nativeTheme.shouldUseDarkColors
})

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system'
})

const menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Exit',
        icon: path.join(__dirname, 'assets', 'exit-icon.png'),
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
        label: 'Check update...',
        icon: path.join(__dirname, 'assets', 'update-icon.png'), // Aggiunta dell'icona all'opzione "Exit"
        click: () => {
          autoUpdater.checkForUpdates();
        }
      },
      {
        label: 'Info',
        icon: path.join(__dirname, 'assets', 'info-icon.png'), // Aggiunta dell'icona all'opzione "Exit"
        click: () => {
          const options = {
            type: 'info',
            title: 'Survey Logger Release',
            message: `(Version: ${app.getVersion()})` + "\n Repository GitHub:",
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


app.whenReady().then(createWindow);

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
  showNotification();
})

autoUpdater.on('update-available', () => {
  const options = {
    type: 'info',
    title: 'Survey Logger Update',
    message: 'A new update is available. Do you want to download now?',
    buttons: ['Yes', 'No']
  };
  dialog.showMessageBox(null, options).then((response) => {
    if (response.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('update-not-available', (info) => {
  showNotification(info);
})

autoUpdater.on('error', (error) => {
  const options = {
    type: 'error',
    title: 'Survey Logger Update',
    message: 'An error occurred while checking for updates.',
    detail: error.toString(),
    buttons: ['OK']
  };
  dialog.showMessageBox(null, options);
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  const options = {
    type: 'info',
    buttons: [],
    title: 'Download Progress',
    message: 'Download in progress...',
    detail: `Downloaded ${progressObj.percent}% (${progressObj.transferred}/${progressObj.total})`,
    noLink: true,
  };
  dialog.showMessageBox(null, options);
})

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
  autoUpdater.checkForUpdates();
});
