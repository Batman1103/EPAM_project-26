/* =========================================================
   SecureBank Customer Dashboard - script.js
   Handles: customer data, balance, transactions, validation,
            history rendering, and localStorage persistence.
   ========================================================= */

// ---------- Sample Customer Data ----------
// In a real application this would come from a server/API.
const customer = {
  name: "Harshit Namdev",
  accountNumber: "SB" + "4821736590",
  accountType: "Savings Account",
  email: "harshitnamdev2006@gmail.com"
};

const STORAGE_KEY_BALANCE = "bank_balance";
const STORAGE_KEY_HISTORY = "bank_history";
const STARTING_BALANCE = 25000;

// Demo login credentials.
// (In a real banking app this check would happen securely on a server —
// here it is simplified for learning purposes, using plain JS variables.)
const VALID_USERNAME = "harshit";
const VALID_PASSWORD = "123";

// ---------- DOM References: Login ----------
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const loginForm = document.getElementById("loginForm");
const loginUsernameEl = document.getElementById("loginUsername");
const loginPasswordEl = document.getElementById("loginPassword");
const loginErrorEl = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");

// ---------- DOM References: Dashboard ----------
const customerNameEl = document.getElementById("customerName");
const accountNumberEl = document.getElementById("accountNumber");
const accountTypeEl = document.getElementById("accountType");
const customerEmailEl = document.getElementById("customerEmail");
const avatarInitialsEl = document.getElementById("avatarInitials");
const navUserNameEl = document.getElementById("navUserName");

const balanceAmountEl = document.getElementById("balanceAmount");
const lastUpdatedEl = document.getElementById("lastUpdated");
const toggleBalanceBtn = document.getElementById("toggleBalanceBtn");

const transactionForm = document.getElementById("transactionForm");
const transactionTypeEl = document.getElementById("transactionType");
const amountInputEl = document.getElementById("amountInput");
const amountErrorEl = document.getElementById("amountError");
const remarksInputEl = document.getElementById("remarksInput");
const formFeedbackEl = document.getElementById("formFeedback");

const historyBody = document.getElementById("historyBody");
const noHistoryMsg = document.getElementById("noHistoryMsg");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// ---------- State ----------
let balance = 0;
let history = [];
let isBalanceVisible = true;

// ---------- Initialization ----------
// The app starts on the login screen. The dashboard only becomes
// visible after handleLogin() successfully validates the credentials.
function init() {
  attachEventListeners();
}

// ---------- Login / Logout Logic ----------
function handleLogin(event) {
  // preventDefault() stops the browser's default "reload the page"
  // behaviour that normally happens when a <form> is submitted.
  event.preventDefault();

  const enteredUsername = loginUsernameEl.value.trim();
  const enteredPassword = loginPasswordEl.value;

  // Simple conditional check against the demo credentials.
  if (enteredUsername === VALID_USERNAME && enteredPassword === VALID_PASSWORD) {
    loginErrorEl.textContent = "";
    showDashboard();
  } else {
    loginErrorEl.textContent = "Invalid username or password. Please try again.";
  }
}

function showDashboard() {
  // Toggle visibility by adding/removing the "hidden" CSS class.
  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");

  // Load and render the customer's data only once they are logged in.
  loadCustomerProfile();
  loadState();
  renderBalance();
  renderHistory();
}

function handleLogout() {
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  loginForm.reset();
}

// ---------- Profile Rendering ----------
function loadCustomerProfile() {
  customerNameEl.textContent = customer.name;
  accountNumberEl.textContent = maskAccountNumber(customer.accountNumber);
  accountTypeEl.textContent = customer.accountType;
  customerEmailEl.textContent = customer.email;
  navUserNameEl.textContent = "Welcome, " + customer.name.split(" ")[0];
  avatarInitialsEl.textContent = getInitials(customer.name);
}

function getInitials(fullName) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function maskAccountNumber(accNum) {
  const visible = accNum.slice(-4);
  return "XXXX-XXXX-" + visible;
}

// ---------- State Persistence ----------
function loadState() {
  const savedBalance = localStorage.getItem(STORAGE_KEY_BALANCE);
  const savedHistory = localStorage.getItem(STORAGE_KEY_HISTORY);

  balance = savedBalance !== null ? parseFloat(savedBalance) : STARTING_BALANCE;
  history = savedHistory !== null ? JSON.parse(savedHistory) : [];
}

