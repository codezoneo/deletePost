let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const deleteBtn = document.getElementById('delete-btn');

const apiEndpoint = 'https://crudcrud.com/api/5c8401748b2543db85f57893770c85ed/addExpense';

addBtn.addEventListener('click', function () {
    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const date = dateInput.value;

    if (category === '') {
        alert('Please select a category');
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    if (date === '') {
        alert('Please select a date');
        return;
    }

    
    const expenseData = { category, amount, date };

    
    axios.post("https://crudcrud.com/api/5c8401748b2543db85f57893770c85ed/addNewExpense", expenseData)
        .then(data => {
        
            console.log('Expense added successfully:', data);

     
            expenses.push(expenseData);
            updateExpensesTable();
        })
        .catch(error => {
            console.error('Error adding expense:', error);
            alert('Error adding expense. Please try again.');
        });
});

function updateExpensesTable() {
    
    while (expensesTableBody.firstChild) {
        expensesTableBody.removeChild(expensesTableBody.firstChild);
    }
    totalAmount = 0;
    
    for (const expense of expenses) {
        totalAmount += parseInt(expense.amount);

        const newRow = expensesTableBody.insertRow();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function () {
            const row = this.parentNode.parentNode; 
            const category = row.cells[0].textContent;
            const amount = row.cells[1].textContent;
            const date = row.cells[2].textContent;

            
            const indexToDelete = expenses.findIndex(exp => exp.category === category &&
                parseFloat(exp.amount) === parseFloat(amount) &&
                exp.date === date);

            
            if (indexToDelete !== -1) {
                
                axios.delete(`https://crudcrud.com/api/5c8401748b2543db85f57893770c85ed/addNewExpense/${expenses[indexToDelete]._id}`)
                    .then(response => {
                        
                        console.log('Expense deleted successfully:', response);

                        // 
                        expenses.splice(indexToDelete, 1);
                        updateExpensesTable();
                    })
                    .catch(error => {
                        console.error('Error deleting expense:', error);
                        alert('Error deleting expense. Please try again.');
                    });
            } else {
                console.error('Expense not found for deletion');
                alert('Error deleting expense. Please try again.');
            }
        });

        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        deleteCell.appendChild(deleteBtn);
    }

    
    totalAmountCell.textContent = totalAmount;
}

window.addEventListener('load', function () {
    fetchExpensesFromAPI();
});

function fetchExpensesFromAPI() {
    axios.get('https://crudcrud.com/api/5c8401748b2543db85f57893770c85ed/addNewExpense')
        .then(response => {
            
            console.log('Expenses fetched successfully:', response);

            // Update local data and UI
            expenses = response.data;
            updateExpensesTable();
        })
        .catch(error => {
            console.error('Error fetching expenses:', error);
            alert('Error fetching expenses. Please try again.');
        });
}
