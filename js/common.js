
const WALLET_KEY = 'omg_wallet_points_v1';
function getWallet() { return parseInt(localStorage.getItem(WALLET_KEY) || '0', 10); }
function setWallet(v) { localStorage.setItem(WALLET_KEY, String(Math.max(0, Math.floor(v)))); renderWallet(); }
function addWallet(delta) { setWallet(getWallet() + delta); }
const INV_KEY = 'omg_inventories_v1';
function getInv() { try { return JSON.parse(localStorage.getItem(INV_KEY) || '{}') } catch (e) { return {} } }
function setInv(obj) { localStorage.setItem(INV_KEY, JSON.stringify(obj)); }
function invFor(theme) { const inv = getInv(); inv[theme] = inv[theme] || { eggs: [], creatures: [], ingredients: [], items: [] }; setInv(inv); return inv[theme]; }
function saveInv(theme, data) { const inv = getInv(); inv[theme] = data; setInv(inv); }
function renderWallet() { document.querySelectorAll('[data-wallet]').forEach(e => e.textContent = getWallet()); }
document.addEventListener('DOMContentLoaded', renderWallet);
// Create toast container once
if (!document.getElementById('toast')) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 8px 16px;
    border-radius: 6px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
    z-index: 9999;
  `;
    document.body.appendChild(toast);
}

// Reusable toast function
function showToast(msg, duration = 1500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.style.opacity = 1;
    setTimeout(() => {
        toast.style.opacity = 0;
    }, duration);
}

function showPopup({
    message = "Simple popup!",
    redirectUrl = null,
    buttonText = "Go to page"
} = {}) {
    // Remove existing popup if already shown
    const existing = document.getElementById("popup-overlay");
    if (existing) existing.remove();

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = "popup-overlay";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    `;

    // Create popup
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: relative;
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        width: 300px;
        text-align: center;
        font-family: sans-serif;
    `;

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = "X";
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        width: 25px;
        height: 25px;
        border: none;
        border-radius: 50%;
        background: #ccc;
        cursor: pointer;
        font-weight: bold;
    `;
    closeBtn.onclick = () => overlay.remove();

    // Message
    const msg = document.createElement('p');
    msg.textContent = message;

    // Redirect button
    if (redirectUrl) {
        const redirectBtn = document.createElement('button');
        redirectBtn.textContent = buttonText;
        redirectBtn.style.cssText = `
            padding: 10px 20px;
            margin-top: 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: #007bff;
            color: #fff;
        `;
        redirectBtn.onclick = () => window.location.href = redirectUrl;
        popup.appendChild(redirectBtn);
    }

    // Append elements
    popup.appendChild(closeBtn);
    popup.appendChild(msg);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}
