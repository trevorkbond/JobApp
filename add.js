function addJobToLocalStorage() {
    const jobTitle = document.getElementById('jobTitle').value;
    const companyName = document.getElementById('companyName').value;
    const dueDate = document.getElementById('dueDate').value;
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
        notes: notes
    }

    localStorage.setItem('addJob', JSON.stringify(newJobObject));
    
}