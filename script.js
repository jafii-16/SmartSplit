let people = JSON.parse(localStorage.getItem("people")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

updateUI();
calculateBalances();

function saveData() {
    localStorage.setItem("people", JSON.stringify(people));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// ➕ ADD PERSON
function addPerson() {
    let name = document.getElementById("personName").value.trim();
    if (!name || people.includes(name)) return;

    people.push(name);
    document.getElementById("personName").value = "";

    saveData();
    updateUI();
}

// 💸 ADD EXPENSE
function addExpense() {
    let payer = document.getElementById("payer").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (!payer || isNaN(amount) || amount <= 0) return;

    expenses.push({ payer, amount });
    document.getElementById("amount").value = "";

    saveData();
    updateUI();
    calculateBalances();
}

// 🔄 UPDATE UI
function updateUI() {
    let peopleList = document.getElementById("peopleList");
    let payerSelect = document.getElementById("payer");

    peopleList.innerHTML = "";
    payerSelect.innerHTML = "";

    people.forEach((p, i) => {
        let li = document.createElement("li");
        li.innerHTML = `${p} <button onclick="deletePerson(${i})">❌</button>`;
        peopleList.appendChild(li);

        let opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        payerSelect.appendChild(opt);
    });

    showExpenses();
    calculateBalances();
}

// ❌ DELETE PERSON
function deletePerson(i) {
    let name = people[i];
    people.splice(i, 1);
    expenses = expenses.filter(e => e.payer !== name);

    saveData();
    updateUI();
}

// 📋 SHOW EXPENSES
function showExpenses() {
    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach((e, i) => {
        let li = document.createElement("li");
        li.innerHTML = `${e.payer} paid ₹${e.amount}
        <button onclick="deleteExpense(${i})">❌</button>`;
        list.appendChild(li);
    });
}

// ❌ DELETE EXPENSE
function deleteExpense(i) {
    expenses.splice(i, 1);
    saveData();
    updateUI();
}

// 🧠 MAIN LOGIC
function calculateBalances() {
    let balances = {};
    let totalPaid = {};
    let total = 0;

    // Initialize
    people.forEach(p => {
        balances[p] = 0;
        totalPaid[p] = 0;
    });

    // Calculate totals
    expenses.forEach(e => {
        total += e.amount;
        totalPaid[e.payer] += e.amount;
    });

    let share = people.length ? total / people.length : 0;

    // Net balance
    people.forEach(p => {
        balances[p] = totalPaid[p] - share;
    });

    showBalances(balances);
    showSettlements(balances);
    showInsights(total, share, totalPaid);
}

// 💰 BALANCES UI
function showBalances(balances) {
    let list = document.getElementById("balanceList");
    list.innerHTML = "";

    for (let p in balances) {
        let val = balances[p];

        let li = document.createElement("li");
        li.className = val >= 0 ? "positive" : "negative";
        li.textContent = `${p}: ₹${val.toFixed(2)}`;

        list.appendChild(li);
    }
}

// 🤝 SETTLEMENT LOGIC (WHO OWES WHOM)
function showSettlements(balances) {
    let settlementText = "Settlement:\n";

    let creditors = [];
    let debtors = [];

    for (let person in balances) {
        if (balances[person] > 0) {
            creditors.push({ name: person, amount: balances[person] });
        } else if (balances[person] < 0) {
            debtors.push({ name: person, amount: -balances[person] });
        }
    }

    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
        let debtor = debtors[i];
        let creditor = creditors[j];

        let min = Math.min(debtor.amount, creditor.amount);

        settlementText += `${debtor.name} owes ${creditor.name} ₹${min.toFixed(2)}\n`;

        debtor.amount -= min;
        creditor.amount -= min;

        if (debtor.amount === 0) i++;
        if (creditor.amount === 0) j++;
    }

    document.getElementById("insights").innerText += "\n" + settlementText;
}

// 📊 INSIGHTS (WHO PAID)
function showInsights(total, share, totalPaid) {
    let text = `Total Expense: ₹${total}\nEach: ₹${share.toFixed(2)}\n\nPaid:\n`;

    for (let p in totalPaid) {
        text += `${p}: ₹${totalPaid[p]}\n`;
    }

    document.getElementById("insights").innerText = text;
}
