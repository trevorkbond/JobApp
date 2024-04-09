import React, { useEffect } from 'react';
import { Popover } from 'bootstrap/dist/js/bootstrap.esm.min.js';
import '../app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';

export function Jobs() {

    useEffect(() => {
        load();
        configureWebSocket();
        loadSharedJobsFromDB();
    }, []);

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
        soButton.onclick = signOut;
        aWrapper.appendChild(soButton);
        buttonDiv.appendChild(userName);
        buttonDiv.appendChild(aWrapper);
        return buttonDiv;
    }

    function signOut() {
        localStorage.removeItem('userName');
        localStorage.removeItem('sharedJobList');
        fetch(`/api/auth/logout`, {
            method: 'delete',
        }).then(() => (window.location.href = '/'));
    }

    function addJobButtons(jobID) {
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons-container');

        const editButton = document.createElement('button');
        editButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
        editButton.setAttribute('id', 'edit' + jobID);
        editButton.onclick = () => addEditJobToLocalStorage(this);
        editButton.textContent = 'Edit';

        const delButton = document.createElement('button');
        delButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
        delButton.setAttribute('id', 'del' + jobID);
        delButton.onclick = () => addDelJobToLocalStorage(this);
        delButton.textContent = 'Delete';

        const shareButton = document.createElement('button');
        shareButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
        shareButton.textContent = 'Share';
        shareButton.setAttribute('id', 'share' + jobID);
        shareButton.setAttribute('data-bs-toggle', 'modal');
        shareButton.setAttribute('data-bs-target', '#shareModal');
        shareButton.onclick = () => addShareJobIDLocalStorage(this);

        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(shareButton);
        buttonsDiv.appendChild(delButton);

        return buttonsDiv;
    }

    function getNotificationEl(jobMessage, index) {
        const popoverDiv = document.createElement('div');
        popoverDiv.setAttribute('style', 'border-bottom: 1px solid black; margin-top: .5em;');
        const popoverText = document.createElement('p');
        popoverDiv.textContent = jobMessage;
        const buttonsDiv = document.createElement('div');
        buttonsDiv.classList.add('buttons-container');

        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
        addButton.onclick = addSharedJobToLocalStorage(this.parentElement.parentElement);
        addButton.textContent = 'Add';

        const ignoreButton = document.createElement('button');
        ignoreButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
        ignoreButton.onclick = ignoreNotification(this.parentElement.parentElement);
        ignoreButton.textContent = 'Ignore';

        buttonsDiv.appendChild(addButton);
        buttonsDiv.appendChild(ignoreButton);
        popoverDiv.appendChild(popoverText);
        popoverDiv.appendChild(buttonsDiv);
        popoverDiv.setAttribute('id', 'noti' + index);

        return popoverDiv;
    }

    async function ignoreNotification(el) {

        const delJob = sharedJobList[getJobIDFromID(el.id)];

        sharedJobList.splice(getJobIDFromID(el.id), 1);
        localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));

        const response = await fetch('/api/jobs/shared', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(delJob),
        });

        updateSharedJobDOM();

    }

    function updateNotificationIcon() {
        if (document.getElementById('notificationList').childElementCount !== 0) {
            document.getElementById('notificationIcon').setAttribute('src', './icons/bell.svg');
        } else {
            document.getElementById('notificationIcon').setAttribute('src', './icons/bell-slash.svg');
        }
    }

    function updateSharedJobs(sharedJob) {
        const sharedJobListText = localStorage.getItem('sharedJobList');
        if (sharedJobListText) {
            sharedJobList = JSON.parse(sharedJobListText);
            sharedJobList.push(sharedJob);
            localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));
        } else {
            sharedJobList.push(sharedJob);
            localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));
        }
    }

    function addSharedJobToLocalStorage(newJobEl) {
        const index = getJobIDFromID(newJobEl.id);
        localStorage.setItem('sharedJob', 'true');

        const tempEl = document.createElement('p');
        tempEl.setAttribute('id', 'temp' + index);
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

    function addShareJobIDLocalStorage(shareEl) {
        localStorage.setItem('shareJob', getJobIDFromID(shareEl.id));
    }

    async function shareJob() {
        const shareJobID = localStorage.getItem('shareJob');
        localStorage.removeItem('shareJob');
        const response = await fetch(`/api/jobs/single/${shareJobID}`);
        let foundJob = await response.json();
        foundJob.shareToUser = document.querySelector('#friendShare').value;
        this.socket.send(JSON.stringify(foundJob));

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
            <td colspan="7" id="finalRow" className="fill-row-mobile"><div className="padding-button"><a href="./add.html"><button className="btn btn-primary btn-lg btn-dark">Add New Job</button></a></div></td>
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
                <td className="item1 card-entry"><h4 className="mobile-header">Position</h4>
                    <a className="job-title-popover" tabIndex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">` + jobTitle + `</a></td>
                <td className="item2 card-entry"><h4 className="mobile-header">Company</h4>` + companyName + `</td>
                <td className="item3 card-entry"><h4 className="mobile-header">Due</h4>` + dueDate + `</td>
                <td className="item4 card-entry"><h4 className="mobile-header">Status</h4>
                    <a className="btn btn-secondary btn-light dropdown-toggle dropdown-mobile" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      ` + status + `
                    </a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" onClick="updateStatusTable('Not Applied', this.parentElement.parentElement.previousElementSibling);">Not Applied</a></li>
                      <li><a className="dropdown-item" onClick="updateStatusTable('Applied', this.parentElement.parentElement.previousElementSibling);">Applied</a></li>
                      <li><a className="dropdown-item" onClick="updateStatusTable('Invited for Interview', this.parentElement.parentElement.previousElementSibling);">Invited for Interview</a></li>
                      <li><a className="dropdown-item" onClick="updateStatusTable('Interviewed', this.parentElement.parentElement.previousElementSibling);">Interviewed</a></li>
                      <li><a className="dropdown-item" onClick="updateStatusTable('Received Offer', this.parentElement.parentElement.previousElementSibling);">Received Offer</a></li>
                      <li><a className="dropdown-item" onClick="updateStatusTable('Application Rejected', this.parentElement.parentElement.previousElementSibling);">Application Rejected</a></li>
                    </ul>
                </td>
                <td className="td-center item5 card-entry"><h4 className="mobile-header">Link</h4><a href="` + jobLink + `" target="_blank"><img src="./icons/link.svg" className="table-icon"></a></td>
                <td className="td-center item6 card-entry"><h4 className="mobile-header">Contact</h4>
                    <button type="button" className="no-show-button" data-bs-toggle="popover" data-bs-content="` + contact + `">
                        <img src="./icons/envelope.svg" className="table-icon">
                    </button>
                </td>
                <td className="td-center item7 card-entry"><h4 className="mobile-header">Notes</h4><button className="no-show-button" data-bs-toggle="modal" data-bs-target="#noteModal` + jobID + `">
                    <img src="./icons/journal.svg" className="table-icon">
                </button></td>
            `;

        const modalHTML = `
        <div className="modal fade" id="noteModal` + jobID + `" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Notes</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                    <textarea className="form-control" rows="20" id="editableTextField` + jobID + `">` + notes + `</textarea>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-dark" id="save` + jobID + `" onClick="saveNote(this);">Save Changes</button>
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

        const mainEl = document.querySelector('.job-main');
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

    function cancelShareJob() {
        localStorage.removeItem('shareJob');
        localStorage.removeItem('shareMessage');
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

    async function loadSharedJobsFromDB() {
        const sharedJobListText = localStorage.getItem('sharedJobList');
        if (sharedJobListText) {
            updateSharedJobDOM();
        } else {
            const username = localStorage.getItem('userName');
            const response = await fetch(`/api/jobs/shared/${username}`)
            const sharedJobs = await response.json();
            localStorage.setItem('sharedJobList', JSON.stringify(sharedJobs));
            updateSharedJobDOM();
        }
    }

    function updateSharedJobDOM() {
        const notiModal = document.getElementById('notificationList');
        const sharedJobListText = localStorage.getItem('sharedJobList');
        if (sharedJobListText) {
            sharedJobList = JSON.parse(sharedJobListText);
        }
        notiModal.innerHTML = "";
        let i = 0;
        if (sharedJobList) {
            sharedJobList.forEach((job) => {
                const newSharedJob = getNotificationEl(`${job.user} shared a ${job.title} position at ${job.company} with you. Would you like to add or ignore it?`, i++);
                notiModal.appendChild(newSharedJob);
            });
        }

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
    }

    function configureWebSocket() {
        const username = localStorage.getItem('userName');
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        socket = new WebSocket(`${protocol}://${window.location.host}/ws?username=${username}`);

        socket.onopen = (event) => {
            console.log("ws connection opened");
        };
        socket.onmessage = async (event) => {
            const msg = JSON.parse(await event.data.text());
            updateSharedJobs(msg);
            updateSharedJobDOM();
            const modalEl = document.querySelector('#notificationModal');
            const msgModal = new bootstrap.Modal(modalEl, {});
            msgModal.show();
        };
    }


    let socket;
    let sharedJobList = [];

    return (
        <div className='app inner-component-padding job-main'>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Link</th>
                        <th>Contact</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider" id="add-rows">
                </tbody>
            </table>

            <div className="modal fade" id="notificationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Jobs Shared With You</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" id="notificationList">
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="shareModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Share Job</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p>Who would you like to share this job with?</p>
                            <div className="form-group form-group-margin-less">
                                <input type="text" className="form-control" id="friendShare" aria-describedby="friendHelp" placeholder="Friend username..." required />
                            </div>
                            <div id="quote"></div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-dark" onClick={shareJob}>Share Job</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelShareJob}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}