// load saved passwords
window.onload = window.postMessage({ type: "LOAD_PASSWORDS" });

let lengthEl  = document.getElementById("passwordLength");
let numbersEl = document.getElementById("numbers");
let symbolsEl = document.getElementById("symbols");

let hasNumbers = numbersEl.value == "on" ? true : false;
let hasSymbols = symbolsEl.value == "on" ? true : false;

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

/** Setup initial parameters for generating password
 * Default will always be null on initialization
 */
let siteNameEl = document.getElementById("siteName");
let siteUrlEl  = document.getElementById("siteURL");
let usernameEl = document.getElementById("username");
let passwordEl = document.getElementById("password");

let autoGenBtn = document.getElementById("autoGenerateBtn");
let saveBtn = document.getElementById("saveBtn");
let resetBtn = document.getElementById("resetBtn");
let closeBtn = document.getElementById("closeBtn");

autoGenBtn.addEventListener("click", (e) => {
  //   e.preventDefault();
  const payload = {
    type: "AUTO_GEN_PASS",
    config: {
      length: passwordLength.value,
      numbers: hasNumbers,
      symbols: hasSymbols,
    },
  };
  window.postMessage(payload);
});

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const payload = {
    type: "SAVE_PASSWORD",
    username: usernameEl.value,
    password: passwordEl.value,
    siteName: siteNameEl.value,
    siteURL: siteUrlEl.value,
    config: {
      length: passwordLength.value,
      numbers: hasNumbers,
      symbols: hasSymbols,
    },
  };

  window.postMessage(payload);
});

resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.postMessage({ type: "RESET_FORM" })
});

passwordEl.addEventListener("click", (e) => {
  e.preventDefault();

  if(passwordEl.value) {
    // copy text to clipboard
  }
});

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();

  window.postMessage({ type: "CLOSE_APP" });
})