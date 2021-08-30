const { app, BrowserWindow, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const _ = require('lodash');

// storage enums. move to common constants later
const STORAGE_ENUMS = {
  LOAD_SAVED_CREDENTIALS: 'LOAD_SAVED_CREDENTIALS',
  HANDLE_LOAD_SAVED_CREDENTIALS: 'HANDLE_LOAD_SAVED_CREDENTIALS',
  SAVE_CREDENTIAL: 'SAVE_CREDENTIAL',
  HANDLE_SAVE_CREDENTIAL: 'HANDLE_SAVE_CREDENTIAL',
};

let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    resizable: false,
    // autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  //load the index.html from a url
  mainWindow.loadURL('http://localhost:3000');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (mainWindow === null) {
    createWindow();
  }
});

// ipcMain events
ipcMain.on(STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS, (event, args) => {
  console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] args`, args);
  storage.get('credentials', (error, credentials) => {
    if (error) {
      // return error message to app
      const message = {
        success: false,
        credentials: [],
        error,
      };
      console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] message`, message);
      mainWindow.send(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, message);
    } else {
      let storedCredentials = [];
      if (!_.isEmpty(credentials)) {
        storedCredentials = _.sortBy(credentials, ['updatedAt']);
      }
      const message = {
        success: true,
        credentials: storedCredentials,
      };
      console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] message`, message);
      mainWindow.send(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, message);
    }
  });
});

ipcMain.on(STORAGE_ENUMS.SAVE_CREDENTIAL, (event, args) => {
  console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] args`, args);
  storage.get('credentials', (error, credentials) => {
    if (error) {
      // return error message to app
      const message = {
        success: false,
        credentials: [],
        error,
      };
      console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
      mainWindow.send(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, message);
    } else {
      let storedCredentials = _.isEmpty(credentials) ? [] : credentials;

      if(_.isEmpty(storedCredentials)) {
        let newCred = {...args, id: 1 };
        storedCredentials.push(newCred);
      } else {
        let existingCred = _.find(storedCredentials, (cred) => cred.id === args.id);
        if(_.isEmpty(existingCred)) {
          let newCred = { ...args, id: storedCredentials.length + 1 };
          storedCredentials.push(newCred);
          storedCredentials = _.sortBy(storedCredentials, ['updatedAt']);
        } else {
          storedCredentials = _.filter(storedCredentials, (cred) => cred.id !== args.id);
          let updatedCred = { ...args };
          storedCredentials.push(updatedCred);
          storedCredentials = _.sortBy(storedCredentials, ['updatedAt']);
        }
      }
      console.log('storedCredentials to set', storedCredentials);
      storage.set('credentials', storedCredentials, (error) => {
        if(error) {
          const message = {
            success: true,
            credentials: storedCredentials,
          };
          console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
          mainWindow.send(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, message);
        } else {
          const message = {
            success: true,
            credentials: storedCredentials,
          };
          console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
          mainWindow.send(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, message);
        }
      })
    }
  });
});
