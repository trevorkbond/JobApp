function getUsername() {
    const userName = localStorage.getItem('userName');
    return userName !== '' ? userName : "Mystery User";
}

function addUserMenu() {
    const userName = document.createElement('p');
    userName.textContent = getUsername();
    const buttonDiv = document.createElement('div');
    buttonDiv.setAttribute('style', 'display: flex; flex-direction: column; justify-content: center; align-items: center;')
    const aWrapper = document.createElement('a');
    aWrapper.setAttribute('href', 'index.html');
    const soButton = document.createElement('button');
    soButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    soButton.classList.add('btn', 'btn-primary');
    soButton.textContent = 'Sign Out';
    soButton.setAttribute('onclick', 'signOut();');
    aWrapper.appendChild(soButton);
    buttonDiv.appendChild(userName);
    buttonDiv.appendChild(aWrapper);
    return buttonDiv;
}

function signOut() {
    localStorage.removeItem('userName');
}

function addJobButtons(jobID) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');
    
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    editButton.setAttribute('id', 'edit' + jobID);
    editButton.setAttribute('onclick', 'addEditJobToLocalStorage(this)');
    editButton.textContent = 'Edit';

    const delButton = document.createElement('button');
    delButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    delButton.setAttribute('id', 'del' + jobID);
    delButton.setAttribute('onclick', 'addDelJobToLocalStorage(this);');
    delButton.textContent = 'Delete';

    const shareButton = document.createElement('button');
    shareButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    shareButton.textContent = 'Share';
    shareButton.setAttribute('id', 'share' + jobID);
    shareButton.setAttribute('onclick', 'addShareJobToLocalStorage(this)');

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(shareButton);
    buttonsDiv.appendChild(delButton);

    return buttonsDiv;
}

function getNotificationEl(jobMessage) {
    const popoverDiv = document.createElement('div');
    popoverDiv.setAttribute('style', 'border-bottom: 1px solid black; margin-top: .5em;');
    const popoverText = document.createElement('p');
    popoverDiv.textContent = jobMessage;
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');
    
    const addButton = document.createElement('button');
    addButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
    addButton.setAttribute('onclick', 'addSharedJobToLocalStorage()');
    addButton.textContent = 'Add';

    const ignoreButton = document.createElement('button');
    ignoreButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
    ignoreButton.setAttribute('onclick', 'ignoreNotification(this.parentElement.parentElement);');
    ignoreButton.textContent = 'Ignore';

    buttonsDiv.appendChild(addButton);
    buttonsDiv.appendChild(ignoreButton);
    popoverDiv.appendChild(popoverText);
    popoverDiv.appendChild(buttonsDiv);

    return popoverDiv;
}

function ignoreNotification(el) {
    el.remove();
    updateNotificationIcon();
}

function updateNotificationIcon() {
    if (document.getElementById('notificationList').childElementCount !== 0) {
        document.getElementById('notificationIcon').setAttribute('src', './icons/bell.svg');
    } else {
        document.getElementById('notificationIcon').setAttribute('src', './icons/bell-slash.svg');
    }
}

function addSharedJobToLocalStorage() {
    const newJobObject = {
        title: "Software Developer Intern",
        company: "Lucid",
        date: "12/31/2024",
        status: "",
        link: "https://lucidchart.com",
        contact: "example@lucid.com",
        notes: ""
    }

    // NOTE: THESE ARE HARDCODED VALUES FOR THE TIME BEING. ACTUAL SHARED VALUES WILL BE IMPLEMENTED BY WEBSOCKETS
    
    let jobList = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobList = JSON.parse(jobsText);
    }

    jobList.push(newJobObject);
    
    localStorage.setItem("jobs", JSON.stringify(jobList));
    localStorage.setItem('sharedJob', 'true');

    const tempEl = document.createElement('p');
    tempEl.setAttribute('id', 'temp' + newJobObject.jobID);
    addEditJobToLocalStorage(tempEl);
    window.location.href = './edit.html';
}

