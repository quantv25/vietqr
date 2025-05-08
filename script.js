
const settingsBtn = document.getElementById("settingsBtn");
const main = document.getElementById("main");
const settings = document.getElementById("settings");
const backBtn = document.getElementById("backBtn");
const saveSettings = document.getElementById("saveSettings");
const accountSelect = document.getElementById("accountSelect");
const generateBtn = document.getElementById("generateBtn");
const shareBtn = document.getElementById("shareBtn");
const finalImage = document.getElementById("finalImage");

function loadSettings() {
  accountSelect.innerHTML = "";
  for (let i = 1; i <= 2; i++) {
    const alias = localStorage.getItem(`alias${i}`);
    const bank = localStorage.getItem(`bank${i}`);
    const name = localStorage.getItem(`name${i}`);
    const stk = localStorage.getItem(`stk${i}`);
    if (alias && bank && name && stk) {
      const opt = document.createElement("option");
      opt.value = JSON.stringify({ bank, name, stk });
      opt.textContent = alias;
      accountSelect.appendChild(opt);
    }
  }
}

settingsBtn.onclick = () => {
  main.style.display = "none";
  settings.style.display = "block";
  for (let i = 1; i <= 2; i++) {
    document.getElementById(`alias${i}`).value = localStorage.getItem(`alias${i}`) || "";
    document.getElementById(`bank${i}`).value = localStorage.getItem(`bank${i}`) || "";
    document.getElementById(`name${i}`).value = localStorage.getItem(`name${i}`) || "";
    document.getElementById(`stk${i}`).value = localStorage.getItem(`stk${i}`) || "";
  }
};

backBtn.onclick = () => {
  settings.style.display = "none";
  main.style.display = "block";
  loadSettings();
};

saveSettings.onclick = () => {
  for (let i = 1; i <= 2; i++) {
    localStorage.setItem(`alias${i}`, document.getElementById(`alias${i}`).value);
    localStorage.setItem(`bank${i}`, document.getElementById(`bank${i}`).value);
    localStorage.setItem(`name${i}`, document.getElementById(`name${i}`).value);
    localStorage.setItem(`stk${i}`, document.getElementById(`stk${i}`).value);
  }
  alert("Đã lưu cài đặt");
};

generateBtn.onclick = async () => {
  const selected = JSON.parse(accountSelect.value || "{}");
  const amount = document.getElementById("amount").value;
  const message = document.getElementById("message").value;

  if (!selected.stk || !selected.bank || !selected.name) return alert("Chưa chọn tài khoản!");

  const qrUrl = `https://img.vietqr.io/image/${selected.bank}-${selected.stk}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(selected.name)}`;

  finalImage.src = qrUrl;
  finalImage.style.display = "block";
  shareBtn.style.display = "block";
};

shareBtn.onclick = async () => {
  const selected = JSON.parse(accountSelect.value || "{}");
  const amount = document.getElementById("amount").value;
  const message = document.getElementById("message").value;

  const qrUrl = `https://img.vietqr.io/image/${selected.bank}-${selected.stk}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(selected.name)}`;

  const response = await fetch(qrUrl);
  const blob = await response.blob();
  const file = new File([blob], "vietqr.jpg", { type: "image/jpeg" });

  if (navigator.share) {
    navigator.share({
      files: [file],
      title: "Mã VietQR",
      text: "Quét mã để chuyển khoản"
    }).catch(console.error);
  } else {
    alert("Thiết bị không hỗ trợ chia sẻ ảnh trực tiếp");
  }
};

window.onload = loadSettings;
