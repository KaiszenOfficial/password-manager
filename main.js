const { app, BrowserWindow, ipcMain } = require("electron");
const path                            = require("path");
const fs                              = require("fs");
const { v4: uuidv4 }                  = require("uuid");
const _                               = require("lodash");
const moment                          = require("moment");

const passwordManager = require("./utils/passwordManager");

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    resizable: false,
  });

  mainWindow.loadFile("views/index.html");
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

/**
 * {args} - length, numbers, symbols
 * {return} - password
 */
ipcMain.on("generate:password", (event, args) => {
  let { length, numbers, symbols } = args;
  let password = passwordManager.generate(length, numbers, symbols);

  event.returnValue = password;
});

/**
 * {args} - null
 * {return} - all saved passwords
 */
ipcMain.on("load:passwords", (event, args) => {
  let passwordString = fs.existsSync(path.join(__dirname, ".savedata/passwords.json")) ? fs.readFileSync(
    path.join(__dirname, ".savedata/passwords.json"),
    { encoding: "utf-8" }
  ) : "";
  event.returnValue = _.isEmpty(passwordString) ? [] : JSON.parse(passwordString);
});

/**
 * {args} - username, password, siteName, siteURL
 * {return} - all saved passwords
 */
ipcMain.on("save:password", (event, args) => {
  let { username, password, siteName, siteURL } = args;

  let passwords = [];

  let passwordString = fs.existsSync(path.join(__dirname, ".savedata/passwords.json")) ? fs.readFileSync(
    path.join(__dirname, ".savedata/passwords.json"),
    { encoding: "utf-8" }
  ): "";

  passwords = _.isEmpty(passwordString) ? password : JSON.parse(passwordString);

  let existingPassword = passwords.find(
    (password) => password.siteName == siteName
  );

  if (_.isEmpty(existingPassword)) {
    //save new password
    let newPassword = {
      id: uuidv4().replace(/\-/g, ""),
      username,
      password,
      siteName,
      siteURL,
      createdDate: moment().format("ll"),
      updatedDate: moment().format("ll"),
    };

    passwords.push(newPassword);

    fs.writeFileSync(
      path.join(__dirname, ".savedata/passwords.json"),
      JSON.stringify(passwords),
      { encoding: "utf-8" }
    );

    event.returnValue = {saved: true, new: true};
  } else {
    // update existing password
    // ipcMain.emit("override:password")
    let updatedPassword = {
      ...existingPassword,
      username,
      password,
      siteName,
      siteURL,
      updatedDate: moment().format("ll"),
    };

    passwords = passwords.filter(
      (password) => password.siteName != siteName
    );

    passwords.push(updatedPassword);

    fs.writeFileSync(
      path.join(__dirname, ".savedata/passwords.json"),
      JSON.stringify(passwords),
      { encoding: "utf-8" }
    );

    event.returnValue = {saved: true, new: false};
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
