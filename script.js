let people = JSON.parse(localStorage.getItem("people")) || [];
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

updateUI();
calculateBalances();

function saveData() {
    localStorage.setItem("people", JSON.stringify(people));
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function addPerson() {
    let name = document.getElementById("personName").value.trim();
    if (!name || people.includes(name)) return;

    people.push(name);
    document.getElementById("personName").value = "";

    saveData();
    updateUI();
}

function quickAdd() {
    let input = document.getElementById("quickInput").value.trim();
    let parts = input.split(" ");
    if (parts.length < 2) return;

    let name = parts[0];
    let amount = parseFloat(parts[1]);

    if (!people.includes(name)) people.push(name);

    expenses.push({ payer: name, amount });

    document.getElementById("quickInput").value = "";

    saveData();
    updateUI();
    calculateBalances();
}

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
}

function deletePerson(i) {
    let name = people[i];
    people.splice(i,1);
    expenses = expenses.filter(e => e.payer !== name);

    saveData();
    updateUI();
    calculateBalances();
}

function showExpenses() {
    let list = document.getElementById("expenseList");
    list.innerHTML = "";

    expenses.forEach((e,i)=>{
        let li = document.createElement("li");
        li.innerHTML = `${e.payer} ₹${e.amount}
        <button onclick="deleteExpense(${i})">❌</button>`;
        list.appendChild(li);
    });
}

function deleteExpense(i){
    expenses.splice(i,1);
    saveData();
    calculateBalances();
}

function calculateBalances() {
    let balances = {};
    people.forEach(p=>balances[p]=0);

    let total=0;
    expenses.forEach(e=>{
        total+=e.amount;
        balances[e.payer]+=e.amount;
    });

    let share = people.length ? total/people.length : 0;

    let list=document.getElementById("balanceList");
    list.innerHTML="";

    for(let p in balances){
        let val = balances[p]-share;

        let li=document.createElement("li");
        li.className = val>=0 ? "positive" : "negative";
        li.textContent = `${p}: ₹${val.toFixed(2)}`;
        list.appendChild(li);
    }

    document.getElementById("insights").innerText =
        `Total: ₹${total}\nEach: ₹${share.toFixed(2)}`;
}
