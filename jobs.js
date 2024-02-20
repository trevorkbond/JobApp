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

function loadJobs() {

    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }

    if (jobs.length) {
        jobs.forEach((job) => {
            const jobTitle = job.title;
            const companyName = job.company;
            const dueDate = job.date;
            const status = job.status;
            const jobLink = job.link;
            const contact = job.contact;
            const notes = job.notes;

            const row = document.createElement('tr');

            const posEl = document.createElement('td');
            posEl.setAttribute('class', 'item1 card-entry');
            const posElHeader = document.createElement('h4');
            posElHeader.setAttribute('class', 'mobile-header');
            posElHeader.textContent = "Position";
            posEl.appendChild(posElHeader);
            const posTitleEl = document.createElement('a');
            posTitleEl.setAttribute('class', 'job-title-popover');
            posTitleEl.setAttribute('tabindex', '0');
            posTitleEl.setAttribute('role', 'button');
            posTitleEl.setAttribute('data-bs-toggle', 'popover');
            posTitleEl.setAttribute('data-bs-trigger', 'focus');
            posTitleEl.innerHTML = jobTitle;
            posEl.appendChild(posTitleEl);
            row.appendChild(posEl);

            const companyEl = document.createElement('td');
            companyEl.setAttribute('class', 'item2 card-entry');
            const companyElHeader = document.createElement('h4');
            companyElHeader.setAttribute('class', 'mobile-header');
            companyElHeader.textContent = "Company";
            companyEl.appendChild(companyElHeader);
            companyEl.textContent = companyName;
            row.appendChild(companyEl);

            const dateEl = document.createElement('td');
            dateEl.setAttribute('class', 'item3 card-entry');
            const dateElHeader = document.createElement('h4');
            dateElHeader.setAttribute('class', 'mobile-header');
            dateElHeader.textContent = "Due";
            dateEl.appendChild(dateElHeader);
            dateEl.textContent = dueDate; //FIX THIS
            row.appendChild(dateEl);

            const statusEl = document.createElement('td');
            statusEl.setAttribute('class', 'item4 card-entry');
            const statusElHeader = document.createElement('h4');
            statusElHeader.setAttribute('class', 'mobile-header');    
            statusElHeader.textContent = "Status";
            statusEl.appendChild(statusElHeader);
            statusElDropdown = document.createElement('a');
            statusElDropdown.setAttribute('class', 'btn btn-secondary btn-light dropdown-toggle');
            statusElDropdown.setAttribute('href', '#');
            statusElDropdown.setAttribute('role', 'button');
            statusElDropdown.setAttribute('data-bs-toggle', 'dropdown');
            statusElDropdown.setAttribute('aria-expanded', 'false');
            statusElDropdown.textContent = status;
            statusElUl = document.createElement('ul');
            statusElUl.setAttribute('class', 'dropdown-menu');
            statusEl.appendChild(statusElDropdown);

            item1 = document.createElement('li');
            item1Inner = document.createElement('a');
            item1Inner.setAttribute('class', 'dropdown-item');
            item1Inner.setAttribute('href', '#');
            item1Inner.setAttribute('onclick', "updateStatusTable('Not Applied')");
            item1Inner.textContent = "Not Applied";
            item1.appendChild(item1Inner);

            item2 = document.createElement('li');
            item2Inner = document.createElement('a');
            item2Inner.setAttribute('class', 'dropdown-item');
            item2Inner.setAttribute('href', '#');
            item2Inner.setAttribute('onclick', "updateStatusTable('Applied')");
            item2Inner.textContent = "Applied";
            item2.appendChild(item2Inner);

            item3 = document.createElement('li');
            item3Inner = document.createElement('a');
            item3Inner.setAttribute('class', 'dropdown-item');
            item3Inner.setAttribute('href', '#');
            item3Inner.setAttribute('onclick', "updateStatusTable('Invited for Interview')");
            item3Inner.textContent = "Invited for Interview";
            item3.appendChild(item3Inner);

            item4 = document.createElement('li');
            item4Inner = document.createElement('a');
            item4Inner.setAttribute('class', 'dropdown-item');
            item4Inner.setAttribute('href', '#');
            item4Inner.setAttribute('onclick', "updateStatusTable('Interviewed')");
            item4Inner.textContent = "Interviewed";
            item4.appendChild(item4Inner);

            item5 = document.createElement('li');
            item5Inner = document.createElement('a');
            item5Inner.setAttribute('class', 'dropdown-item');
            item5Inner.setAttribute('href', '#');
            item5Inner.setAttribute('onclick', "updateStatusTable('Received Offer')");
            item5Inner.textContent = "Received Offer";
            item5.appendChild(item5Inner);

            item6 = document.createElement('li');
            item6Inner = document.createElement('a');
            item6Inner.setAttribute('class', 'dropdown-item');
            item6Inner.setAttribute('href', '#');
            item6Inner.setAttribute('onclick', "updateStatusTable('Application Rejected')");
            item6Inner.textContent = "Application Rejected";
            item6.appendChild(item6Inner);

            statusElUl.appendChild(item1);
            statusElUl.appendChild(item2);
            statusElUl.appendChild(item3);
            statusElUl.appendChild(item4);
            statusElUl.appendChild(item5);
            statusElUl.appendChild(item6);

            statusEl.appendChild(statusElUl);
            row.appendChild(statusEl);

            const linkEl = document.createElement('td');
            linkEl.setAttribute('class', 'td-center item5 card-entry');
            const linkElHeader = document.createElement('h4');
            linkElHeader.setAttribute('class', 'mobile-header'); 
            linkElHeader.textContent = "Link";
            linkEl.appendChild(linkElHeader);
            const link = document.createElement('a');
            link.setAttribute('href', jobLink);
            link.setAttribute('target', '_blank');
            const linkIcon = document.createElement('img');
            linkIcon.setAttribute('src', './icons/link.svg');
            linkIcon.setAttribute('class', 'table-icon');
            link.appendChild(linkIcon);
            linkEl.appendChild(link);
            row.appendChild(linkEl);

            const contactEl = document.createElement('td');
            contactEl.setAttribute('class', 'td-center item6 card-entry');
            const contactElHeader = document.createElement('h4');
            contactElHeader.setAttribute('class', 'mobile-header'); 
            contactElHeader.textContent = "Contact";
            contactEl.appendChild(contactElHeader);
            const contactButton = document.createElement('button');
            contactButton.setAttribute('type', 'button');
            contactButton.setAttribute('class', 'no-show-button');
            contactButton.setAttribute('data-bs-toggle', 'popover');
            contactButton.setAttribute('data-bs-content', contact);
            const contactIcon = document.createElement('img');
            contactIcon.setAttribute('src', './icons/envelope.svg');
            contactIcon.setAttribute('class', 'table-icon');
            contactButton.appendChild(contactIcon);
            contactEl.appendChild(contactButton);
            row.appendChild(contactEl);

            const noteEl = document.createElement('td');
            noteEl.setAttribute('class', 'td-center item7 card-entry');
            const noteElHeader = document.createElement('h4');
            noteElHeader.setAttribute('class', 'mobile-header'); 
            noteElHeader.textContent = "Notes";
            noteEl.appendChild(noteElHeader);
            const noteButton = document.createElement('button');
            noteButton.setAttribute('class', 'no-show-button');
            noteButton.setAttribute('data-bs-toggle', 'modal');
            noteButton.setAttribute('data-bs-target', '#noteModal'); // THIS NEEDS TO BE FIXED LATER
            const noteIcon = document.createElement('img');
            noteIcon.setAttribute('src', './icons/journal.svg');
            noteIcon.setAttribute('class', 'table-icon');
            noteButton.appendChild(noteIcon);
            noteEl.appendChild(noteButton);
            row.appendChild(noteEl);

            const tableParent = document.getElementById('add-rows');

            tableParent.appendChild(row);
        });
    } else {
        // do this later - display text to add job
    }
}

loadJobs();