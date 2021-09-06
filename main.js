const { app, BrowserWindow, ipcMain } = require('electron');
const storage = require('electron-json-storage');
const _ = require('lodash');

// storage enums. move to common constants later
const STORAGE_ENUMS = {
	LOAD_SAVED_CREDENTIALS: 'LOAD_SAVED_CREDENTIALS',
	HANDLE_LOAD_SAVED_CREDENTIALS: 'HANDLE_LOAD_SAVED_CREDENTIALS',
	SAVE_CREDENTIAL: 'SAVE_CREDENTIAL',
	HANDLE_SAVE_CREDENTIAL: 'HANDLE_SAVE_CREDENTIAL',
	DELETE_CREDENTIAL: 'DELETE_CREDENTIAL',
	HANDLE_DELETE_CREDENTIAL: 'HANDLE_DELETE_CREDENTIAL',
  SEARCH_CREDENTIAL: 'SEARCH_CREDENTIAL',
	HANDLE_SEARCH_CREDENTIAL: 'HANDLE_SEARCH_CREDENTIAL'
};

let mainWindow = null;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
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
/**
 * @param {event} // IpcMainEvent
 * @param {args} // null
 */
ipcMain.on(STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS, (event, args) => {
  // console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] args`, args);
  storage.get('credentials', (error, credentials) => {
    if (error) {
      // return error message to app
      const message = {
        success: false,
        credentials: [],
        error,
      };
      // console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] message`, message);
      mainWindow.send(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, message);
    } else {
      let storedCredentials = [];
      if (!_.isEmpty(credentials)) {
        storedCredentials = _.orderBy(credentials, ['updatedAt'], ['desc']);
      }
      const message = {
        success: true,
        credentials: storedCredentials,
      };
      // console.log(`[${STORAGE_ENUMS.LOAD_SAVED_CREDENTIALS}] message`, message);
      mainWindow.send(STORAGE_ENUMS.HANDLE_LOAD_SAVED_CREDENTIALS, message);
    }
  });
});

/**
 * @param {event} // IpcMainEvent
 * @param {args} // Credential parameters
 */
ipcMain.on(STORAGE_ENUMS.SAVE_CREDENTIAL, (event, args) => {
  // console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] args`, args);
  storage.get('credentials', (error, credentials) => {
    if (error) {
      // return error message to app
      const message = {
        success: false,
        credentials: [],
        error,
      };
      // console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
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
          storedCredentials = _.orderBy(storedCredentials, ['updatedAt'], ['desc']);
        } else {
          storedCredentials = _.filter(storedCredentials, (cred) => cred.id !== args.id);
          let updatedCred = { ...args };
          storedCredentials.push(updatedCred);
          storedCredentials = _.orderBy(storedCredentials, ['updatedAt'], ['desc']);
        }
      }
      // console.log('storedCredentials to set', storedCredentials);
      storage.set('credentials', storedCredentials, (error) => {
        if(error) {
          const message = {
            success: true,
            credentials: storedCredentials,
          };
          // console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
          mainWindow.send(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, message);
        } else {
          const message = {
            success: true,
            credentials: storedCredentials,
          };
          // console.log(`[${STORAGE_ENUMS.SAVE_CREDENTIAL}] message`, message);
          mainWindow.send(STORAGE_ENUMS.HANDLE_SAVE_CREDENTIAL, message);
        }
      })
    }
  });
});

/**
 * @param {event} // IpcMainEvent
 * @param {args} // credential id to delete
 */
ipcMain.on(STORAGE_ENUMS.DELETE_CREDENTIAL, (event, args) => {
  // console.log(`[${STORAGE_ENUMS.DELETE_CREDENTIAL}] args`, args);

  storage.get('credentials', (error, credentials) => {
    if(error) {
      const message = {
        success: false,
        error
      }
      mainWindow.send(STORAGE_ENUMS.HANDLE_DELETE_CREDENTIAL, message);
    } else {
      let existingCredential = _.find(credentials, (credential) => credential.id === args.id);
      if(!_.isEmpty(existingCredential)) {
        let updatedCredentials = _.chain(credentials).filter((credential) => credential.id !== args.id).orderBy(['updatedAt'], ['desc']).value();
        // console.log(`[${STORAGE_ENUMS.DELETE_CREDENTIAL}] updatedCredentials`, updatedCredentials)
        storage.set('credentials', updatedCredentials, (error) => {
          if(error) {
            const message = {
              success: false,
              error
            }
            mainWindow.send(STORAGE_ENUMS.HANDLE_DELETE_CREDENTIAL, message);
          } else {
            const message = {
              success: false,
              credentials: updatedCredentials
            }
            mainWindow.send(STORAGE_ENUMS.HANDLE_DELETE_CREDENTIAL, message);
          }
        })
      }
    }
  })
});


ipcMain.on(STORAGE_ENUMS.SEARCH_CREDENTIAL, (event, args) => {

  storage.get('credentials', (error, credentials) => {
    if(error) {
      const message = {
        success: false,
        error
      }
      mainWindow.send(STORAGE_ENUMS.HANDLE_SEARCH_CREDENTIAL, message);
    } else {
      let searchedCredentials = _.filter(credentials, (credential) => credential.title.toLowerCase().includes(args.toLowerCase()));
      const message = {
        success: true,
        credentials: searchedCredentials
      }
      mainWindow.send(STORAGE_ENUMS.HANDLE_SEARCH_CREDENTIAL, message);
    }
  })
})