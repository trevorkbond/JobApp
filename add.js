function addJobToLocalStorage() {
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const dueDate = document.getElementById('dueDate').value;
    const status = document.getElementById('selectedStatus').value;
    const jobLink = document.getElementById('jobLink').value;
    const contact = document.getElementById('contact').value;
    const notes = document.getElementById('notes').value;

    const newJobObject = {
        title: jobTitle,
        company: companyName,
        date: dueDate,
        status: status,
        link: jobLink,
        contact: contact,
        notes: notes,
        jobID: getJobIDIncrement()
    }

    let jobList = [];
    const jobsText = localStorage.getItem("jobs");
    if (jobsText) {
        jobList = JSON.parse(jobsText);
    }

    jobList.push(newJobObject);
    
    localStorage.setItem("jobs", JSON.stringify(jobList));
}

function updateStatusForm(status) {
    document.getElementById('selectedStatus').value = status;
    document.getElementById("status").innerText = status;
}

function getJobIDIncrement() {
    let nextJobID = JSON.parse(localStorage.getItem("jobID"));
    if (nextJobID !== null && nextJobID !== "") {
        localStorage.setItem("jobID", JSON.stringify(++nextJobID));
        return --nextJobID;
    } else {
        nextJobID = 0;
        localStorage.setItem("jobID", JSON.stringify(++nextJobID));
        return --nextJobID;
    }
}