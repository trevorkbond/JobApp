async function search() {
    const keyWords = document.querySelector("#tags").value;
    const uriKeyWords = encodeURI(keyWords);
    const url = `https://jobicy.com/api/v2/remote-jobs?count=10&tag=${uriKeyWords}`;

    try {
        const response = await fetch(url);
        const jobsJSON = await response.json();
        const jobList = jobsJSON.jobs;

        if (jobs.length) {
            jobs.forEach((job) => {
                addOneJobToDOM(job);
            });
        }

    } catch {

    }
}

function addOneJobToDOM() {
    const jobTitle = job.jobTitle;
    const companyName = job.companyName;
    const jobLink = job.url;
    const notes = job.jobExcerpt;

    const rowHTML = `
            <td class="item1 card-entry"><h4 class="mobile-header">Position</h4>
                <a class="job-title-popover" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">` + jobTitle + `</a></td>
            <td class="item2 card-entry"><h4 class="mobile-header">Company</h4>` + companyName + `</td>
            <td class="item3 card-entry"><h4 class="mobile-header">Due</h4>` + dueDate + `</td>
            <td class="item4 card-entry"><h4 class="mobile-header">Status</h4>
                <a class="btn btn-secondary btn-light dropdown-toggle dropdown-mobile" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
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
        `;
}