function saveState() {
  localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
  localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
}

// ---------- Balance Rendering ----------
function renderBalance() {
  balanceAmountEl.textContent = isBalanceVisible
    ? formatCurrency(balance)
    : "₹ ••••••";
  lastUpdatedEl.textContent = new Date().toLocaleString("en-IN");
}

function formatCurrency(value) {
  return "₹ " + value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// ---------- Transaction Handling ----------
function handleTransactionSubmit(event) {
  // Stop the form from refreshing the page on submit.
  event.preventDefault();
  clearFeedback();

  // Read current values straight from the form inputs.
  const type = transactionTypeEl.value;             // "deposit" or "withdraw"
  const amount = parseFloat(amountInputEl.value);    // convert string -> number
  const remarks = remarksInputEl.value.trim() || "-"; // default remark if left blank

  // Run validation before touching the balance at all.
  if (!validateAmount(amount, type)) {
    return; // stop here if validation fails
  }

  // Update the balance based on transaction type (if / else branching).
  if (type === "deposit") {
    balance += amount;
  } else {
    balance -= amount;
  }

  const transaction = {
    date: new Date().toLocaleString("en-IN"),
    type: type,
    remarks: remarks,
    amount: amount
  };

  history.unshift(transaction); // newest first
  saveState();
  renderBalance();
  renderHistory();

  showFeedback(
    `${type === "deposit" ? "Deposit" : "Withdrawal"} of ${formatCurrency(amount)} successful.`,
    "success"
  );

  transactionForm.reset();
}

function validateAmount(amount, type) {
  amountErrorEl.textContent = "";

  if (isNaN(amount) || amount <= 0) {
    amountErrorEl.textContent = "Please enter a valid amount greater than 0.";
    return false;
  }

  if (amount > 1000000) {
    amountErrorEl.textContent = "Amount exceeds the maximum transaction limit (₹10,00,000).";
    return false;
  }

  if (type === "withdraw" && amount > balance) {
    amountErrorEl.textContent = "Insufficient balance for this withdrawal.";
    return false;
  }

  return true;
}

// ---------- History Rendering ----------
function renderHistory() {
  historyBody.innerHTML = "";

  if (history.length === 0) {
    noHistoryMsg.style.display = "block";
    return;
  }

  noHistoryMsg.style.display = "none";

  history.forEach((tx) => {
    const row = document.createElement("tr");

    const amountClass = tx.type === "deposit" ? "amount-deposit" : "amount-withdraw";
    const amountSign = tx.type === "deposit" ? "+" : "-";

    row.innerHTML = `
      <td>${tx.date}</td>
      <td><span class="type-badge ${tx.type}">${tx.type}</span></td>
      <td>${escapeHtml(tx.remarks)}</td>
      <td class="${amountClass}">${amountSign} ${formatCurrency(tx.amount)}</td>
    `;

    historyBody.appendChild(row);
  });
}

// Basic protection against HTML injection in remarks field
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- UI Helpers ----------
function showFeedback(message, type) {
  formFeedbackEl.textContent = message;
  formFeedbackEl.className = "feedback-msg " + type;
}

function clearFeedback() {
  formFeedbackEl.textContent = "";
  formFeedbackEl.className = "feedback-msg";
  amountErrorEl.textContent = "";
}

function toggleBalanceVisibility() {
  isBalanceVisible = !isBalanceVisible;
  toggleBalanceBtn.textContent = isBalanceVisible ? "Hide" : "Show";
  renderBalance();
}

function clearHistory() {
  const confirmed = confirm("Are you sure you want to clear all transaction history? This cannot be undone.");
  if (!confirmed) return;

  history = [];
  saveState();
  renderHistory();
  showFeedback("Transaction history cleared.", "success");
}

// ---------- Event Listeners ----------
function attachEventListeners() {
  loginForm.addEventListener("submit", handleLogin);
  logoutBtn.addEventListener("click", handleLogout);

  transactionForm.addEventListener("submit", handleTransactionSubmit);
  toggleBalanceBtn.addEventListener("click", toggleBalanceVisibility);
  clearHistoryBtn.addEventListener("click", clearHistory);

  // Live-clear amount error while typing
  amountInputEl.addEventListener("input", () => {
    amountErrorEl.textContent = "";
  });
}

// ---------- Start App ----------
document.addEventListener("DOMContentLoaded", init);
