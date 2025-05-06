
const settingsBtn = document.getElementById("settingsBtn");
const main = document.getElementById("main");
const settings = document.getElementById("settings");
const backBtn = document.getElementById("backBtn");
const saveSettings = document.getElementById("saveSettings");
const accountSelect = document.getElementById("accountSelect");
const generateBtn = document.getElementById("generateBtn");
const shareBtn = document.getElementById("shareBtn");
const qrCanvas = document.getElementById("qrCanvas");

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

generateBtn.onclick = () => {
  const ctx = qrCanvas.getContext("2d");
  const selected = JSON.parse(accountSelect.value || "{}");
  const amount = document.getElementById("amount").value;
  const message = document.getElementById("message").value;

  if (!selected.stk || !selected.bank || !selected.name) return alert("Chưa chọn tài khoản!");

  const qrUrl = `https://img.vietqr.io/image/${selected.bank}-${selected.stk}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(message)}&accountName=${encodeURIComponent(selected.name)}`;
  const qr = new QRious({
    value: qrUrl,
    size: 200
  });

  ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
  ctx.drawImage(qr.image, 100, 20, 200, 200);

  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Ngân hàng: ${selected.bank}`, 20, 250);
  ctx.fillText(`Chủ TK: ${selected.name}`, 20, 280);
  ctx.fillText(`Số TK: ${selected.stk}`, 20, 310);
  ctx.fillText(`Số tiền: ${amount} VND`, 20, 340);
  ctx.fillText(`Nội dung: ${message}`, 20, 370);

  shareBtn.style.display = "block";
};

shareBtn.onclick = () => {
  qrCanvas.toBlob(blob => {
    const file = new File([blob], "vietqr.png", { type: "image/png" });
    if (navigator.share) {
      navigator.share({
        files: [file],
        title: "Mã VietQR",
        text: "Quét mã QR để chuyển khoản"
      }).catch(console.error);
    } else {
      alert("Thiết bị không hỗ trợ chia sẻ ảnh trực tiếp");
    }
  });
};

window.onload = loadSettings;
