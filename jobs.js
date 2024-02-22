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
    aWrapper.appendChild(soButton);
    buttonDiv.appendChild(userName);
    buttonDiv.appendChild(aWrapper);
    return buttonDiv;
}

function addJobButtons(jobID) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');
    
    const editButton = document.createElement('button');
    editButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    editButton.setAttribute('id', 'edit' + jobID);
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

    buttonsDiv.appendChild(editButton);
    buttonsDiv.appendChild(shareButton);
    buttonsDiv.appendChild(delButton);

    return buttonsDiv;
}

function addDelJobToLocalStorage(delEl) {
    localStorage.setItem('delJob', getJobIDFromID(delEl.id));
    window.location.href = './delete.html';
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
            const jobID = job.jobID;
            const notes = job.notes;

            const rowHTML = `
                    <td class="item1 card-entry"><h4 class="mobile-header">Position</h4>
                        <a class="job-title-popover" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">` + jobTitle + `</a></td>
                    <td class="item2 card-entry"><h4 class="mobile-header">Company</h4>` + companyName + `</td>
                    <td class="item3 card-entry"><h4 class="mobile-header">Due</h4>` + dueDate + `</td>
                    <td class="item4 card-entry"><h4 class="mobile-header">Status</h4>
                        <a class="btn btn-secondary btn-light dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                </tr>
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
            tableParent.appendChild(row);

            const mainEl = document.querySelector('main');
            const modalEl = document.createElement('div');
            modalEl.innerHTML = modalHTML;
            mainEl.appendChild(modalEl);
        });
        
    }

    const finalRow = document.createElement('tr');
    finalRow.innerHTML = (`
        <td colspan="7" class="fill-row-mobile"><div class="padding-button"><a href="./add.html"><button class="btn btn-primary btn-lg btn-dark">Add New Job</button></a></div></td>
    `);
    const tableParent = document.getElementById('add-rows');
    tableParent.appendChild(finalRow);
}

function updateStatusTable(status, el) {
    const rowParentEl = el.parentElement.parentElement;
    el.textContent = status;

    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }
    jobs[rowParentEl.id].status = status;
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function saveNote(buttonEl) {
    const jobID = getJobIDFromID(buttonEl.id);
    const textFieldEl = document.getElementById('editableTextField' + jobID);
    const noteToAdjust = textFieldEl.value;
    let jobs = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobs = JSON.parse(jobsText);
    }
    jobs[jobID].notes = noteToAdjust;
    localStorage.setItem("jobs", JSON.stringify(jobs));
}

function getJobIDFromID(id) {
    return id.replace(/^\D+/g, '');
}

loadJobs();