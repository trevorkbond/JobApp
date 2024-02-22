function deleteJob() {
    const delJobID = localStorage.getItem('delJob');
    if (delJobID) {
        let jobList = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobList = JSON.parse(jobsText);
        }
        jobList.splice(delJobID, 1);
        localStorage.setItem('jobs', JSON.stringify(jobList));
        localStorage.setItem('delJob', "");
    }
}

function cancelDelJob() {
    localStorage.setItem('delJob', "");
}