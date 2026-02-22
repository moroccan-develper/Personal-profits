let Transaction=JSON.parse(localStorage.getItem('Transaction')) || [];
function saveToLocalStorage(){
    localStorage.setItem('Transaction', JSON.stringify(Transaction));
}
let DescTr=document.getElementById('DescTr');
let amountTr=document.getElementById('amountTr');
let RadioIn=document.getElementById('RadioIn');
let RadioEx=document.getElementById('RadioEx');
let dateTr=document.getElementById('dateTr');
let addButton=document.getElementById('addButton');
let balanceTr=document.getElementById('balanceTr');
let incomeTr=document.getElementById('incomeTr');
let allowanceTr=document.getElementById('allowanceTr');
let biggestTr=document.getElementById('biggestTr');
let findTr=document.getElementById('findTr');
let filterAll=document.getElementById('filterAll');
let filterALLSpan=document.getElementById('filterALLSpan');
let filterAllowance=document.getElementById('filterAllowance');
let filterALLOWANCEspan=document.getElementById('filterALLOWANCEspan');
let filterIncome=document.getElementById('filterIncome');
let filterINCOMEspan=document.getElementById('filterINCOMEspan');
let findButton=document.getElementById('findButton');

function filterTransaction(){
    let filterTransaction;
    if(Transaction.length===0){
        return;
    }
    if(filterAll.checked){
        filterTransaction='All';
    }
    else if(filterAllowance.checked){
        filterTransaction='Expensive';
    }
    else{
        filterTransaction='Income';
    }
    let dataToShow;
    if(filterTransaction==='All'){
        dataToShow=Transaction;
    }
    else if(filterTransaction==='Expensive'){
        dataToShow=Transaction.filter(t=>t.type==='Expense');
    }
    else{
        dataToShow=Transaction.filter(t=>t.type==='Income');
    }

    let tbody=document.querySelector('tbody');
    let tableContent='';
    for(let b=0;b<dataToShow.length;b++){
        let originalIndex=Transaction.indexOf(dataToShow[b]);
        tableContent+=
        `
            <tr>
                <td>${dataToShow[b].date}</td>
                <td>${dataToShow[b].description}</td>
                <td>${dataToShow[b].amount}</td>
                <td>${dataToShow[b].type}</td>
                <td><button class="btn" onclick="deleteTransaction(${originalIndex})">delete</button></td>
            </tr>
        `;
    }
    tbody.innerHTML=tableContent;
}

function displayTransaction(){
    let tbody=document.querySelector('tbody');
    if(Transaction.length===0){
        tbody.innerHTML=
        `
            <tr>
                <td colspan="10" style="text-align:center; padding:20px;
                font-weight:500; font-style:italic;">
                    No Transaction Right Now !
                </td>
            </tr>
        `;
        balanceTr.textContent="0";
        incomeTr.textContent="0";
        allowanceTr.textContent="0";
        biggestTr.textContent="0";

        filterALLSpan.textContent="(0)";
        filterALLOWANCEspan.textContent="(0)";
        filterINCOMEspan.textContent="(0)";
    }
    else{
        let incomeTotal=0;
        let expensiveTotal=0;
        let biggestTotal=0;
        for(let u=0;u<Transaction.length;u++){
            if(Transaction[u].type==='Income'){
                incomeTotal+=Number(Transaction[u].amount);
            }
            else{
                expensiveTotal+=Number(Transaction[u].amount);
            }
            if(incomeTotal>expensiveTotal){
                biggestTotal=Number(incomeTotal);
            }
            else{
                biggestTotal=Number(expensiveTotal);
            }
        }
        let balanceTotal=Number(incomeTotal-expensiveTotal);
        
            balanceTr.textContent=balanceTotal ;
            incomeTr.textContent=incomeTotal;
            allowanceTr.textContent=expensiveTotal;
            biggestTr.textContent=biggestTotal;
            
            
            let allCount=Transaction.length;
            let IncomeCount=0;
            let ExpensiveCount=0;
            for(let e=0;e<Transaction.length;e++){
                if(Transaction[e].type==='Income'){
                    IncomeCount++;
            }
            else{
                ExpensiveCount++;
            }
        }
        
        filterALLSpan.textContent="(" +allCount+ ")";
        filterALLOWANCEspan.textContent="(" +ExpensiveCount+ ")";
        filterINCOMEspan.textContent="(" +IncomeCount+ ")";
        
        let tableContent='';
        for(let i=0;i<Transaction.length;i++){
            tableContent+=
            `
                <tr>
                    <td>${Transaction[i].date}</td>
                    <td>${Transaction[i].description}</td>
                    <td>${Transaction[i].amount}DH</td>
                    <td>${Transaction[i].type}</td>
                    <td><button onclick="deleteTransaction(${i})" class="btn">delete</button></td>
                </tr>
            `;

            }
        tbody.innerHTML=tableContent;
    }
    filterTransaction();
    saveToLocalStorage();
}
displayTransaction();

function addTransaction(){
    let description=DescTr.value.trim();
    let amount=amountTr.value.trim();
    let date=dateTr.value.trim();
    let type=RadioIn.checked ? 'Income' : 'Expense';
    
    let newTransaction={
        description:description,
        amount:amount,
        type:type,
        date:date
    }
    if(description===''||amount===''||date===''){
        alert('Write your information !!!');
        return;
    }
    Transaction.push(newTransaction);
    alert('Transaction has been added');
    filterTransaction();
    displayTransaction();
    drawChart();
    saveToLocalStorage();
    dateTr.value='';
    amountTr.value='';
    DescTr.value='';
}
function deleteTransaction(i){
    if(confirm('Sure ?')){
        Transaction.splice(i, 1);
    }
    alert('done');
    displayTransaction();
    filterTransaction();
    drawChart();
    saveToLocalStorage();
}

function findTransaction(){
    let findText=findTr.value.toLowerCase().trim();
    if(findText===''){
        filterTransaction();
        return;
    }
    let filteredByText=Transaction.filter(t=>t.description.toLowerCase().includes(findText));

    let tbody=document.querySelector('tbody');
    let tableContent='';
    for(c=0;c<filteredByText.length;c++){
        let originalIndex=Transaction.indexOf(filteredByText[c]);
        tableContent+=
        `
            <tr>
                <td>${filteredByText[c].date}</td>
                <td>${filteredByText[c].description}</td>
                <td>${filteredByText[c].amount}</td>
                <td>${filteredByText[c].type}</td>
                <td><button class="btn" onclick="deleteTransaction(${originalIndex})" >delete</button></td>
            </tr>
        `
    }
    tbody.innerHTML=tableContent;
    drawChart();
}
let myChart;
function drawChart() {
    let totalIncome = 0;
    let totalExpense = 0;
    for (let i = 0; i < Transaction.length; i++) {
        if (Transaction[i].type === 'Income') {
            totalIncome += Number(Transaction[i].amount);
        } else {
            totalExpense += Number(Transaction[i].amount);
        }
    }
    const ctx = document.getElementById('profitChart').getContext('2d');
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'المبلغ (DH)',
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    'rgba(75, 192, 75, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderColor: [
                    'rgb(0, 128, 0)',
                    'rgb(255, 0, 0)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
window.onload=function(){
addButton.addEventListener('click',addTransaction);
filterAll.addEventListener('change',filterTransaction);
filterAllowance.addEventListener('change',filterTransaction);
filterIncome.addEventListener('change',filterTransaction);
findButton.addEventListener('click',findTransaction);
}
