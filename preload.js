const { ipcRenderer } = require("electron");

async function loadFonts() {
  console.log('loadFont')
  const font = new FontFace('Baloo Chettan 2', 'url(../assets/fonts/BalooChettan2-Regular.ttf)');
  // wait for font to be loaded
  await font.load();
  // add font to document
  document.fonts.add(font);
  // enable font with CSS class
  document.body.classList.add('fonts-loaded');
}

function resetForm() {
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
  document.getElementById("siteName").value = null;
  document.getElementById("siteURL").value = null;

  document.getElementById("passwordLength").value = 8;
  document.getElementById("numbers").value = "on";
  document.getElementById("symbols").value = "on";
}

function openAlertModal() {
  document.body.classList.add("modal-open");
  let modal = document.getElementById("alert-modal");

  modal.style.display = "block";
  modal.classList.add("show");

  setTimeout(() => {
    closeAlertModal()
  }, 3000);
}

function closeAlertModal() {
  document.body.classList.remove("modal-open");
  let modal = document.getElementById("alert-modal");

  modal.style.display = "none";
  modal.classList.remove("show");
}

function loadSavedPasswords() {
  const passwords = ipcRenderer.sendSync("load:passwords");

  let passwordList = document.getElementById("password-list");

  if(passwords.length > 0) {
    passwordList.innerHTML = "";
    passwords.forEach(password => {
      let li = document.createElement("a");
      li.classList.add("list-group-item", "list-group-item-action", "cursor-pointer");
      li.setAttribute("data-id-value", password.id);

      li.addEventListener("click", (e) => handleLoadSavedPassword(password))

      let div = document.createElement("div");
      div.classList.add("d-flex", "w-100", "justify-content-between");

      let h6 = document.createElement("h6");
      h6.classList.add("mb-1", "fw-bold");
      h6.innerText = password.siteName;

      let small = document.createElement("small");
      small.classList.add("text-muted");
      small.style.fontSize = "0.7rem"
      small.innerText = password.updatedDate;

      div.appendChild(h6);
      div.appendChild(small);
      li.appendChild(div);

      passwordList.appendChild(li);
    });

  }
}


function handleLoadSavedPassword(password) {
  console.log(password);

  document.getElementById("username").value = password.username;
  document.getElementById("password").value = password.password;
  document.getElementById("siteName").value = password.siteName;
  document.getElementById("siteURL").value = password.siteURL;
}

process.once("loaded", () => {
  loadFonts();
  window.addEventListener("message", ({ data }) => {
    // do something with custom event
    if(data.type === "AUTO_GEN_PASS") {
      let password = ipcRenderer.sendSync("generate:password", data);

      document.getElementById("password").value = password;
    }

    if(data.type == "LOAD_PASSWORDS") {
      loadSavedPasswords();
    }

    if(data.type == "SAVE_PASSWORD") {
      let response = ipcRenderer.sendSync("save:password", data);
      console.log(response);
      if(response.saved) {
        resetForm();
        let alertMessage = response.new ? "Password Saved!" : "Password Updated"
        alert(alertMessage);
      }
    }

    if(data.type == "UPDATE_PASSWORD") {
      let saved = ipcRenderer.sendSync("update:password", data);

      if(saved) {
        resetForm();
        loadSavedPasswords();
        openAlertModal();
      }
    }
  });
});

