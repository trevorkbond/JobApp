function getUsername() {
    const userName = localStorage.getItem('userName');
    return userName !== '' ? userName : "Mystery User";
}

function addJobButtons() {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');
    
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    editButton.classList.add('btn', 'btn-primary');
    editButton.textContent = 'Edit';

    const delButton = document.createElement('button');
    delButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    delButton.classList.add('btn', 'btn-primary');
    delButton.textContent = 'Delete';

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(delButton);

    return buttonsDiv;
}