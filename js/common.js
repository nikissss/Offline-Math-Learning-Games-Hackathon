
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