function addDelJobToLocalStorage(delEl) {
    localStorage.setItem('delJob', getJobIDFromID(delEl.id));
    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }
    const delJob = jobs[getIndexFromJobID(getJobIDFromID(delEl.id))];
    localStorage.setItem('delJobMessage', `Are you sure you'd like to stop tracking the ${delJob.title} position at ${delJob.company}?`);
    window.location.href = './delete.html';
}

function addEditJobToLocalStorage(editEl) {
    localStorage.setItem('editJob', getJobIDFromID(editEl.id));
    window.location.href = './edit.html';
}

function addShareJobToLocalStorage(shareEl) {
    localStorage.setItem('shareJob', getJobIDFromID(shareEl.id));
    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }
    const shareJob = jobs[getIndexFromJobID(getJobIDFromID(shareEl.id))];
    localStorage.setItem('shareMessage', `Who would you like to share the ${shareJob.title} position at ${shareJob.company} with?`);
    window.location.href = './share.html';
}

async function loadJobs(refresh = false) {

    if (refresh) {
        document.getElementById('add-rows').innerHTML = "";
    }

    let jobs = [];
    try {
        let username = localStorage.getItem('userName');
        username = username === "" ? "Mystery User" : username;
        const response = await fetch(`/api/jobs/${username}`);
        jobs = await response.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch {
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobs = JSON.parse(jobsText);
        }
    }

    if (jobs.length) {
        jobs.forEach((job) => {
            addOneJobToDOM(job);
        });
        
    }
    const finalRow = document.createElement('tr');
    finalRow.innerHTML = (`
        <td colspan="7" id="finalRow" class="fill-row-mobile"><div class="padding-button"><a href="./add.html"><button class="btn btn-primary btn-lg btn-dark">Add New Job</button></a></div></td>
    `);
    const tableParent = document.getElementById('add-rows');
    tableParent.appendChild(finalRow);
}

function addOneJobToDOM(job, insertBeforeLast = false) {
    const jobTitle = job.title;
    const companyName = job.company;
    const dueDate = job.date;
    const status = job.status;
    const jobLink = job.link;
    const contact = job.contact;
    const jobID = job.jobID;
    const notes = job.notes;

    const rowHTML = `
            <td class="item1 card-entry"><h4 class="mobile-header">Position</h4>
                <a class="job-title-popover" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">` + jobTitle + `</a></td>
            <td class="item2 card-entry"><h4 class="mobile-header">Company</h4>` + companyName + `</td>
            <td class="item3 card-entry"><h4 class="mobile-header">Due</h4>` + dueDate + `</td>
            <td class="item4 card-entry"><h4 class="mobile-header">Status</h4>
                <a class="btn btn-secondary btn-light dropdown-toggle dropdown-mobile" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  ` + status + `
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" onclick="updateStatusTable('Not Applied', this.parentElement.parentElement.previousElementSibling);">Not Applied</a></li>
                  <li><a class="dropdown-item" onclick="updateStatusTable('Applied', this.parentElement.parentElement.previousElementSibling);">Applied</a></li>
                  <li><a class="dropdown-item" onclick="updateStatusTable('Invited for Interview', this.parentElement.parentElement.previousElementSibling);">Invited for Interview</a></li>
                  <li><a class="dropdown-item" onclick="updateStatusTable('Interviewed', this.parentElement.parentElement.previousElementSibling);">Interviewed</a></li>
                  <li><a class="dropdown-item" onclick="updateStatusTable('Received Offer', this.parentElement.parentElement.previousElementSibling);">Received Offer</a></li>
                  <li><a class="dropdown-item" onclick="updateStatusTable('Application Rejected', this.parentElement.parentElement.previousElementSibling);">Application Rejected</a></li>
                </ul>
            </td>
            <td class="td-center item5 card-entry"><h4 class="mobile-header">Link</h4><a href="` + jobLink + `" target="_blank"><img src="./icons/link.svg" class="table-icon"></a></td>
            <td class="td-center item6 card-entry"><h4 class="mobile-header">Contact</h4>
                <button type="button" class="no-show-button" data-bs-toggle="popover" data-bs-content="` + contact + `">
                    <img src="./icons/envelope.svg" class="table-icon">
                </button>
            </td>
            <td class="td-center item7 card-entry"><h4 class="mobile-header">Notes</h4><button class="no-show-button" data-bs-toggle="modal" data-bs-target="#noteModal` + jobID + `">
                <img src="./icons/journal.svg" class="table-icon">
            </button></td>
        `;

    const modalHTML = `
    <div class="modal fade" id="noteModal` + jobID + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Notes</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <textarea class="form-control" rows="20" id="editableTextField` + jobID + `">` + notes + `</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-dark" id="save` + jobID + `" onclick="saveNote(this);">Save Changes</button>
                </div>
            </div>
        </div>
    </div>
    `;

    const row = document.createElement('tr');
    row.setAttribute('id', jobID);
    row.innerHTML = rowHTML;

    const tableParent = document.getElementById('add-rows');
    if (!insertBeforeLast) {
        tableParent.appendChild(row);
    } else {
        const lastRow = document.getElementById('lastRow');
        if (lastRow !== null) {
            lastRow.parentNode.insertBefore(row, lastRow);
        }
    }

    const mainEl = document.querySelector('main');
    const modalEl = document.createElement('div');
    modalEl.innerHTML = modalHTML;
    mainEl.appendChild(modalEl);
}

async function updateStatusTable(status, el) {
    const rowParentEl = el.parentElement.parentElement;
    el.textContent = status;
    const jobID = rowParentEl.id;
    const editJobObject = { jobID: parseInt(jobID), user: localStorage.getItem('userName') }; 

    try {
        let username = localStorage.getItem('userName');
        username = username === "" ? "Mystery User" : username;
        const response = await fetch(`/api/jobs/${status}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
          },
            body: JSON.stringify(editJobObject),
          });
        jobs = await response.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch {
        let jobs = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobs = JSON.parse(jobsText);
        }
        jobs[getIndexFromJobID(jobID)].status = status;
        localStorage.setItem("jobs", JSON.stringify(jobs));
    }
}

