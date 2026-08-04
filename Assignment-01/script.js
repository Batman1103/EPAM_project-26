let balance = 25000;
let totalDeposit = 0;
let totalWithdraw = 0;

function updateDashboard() {

    document.getElementById("balance").textContent = balance;

    document.getElementById("depositTotal").textContent =
        "₹ " + totalDeposit;

    document.getElementById("withdrawTotal").textContent =
        "₹ " + totalWithdraw;

}

function addTransaction(type, amount) {

    const table = document.getElementById("history");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${type}</td>
        <td>₹ ${amount}</td>
    `;

    table.prepend(row);

}

function depositMoney() {

    let amount =
        Number(document.getElementById("amount").value);

    if (amount <= 0 || isNaN(amount)) {

        alert("Enter a valid amount.");
        return;

    }

    balance += amount;
    totalDeposit += amount;

    updateDashboard();

    addTransaction("Deposit", amount);

    document.getElementById("amount").value = "";

}

function withdrawMoney() {

    let amount =
        Number(document.getElementById("amount").value);

    if (amount <= 0 || isNaN(amount)) {

        alert("Enter a valid amount.");
        return;

    }

    if (amount > balance) {

        alert("Insufficient Balance!");
        return;

    }

    balance -= amount;
    totalWithdraw += amount;

    updateDashboard();

    addTransaction("Withdrawal", amount);

    document.getElementById("amount").value = "";

}
