const fileList = document.getElementById("fileList");
const filenameInput = document.getElementById("filename");
const langSelect = document.getElementById("language");
const codeArea = document.getElementById("codeArea");
const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const copyBtn = document.getElementById("copyBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

let isAdmin = false;
let currentFile = null;

// Load all files
function loadFiles() {
  fileList.innerHTML = "";
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("code_")) {
      const data = JSON.parse(localStorage.getItem(key));
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.textContent = `${data.name} (${data.lang})`;
      li.onclick = () => openFile(key);
      fileList.appendChild(li);
    }
  });
}

// Filter files by type
function filterFiles(type) {
  fileList.innerHTML = "";
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("code_")) {
      const data = JSON.parse(localStorage.getItem(key));
      if (data.lang === type) {
        const li = document.createElement("li");
        li.className = "list-group-item list-group-item-action";
        li.textContent = `${data.name} (${data.lang})`;
        li.onclick = () => openFile(key);
        fileList.appendChild(li);
      }
    }
  });
}

// Open file
function openFile(key) {
  const data = JSON.parse(localStorage.getItem(key));
  currentFile = key;
  filenameInput.value = data.name;
  langSelect.value = data.lang;
  codeArea.value = data.code;
}

// Generate unique ID
function generateCodeId() { return "code_" + Math.floor(Math.random()*1000000); }

// Save file (admin only)
function saveFile() {
  if (!isAdmin) return alert("Only admin can save!");
  const name = filenameInput.value.trim();
  const lang = langSelect.value;
  const code = codeArea.value;
  if (!name) return alert("Enter filename!");
  const id = currentFile || generateCodeId();
  localStorage.setItem(id, JSON.stringify({name,lang,code}));
  loadFiles();
  alert("✅ Code saved!");
}

// Delete file (admin only)
function deleteFile() {
  if (!isAdmin) return;
  if (currentFile && confirm("Delete this code?")) {
    localStorage.removeItem(currentFile);
    filenameInput.value = "";
    codeArea.value = "";
    loadFiles();
  }
}

// Copy code
function copyCode() {
  codeArea.select();
  document.execCommand("copy");
  alert("📋 Code copied!");
}

// Admin login
function adminLogin() {
  const pass = prompt("Enter admin password:");
  if (pass === "dhanush@2006") {
    isAdmin = true;
    toggleAdminUI(true);
    alert("Welcome, Admin!");
  } else alert("❌ Wrong password! Read-only mode.");
}

// Admin logout
function adminLogout() {
  isAdmin = false;
  toggleAdminUI(false);
  alert("Logged out.");
}

// Toggle admin controls
function toggleAdminUI(admin) {
  loginBtn.classList.toggle("d-none", admin);
  logoutBtn.classList.toggle("d-none", !admin);
  saveBtn.classList.toggle("d-none", !admin);
  deleteBtn.classList.toggle("d-none", !admin);
  filenameInput.disabled = !admin;
  langSelect.disabled = !admin;
  codeArea.readOnly = !admin;
  codeArea.classList.toggle("readonly", !admin);
}

// Event Listeners
saveBtn.onclick = saveFile;
deleteBtn.onclick = deleteFile;
copyBtn.onclick = copyCode;
loginBtn.onclick = adminLogin;
logoutBtn.onclick = adminLogout;

// Initialize
loadFiles();