async function saveNote(buttonEl) {
    const jobID = getJobIDFromID(buttonEl.id);
    const textFieldEl = document.getElementById('editableTextField' + jobID);
    const noteToAdjust = textFieldEl.value;

    const response = await fetch(`/api/jobs/single/${jobID}`);
    let foundJob = await response.json();
    foundJob.notes = noteToAdjust;

    try {
        const response = await fetch('/api/jobs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify(foundJob),
        });
        const jobs = await response.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
    } catch {
        let jobs = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobs = JSON.parse(jobsText);
        }
        jobs[getIndexFromJobID(jobID)].notes = noteToAdjust;
        localStorage.setItem("jobs", JSON.stringify(jobs));
    }
}

function getIndexFromJobID(id) {
    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }
    for (let i = 0; i < jobs.length; i++) {
        if (jobs[i].jobID === parseInt(id)) {
            return i;
        }
    }
    return -1;
}

function getJobIDFromID(id) {
    return id.replace(/^\D+/g, '');
}

function notifySharedJob() {
    const notiModal = document.getElementById('notificationList');
    const newSharedJob = getNotificationEl("AdamHubbs shared a Software Developer Intern position at Lucid with you. Would you like to add or ignore it?");
    notiModal.appendChild(newSharedJob);
    updateNotificationIcon();
}

function recreatePopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
        const popoverOptions = {};
        if (popoverTriggerEl.id === 'userPopover') {
            popoverOptions.html = true;
            popoverOptions.content = addUserMenu();
        } else if (popoverTriggerEl.classList.contains('job-title-popover')) {
            popoverOptions.html = true;
            popoverOptions.content = addJobButtons(popoverTriggerEl.parentElement.parentElement.id);
        }
        return new bootstrap.Popover(popoverTriggerEl, popoverOptions);
    });
}

async function load() {
    await loadJobs();
    recreatePopovers();
    setInterval(notifySharedJob, 10000);
}

load();