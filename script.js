let people = [];
let expenses = [];

// ADD PERSON
function addPerson() {
    let name = document.getElementById("personName").value.trim().toUpperCase();
    if (!name || people.includes(name)) return;

    people.push(name);
    updatePeopleUI();
}

// UPDATE PEOPLE UI
function updatePeopleUI() {
    let list = document.getElementById("peopleList");
    let payerSelect = document.getElementById("payer");

    list.innerHTML = "";
    payerSelect.innerHTML = "";

    people.forEach(p => {
        let li = document.createElement("li");
        li.innerHTML = `${p} <button onclick="removePerson('${p}')">❌</button>`;
        list.appendChild(li);

        let option = document.createElement("option");
        option.value = p;
        option.textContent = p;
        payerSelect.appendChild(option);
    });
}

// REMOVE PERSON
function removePerson(name) {
    people = people.filter(p => p !== name);
    expenses = expenses.filter(e => e.payer !== name);

    updatePeopleUI();
    updateExpenseUI();
    calculateBalances();
}

// ADD EXPENSE
function addExpense() {
    let payer = document.getElementById("payer").value;
    let amount = parseFloat(document.getElementById("amount").value);

    if (!payer || isNaN(amount)) return;

    expenses.push({ payer, amount });

    updateExpenseUI();
    calculateBalances();
    showSettlements();
}

// QUICK ADD
function quickAdd() {
    let input = document.getElementById("quickInput").value.split(" ");
    if (input.length < 2) return;

    let name = input[0].toUpperCase();
    let amount = parseFloat(input[1]);

    if (!people.includes(name)) people.push(name);

    expenses.push({ payer: name, amount });

    updatePeopleUI();
    updateExpenseUI();
    calculateBalances();
    showSettlements();
}

// EXPENSE UI
function updateExpenseUI() {
    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach((e, i) => {
        let li = document.createElement("li");
        li.innerHTML = `${e.payer} paid ₹${e.amount} 
        <button onclick="removeExpense(${i})">❌</button>`;
        list.appendChild(li);
    });
}

// REMOVE EXPENSE
function removeExpense(index) {
    expenses.splice(index, 1);
    updateExpenseUI();
    calculateBalances();
    showSettlements();
}

// CALCULATE BALANCES
function calculateBalances() {
    let balances = {};
    let total = 0;

    people.forEach(p => balances[p] = 0);

    expenses.forEach(e => {
        balances[e.payer] += e.amount;
        total += e.amount;
    });

    let share = total / people.length;

    people.forEach(p => {
        balances[p] -= share;
    });

    // UI
    let list = document.getElementById("balanceList");
    list.innerHTML = "";

    for (let p in balances) {
        let li = document.createElement("li");
        li.textContent = `${p}: ₹${balances[p].toFixed(2)}`;
        li.className = balances[p] >= 0 ? "positive" : "negative";
        list.appendChild(li);
    }

    // SUMMARY
    document.getElementById("summary").textContent =
        `Total: ₹${total}\nEach: ₹${share.toFixed(2)}`;
}

// ✅ FINAL SETTLEMENT LOGIC (PER PERSON → PERSON)
function showSettlements() {
    let settlementList = document.getElementById("settlementList");
    settlementList.innerHTML = "";

    if (people.length === 0 || expenses.length === 0) return;

    expenses.forEach(e => {
        let split = e.amount / people.length;

        people.forEach(p => {
            if (p !== e.payer) {
                let li = document.createElement("li");
                li.textContent = `${p} owes ${e.payer} ₹${split.toFixed(2)}`;
                settlementList.appendChild(li);
            }
        });
    });
}
