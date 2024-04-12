import React, { useEffect } from 'react';
import { JobRow } from './JobRow';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { JobNotifier } from './jobNotifier';
import '../app.css';

export function Jobs(props) {
    const [jobs, setJobs] = React.useState([]);
    const [events, setEvent] = React.useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        
        JobNotifier.addHandler(handleJobEvent);
        fetch(`/api/jobs/${props.userName}`)
            .then(response => response.json())
            .then(jobs => {
                setJobs(jobs);
                localStorage.setItem('jobs', JSON.stringify(jobs));
            })
            .catch(error => {
                const jobsText = localStorage.getItem('jobs');
                if (jobsText) {
                    setJobs(JSON.parse(jobsText));
                }
            });
            console.log(events);
        return () => {
            JobNotifier.removeHandler(handleJobEvent);
        };
    }, []);

    function handleJobEvent(event) {
        setEvent(event);
        props.handleSharedJobs(events);
    }

    function createMessageArray() {
        const messageArray = [];
        for (const [i, event] of events.entries()) {
          messageArray.push(
            <div key={i} style={{borderBottom: '1px solid black', marginTop: '.5em'}}>
              <p>Idk just put something in here </p>
            </div>
          );
        }
        return messageArray;
      }

    // function getNotificationEl(jobMessage, index) {
    //     const popoverDiv = document.createElement('div');
    //     popoverDiv.setAttribute('style', 'border-bottom: 1px solid black; margin-top: .5em;');
    //     const popoverText = document.createElement('p');
    //     popoverDiv.textContent = jobMessage;
    //     const buttonsDiv = document.createElement('div');
    //     buttonsDiv.classList.add('buttons-container');

    //     const addButton = document.createElement('button');
    //     addButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
    //     addButton.onclick = addSharedJobToLocalStorage(this.parentElement.parentElement);
    //     addButton.textContent = 'Add';

    //     const ignoreButton = document.createElement('button');
    //     ignoreButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override-small');
    //     ignoreButton.onclick = ignoreNotification(this.parentElement.parentElement);
    //     ignoreButton.textContent = 'Ignore';

    //     buttonsDiv.appendChild(addButton);
    //     buttonsDiv.appendChild(ignoreButton);
    //     popoverDiv.appendChild(popoverText);
    //     popoverDiv.appendChild(buttonsDiv);
    //     popoverDiv.setAttribute('id', 'noti' + index);

    //     return popoverDiv;
    // }

    // async function ignoreNotification(el) {

    //     const delJob = sharedJobList[getJobIDFromID(el.id)];

    //     sharedJobList.splice(getJobIDFromID(el.id), 1);
    //     localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));

    //     const response = await fetch('/api/jobs/shared', {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(delJob),
    //     });

    //     updateSharedJobDOM();

    // }

    // function updateNotificationIcon() {
    //     if (document.getElementById('notificationList').childElementCount !== 0) {
    //         document.getElementById('notificationIcon').setAttribute('src', './icons/bell.svg');
    //     } else {
    //         document.getElementById('notificationIcon').setAttribute('src', './icons/bell-slash.svg');
    //     }
    // }

    // function updateSharedJobs(sharedJob) {
    //     const sharedJobListText = localStorage.getItem('sharedJobList');
    //     if (sharedJobListText) {
    //         sharedJobList = JSON.parse(sharedJobListText);
    //         sharedJobList.push(sharedJob);
    //         localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));
    //     } else {
    //         sharedJobList.push(sharedJob);
    //         localStorage.setItem('sharedJobList', JSON.stringify(sharedJobList));
    //     }
    // }

    // function addSharedJobToLocalStorage(newJobEl) {
    //     const index = getJobIDFromID(newJobEl.id);
    //     localStorage.setItem('sharedJob', 'true');

    //     const tempEl = document.createElement('p');
    //     tempEl.setAttribute('id', 'temp' + index);
    //     addEditJobToLocalStorage(tempEl);
    //     window.location.href = './edit.html';
    // }

    // function addDelJobToLocalStorage(delEl) {
    //     localStorage.setItem('delJob', getJobIDFromID(delEl.id));
    //     let jobs = [];
    //     const jobsText = localStorage.getItem("jobs");
    //     if (jobsText) {
    //         jobs = JSON.parse(jobsText);
    //     }
    //     const delJob = jobs[getIndexFromJobID(getJobIDFromID(delEl.id))];
    //     localStorage.setItem('delJobMessage', `Are you sure you'd like to stop tracking the ${delJob.title} position at ${delJob.company}?`);
    //     window.location.href = './delete.html';
    // }

    // function addEditJobToLocalStorage(editEl) {
    //     localStorage.setItem('editJob', getJobIDFromID(editEl.id));
    //     window.location.href = './edit.html';
    // }

    // function addShareJobIDLocalStorage(shareEl) {
    //     localStorage.setItem('shareJob', getJobIDFromID(shareEl.id));
    // }

    // async function shareJob() {
    //     const shareJobID = localStorage.getItem('shareJob');
    //     localStorage.removeItem('shareJob');
    //     const response = await fetch(`/api/jobs/single/${shareJobID}`);
    //     let foundJob = await response.json();
    //     foundJob.shareToUser = document.querySelector('#friendShare').value;
    //     this.socket.send(JSON.stringify(foundJob));

    // }

    const jobRows = [];
    if (jobs.length) {
        for (const [i, job] of jobs.entries()) {
            jobRows.push(
                <JobRow job={job} key={i} handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete} />
            );
            if (i === jobs.length - 1) {
                jobRows.push(<tr key={i + 1} className='fill-row-mobile' id='finalRow'>
                    <td colSpan={7}>
                        <div className='padding-button'>
                            <Button className='btn btn-lg btn-dark' onClick={addJob}>Add New Job</Button>
                        </div>
                    </td>
                </tr>)
            }
        }

        //     const finalRow = document.createElement('tr');
        //     finalRow.innerHTML = (`
        //     <td colspan="7" id="finalRow" className="fill-row-mobile"><div className="padding-button"><a href="./add.html"><button className="btn btn-primary btn-lg btn-dark">Add New Job</button></a></div></td>
        // `);
        //     const tableParent = document.getElementById('add-rows');
        //     tableParent.appendChild(finalRow);
    }

    function addJob() {
        navigate('/add');
    }

    // function cancelShareJob() {
    //     localStorage.removeItem('shareJob');
    //     localStorage.removeItem('shareMessage');
    // }

    // function getIndexFromJobID(id) {
    //     let jobs = [];
    //     const jobsText = localStorage.getItem("jobs");
    //     if (jobsText) {
    //         jobs = JSON.parse(jobsText);
    //     }
    //     for (let i = 0; i < jobs.length; i++) {
    //         if (jobs[i].jobID === parseInt(id)) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // }

    // function getJobIDFromID(id) {
    //     return id.replace(/^\D+/g, '');
    // }

    // async function loadSharedJobsFromDB() {
    //     const sharedJobListText = localStorage.getItem('sharedJobList');
    //     if (sharedJobListText) {
    //         updateSharedJobDOM();
    //     } else {
    //         const username = localStorage.getItem('userName');
    //         const response = await fetch(`/api/jobs/shared/${username}`)
    //         const sharedJobs = await response.json();
    //         localStorage.setItem('sharedJobList', JSON.stringify(sharedJobs));
    //         updateSharedJobDOM();
    //     }
    // }

    // function updateSharedJobDOM() {
    //     const notiModal = document.getElementById('notificationList');
    //     const sharedJobListText = localStorage.getItem('sharedJobList');
    //     if (sharedJobListText) {
    //         sharedJobList = JSON.parse(sharedJobListText);
    //     }
    //     notiModal.innerHTML = "";
    //     let i = 0;
    //     if (sharedJobList) {
    //         sharedJobList.forEach((job) => {
    //             const newSharedJob = getNotificationEl(`${job.user} shared a ${job.title} position at ${job.company} with you. Would you like to add or ignore it?`, i++);
    //             notiModal.appendChild(newSharedJob);
    //         });
    //     }

    //     updateNotificationIcon();
    // }

    // function recreatePopovers() {
    //     const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    //     const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
    //         const popoverOptions = {};
    //         if (popoverTriggerEl.id === 'userPopover') {
    //             popoverOptions.html = true;
    //             popoverOptions.content = addUserMenu();
    //         } else if (popoverTriggerEl.classList.contains('job-title-popover')) {
    //             popoverOptions.html = true;
    //             popoverOptions.content = addJobButtons(popoverTriggerEl.parentElement.parentElement.id);
    //         }
    //         return new bootstrap.Popover(popoverTriggerEl, popoverOptions);
    //     });
    // }

    // function configureWebSocket() {
    //     const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    //     setSocket(new WebSocket(`${protocol}://${window.location.host}/ws?username=${props.userName}`));

    //     this.socket.onopen = (event) => {
    //         console.log("ws connection opened");
    //     };
    //     socket.onmessage = async (event) => {
    //         const msg = JSON.parse(await event.data.text());
    //         updateSharedJobs(msg);
    //         updateSharedJobDOM();
    //         const modalEl = document.querySelector('#notificationModal');
    //         const msgModal = new bootstrap.Modal(modalEl, {});
    //         msgModal.show();
    //     };
    // }

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
                <tbody className="table-group-divider" id="add-rows">{jobRows}</tbody>
            </table>

            {/* <div className="modal fade" id="notificationModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                </div> */}

            {/* <div className="modal fade" id="shareModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                </div> */}
        </div>
    );
}