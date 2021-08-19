// load saved passwords
window.postMessage({ type: "LOAD_PASSWORDS" });

let passwordLength = document.getElementById("passwordLength");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");

let hasNumbers = numbers.value == "on" ? true : false;
let hasSymbols = symbols.value == "on" ? true : false;

passwordLength.addEventListener("change", (e) => {
  document.getElementById(
    "lengthText"
  ).innerHTML = `Length (${e.target.value})`;
});

numbers.addEventListener("change", (e) => {
  hasNumbers = e.target.checked;
});

symbols.addEventListener("change", (e) => {
  hasSymbols = e.target.checked;
});

document.getElementById("autoGenerateBtn").addEventListener("click", (e) => {
  //   e.preventDefault();
  const payload = {
    type: "AUTO_GEN_PASS",
    length: passwordLength.value,
    numbers: hasNumbers,
    symbols: hasSymbols,
  };
  window.postMessage(payload);
});

function validateFormFields(username, password, siteName) {
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

document.getElementById("saveBtn").addEventListener("click", (e) => {
  e.preventDefault();

  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  let siteName = document.getElementById("siteName").value;
  let siteURL = document.getElementById("siteURL").value;

  if (validateFormFields(username, password, siteName)) {
    const payload = {
      type: "SAVE_PASSWORD",
      username,
      password,
      siteName,
      siteURL,
      length: passwordLength.value,
      numbers: hasNumbers,
      symbols: hasSymbols,
    };

    window.postMessage(payload);
  } else {
    alert("Please check the form");
  }
});

function resetForm() {
  document.getElementById("username").value = null;
  document.getElementById("password").value = null;
  document.getElementById("siteName").value = null;
  document.getElementById("siteURL").value = null;

  document.getElementById("passwordLength").value = 8;
  document.getElementById("numbers").value = "on";
  document.getElementById("symbols").value = "on";
}

document.getElementById("resetBtn").addEventListener("click", (e) => {
  e.preventDefault();
  resetForm();
});
