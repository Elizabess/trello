document.addEventListener('DOMContentLoaded', () => {
    const columns = document.querySelectorAll('.column');

    columns.forEach(column => {
        const addCardButton = column.querySelector('.add-card');
        addCardButton.addEventListener('click', () => {
            const cardText = prompt('Enter card text:');
            if (cardText) {
                addCard(column, cardText);
                saveState();
            }
        });
        
        const cardsContainer = column.querySelector('.cards');
        cardsContainer.addEventListener('dragover', (e) => e.preventDefault());
        cardsContainer.addEventListener('drop', (e) => {
            const cardId = e.dataTransfer.getData('text/plain');
            const card = document.getElementById(cardId);
            cardsContainer.appendChild(card);
            saveState();
        });
    });

    loadState();
});

function addCard(column, text) {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = text;
    card.setAttribute('draggable', true);
    
    const removeBtn = document.createElement('span');
    removeBtn.textContent = '✖️';
    removeBtn.className = 'remove';
    removeBtn.onclick = () => {
        card.remove();
        saveState();
    };
    
    card.appendChild(removeBtn);
    
    card.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
    });

    column.querySelector('.cards').appendChild(card);
}

function saveState() {
    const state = {};
    
    document.querySelectorAll('.column').forEach(column => {
        const columnId = column.dataset.columnId;
        state[columnId] = Array.from(column.querySelectorAll('.card')).map(card => card.textContent.replace('✖️', '').trim());
    });
    
    localStorage.setItem('trelloState', JSON.stringify(state));
}

function loadState() {
    const state = JSON.parse(localStorage.getItem('trelloState'));
    
    function loadState() {
        const state = JSON.parse(localStorage.getItem('trelloState'));
        
        if (state) {
            Object.keys(state).forEach(columnId => {
                const column = document.querySelector(`.column[data-column-id="${columnId}"]`);
                state[columnId].forEach(text => addCard(column, text));
            });
        }
    }
}
