async function addJobToLocalStorage() {
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const date = document.getElementById('dueDate').value;
    const status = document.getElementById('selectedStatus').value;
    const jobLink = document.getElementById('jobLink').value;
    const jobContact = document.getElementById('contact').value;
    const notes = document.getElementById('notes').value;
    let username = localStorage.getItem('userName');

    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    let dateObj = new Date(date);
    dateObj.setDate(dateObj.getDate() + 1);
    let dueDate = dateObj.toLocaleDateString('en-US', dateOptions);
    dueDate = dueDate === "Invalid Date" ? "None" : dueDate;

    const contact = jobContact === "" ? "None" : jobContact;
    username = username === "" ? "Mystery User" : username;

    const newJobObject = {
        title: jobTitle,
        company: companyName,
        date: dueDate,
        status: status,
        link: jobLink,
        contact: contact,
        notes: notes,
        user: username
    }

    try {
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
        },
          body: JSON.stringify(newJobObject),
        });
        const jobs = await response.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
      } catch {
        let jobList = [];
        const jobsText = localStorage.getItem("jobs");
        if (jobsText) {
            jobList = JSON.parse(jobsText);
        }
    
        jobList.push(newJobObject);
        
        localStorage.setItem("jobs", JSON.stringify(jobList));
      }
}

function updateStatusForm(status) {
    document.getElementById('selectedStatus').value = status;
    document.getElementById("status").innerText = status;
}