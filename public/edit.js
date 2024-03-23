function updateStatusForm(status) {
    document.getElementById('selectedStatus').value = status;
    document.getElementById("status").innerText = status;
}

async function loadJobFields() {
    if (localStorage.getItem('sharedJob') === 'true') {
        // THESE ARE CONSTANT VALS AND WILL CHANGE WITH WEBSOCKETS
        document.getElementById('jobTitle').value = "Software Development Intern";
        document.getElementById('companyName').value = "Lucid";
        document.getElementById('jobLink').value = "https://lucidchart.com";
        document.getElementById('contact').value = "example@lucid.com";
    }
    setDifferentTextIfSharedJob();
    const editJobID = localStorage.getItem('editJob');
    if (editJobID) {
        const response = await fetch(`/api/jobs/single/${editJobID}`);
        const editJob = await response.json();
        document.getElementById('jobTitle').value = editJob.title;
        document.getElementById('companyName').value = editJob.company;
        document.getElementById('dueDate').value = convertDateFormat(editJob.date);
        updateStatusForm(editJob.status);
        document.getElementById('jobLink').value = editJob.link;
        document.getElementById('contact').value = editJob.contact;
        document.getElementById('notes').value = editJob.notes;
    }
}

async function editJobLocalStorage() {
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const date = document.getElementById('dueDate').value;
    const status = document.getElementById('selectedStatus').value;
    const jobLink = document.getElementById('jobLink').value;
    const jobContact = document.getElementById('contact').value;
    const notes = document.getElementById('notes').value;

    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1);
    let dueDate = dateObj.toLocaleDateString('en-US', dateOptions);
    dueDate = dueDate === "Invalid Date" ? "None" : dueDate;

    const contact = jobContact === "" ? "None" : jobContact;
    let username = localStorage.getItem('userName');
    username = username === "" ? "Mystery User" : username;

    const editJobID = localStorage.getItem('editJob');
    const editJobObject = {
        title: jobTitle,
        company: companyName,
        date: dueDate,
        status: status,
        link: jobLink,
        contact: contact,
        notes: notes,
        jobID: parseInt(editJobID),
        user: username
    }

    let httpMethod;
    if (localStorage.getItem('sharedJob') === 'true') {
        httpMethod = 'POST';
    } else {
        httpMethod = 'PUT';
    }
    try {
        const response = await fetch('/api/jobs', {
            method: httpMethod,
            headers: {
            'Content-Type': 'application/json'
        },
            body: JSON.stringify(editJobObject),
        });
        const jobs = await response.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
        localStorage.removeItem('editJob');
        localStorage.removeItem('sharedJob');
        window.location.href = './jobs.html';
    } catch {
        let jobList = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobList = JSON.parse(jobsText);
        }
        const editJob = jobList[getIndexFromJobID(parseInt(editJobID))];

        jobList[getIndexFromJobID(editJob.jobID)] = newJobObject;
        
        localStorage.setItem("jobs", JSON.stringify(jobList));
        localStorage.removeItem('editJob');
        localStorage.removeItem('sharedJob');
    }
}

function setDifferentTextIfSharedJob() {
    if (localStorage.getItem('sharedJob') === 'true') {
        const header = document.getElementById('editHeader');
        header.textContent = "Make changes to shared job as needed";
        const button = document.getElementById('editJobButton');
        button.textContent = "Add";
    }
}

function cancelEditJob() {
    localStorage.removeItem('editJob');
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

function convertDateFormat(inputDate) {
    let parts = inputDate.split('/');
    let formattedDate;
    try {
        formattedDate = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
    } catch {
        formattedDate = "";
    }
    return formattedDate;
}

loadJobFields();