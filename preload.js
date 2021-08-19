"use strict";

const { ipcRenderer, remote } = require("electron");

async function loadFonts() {
  console.log("loadFont");
  const font = new FontFace(
    "Baloo Chettan 2",
    "url(../assets/fonts/BalooChettan2-Regular.ttf)"
  );
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);
  // enable font with CSS class
  document.body.classList.add("fonts-loaded");
}

function validateRequiredFields({username, password, siteName}) {
  if (
    username == null ||
    username.trim().length == 0 ||
    password == null ||
    password.trim().length == 0 ||
    siteName == null ||
    siteName.trim().length == 0
  ) {
    return false;
  }

  return true;
}

function resetForm() {
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
  document.getElementById("siteName").value = null;
  document.getElementById("siteURL").value = null;

  document.getElementById("passwordLength").value = 12;
  document.getElementById(
    "lengthText"
  ).innerHTML = `Length 12`;
  document.getElementById("numbers").value = "on";
  document.getElementById("symbols").value = "on";
}

function loadSavedPasswords() {
  const passwords = ipcRenderer.sendSync("load:passwords");

  let passwordList = document.getElementById("password-list");

  if (passwords.length > 0) {
    passwordList.innerHTML = "";
    passwords.forEach((password) => {
      let li = document.createElement("a");
      li.classList.add(
        "list-group-item",
        "list-group-item-action",
        "cursor-pointer"
      );
      li.setAttribute("data-id-value", password.id);

      li.addEventListener("click", (e) => showSavedPassword(password));

      let div = document.createElement("div");
      div.classList.add("d-flex", "w-100", "justify-content-between");

      let h6 = document.createElement("h6");
      h6.classList.add("mb-1", "fw-bold");
      h6.innerText = password.siteName;

      let small = document.createElement("small");
      small.classList.add("text-muted");
      small.style.fontSize = "0.7rem";
      small.innerText = password.updatedDate;

      div.appendChild(h6);
      div.appendChild(small);
      li.appendChild(div);

      passwordList.appendChild(li);
    });
  }
}

function showSavedPassword(password) {
  document.getElementById("username").value = password.username;
  document.getElementById("password").value = password.password;
  document.getElementById("siteName").value = password.siteName;
  document.getElementById("siteURL").value = password.siteURL;

  document.getElementById("passwordLength").value = password.config.length;
  document.getElementById(
    "lengthText"
  ).innerHTML = `Length ${password.config.length}`;
  document.getElementById("numbers").value = password.config.numbers ? "on" : "off";
  document.getElementById("symbols").value = password.config.symbols ? "on" : "off";
}

function handleSavePassword(data) {
  let isValid = validateRequiredFields({
    username: data.username,
    password: data.password,
    siteName: data.password,
  });
  if (!isValid) {
    let alertMessage = "Please fill in the form correctly";
    alert(alertMessage);
  } else {
    let { isSaved, isNew } = ipcRenderer.sendSync("save:password", data);

    if (isSaved) {
      resetForm();
      let alertMessage = isNew ? "Password Saved" : "Password Updated";
      alert(alertMessage);
      loadSavedPasswords();
    }
  }
}

process.once("loaded", () => {
  loadFonts();
  window.addEventListener("message", ({ data }) => {
    switch(data.type) {
      case "AUTO_GEN_PASS":
        let password = ipcRenderer.sendSync("generate:password", data);
        document.getElementById("password").value = password;
        break;
      case "LOAD_PASSWORDS":
        loadSavedPasswords();
        break;
      case "SAVE_PASSWORD":
        handleSavePassword(data);
        break;
      case "RESET_FORM":
        resetForm();
        break;
      case "CLOSE_APP":
        ipcRenderer.send("app:quit")
      default:
        console.log("no such event");
        break;
    }
  });
});
