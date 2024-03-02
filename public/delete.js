function deleteJob() {
    const delJobID = localStorage.getItem('delJob');
    if (delJobID) {
        let jobList = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobList = JSON.parse(jobsText);
        }
        jobList.splice(getIndexFromJobID(delJobID), 1);
        localStorage.setItem('jobs', JSON.stringify(jobList));
        localStorage.removeItem('delJob');
        localStorage.removeItem('delJobMessage');
    }
}

function cancelDelJob() {
    localStorage.removeItem('delJob');
    localStorage.removeItem('delJobMessage');
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

function loadConfirmationMessage() {
    const headerEl = document.getElementById('deleteConfirmation');
    headerEl.textContent = localStorage.getItem('delJobMessage');
}

loadConfirmationMessage();