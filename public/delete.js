async function deleteJob() {
    const delJobID = localStorage.getItem('delJob');
    const delJobObject = { jobID: parseInt(delJobID), user: localStorage.getItem('userName') }; 
    if (delJobID) {
        try {
            const response = await fetch('/api/jobs', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
            },
              body: JSON.stringify(delJobObject),
            });
            const jobs = await response.json();
            localStorage.setItem('jobs', JSON.stringify(jobs));
            localStorage.removeItem('delJob');
            localStorage.removeItem('delJobMessage');
        } catch {
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
}

function cancelDelJob() {
    localStorage.removeItem('delJob');
    localStorage.removeItem('delJobMessage');
}


function loadConfirmationMessage() {
    const headerEl = document.getElementById('deleteConfirmation');
    headerEl.textContent = localStorage.getItem('delJobMessage');
}

loadConfirmationMessage();