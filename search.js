async function search() {
    const keyWords = document.querySelector("#tags").value;
    localStorage.setItem('lastSearch', keyWords);
    localStorage.removeItem('searchJobs');
    const uriKeyWords = encodeURI(keyWords);
    const url = `https://jobicy.com/api/v2/remote-jobs?count=10&tag=${uriKeyWords}`;

    try {
        const response = await fetch(url);
        const jobsJSON = await response.json();
        const jobList = jobsJSON.jobs;

        if (jobList.length) {
            document.querySelector("#add-rows").innerHTML = "";
            localStorage.setItem("searchJobs", JSON.stringify(jobList));
            jobList.forEach((job) => {
                addOneJobToDOM(job);
            });
        } else if (jobList.statusCode === 404) {
            document.querySelector("#add-rows").innerHTML = "";
            const modalEl = document.querySelector('#msgModal');
            modalEl.querySelector('.modal-body').textContent = `⚠ Error: Your search returned no results. Please try again.`;
            const msgModal = new bootstrap.Modal(modalEl, {});
            msgModal.show();
        }
        document.querySelector("#show-post-search").setAttribute("style", "display: table;");
        loadPopovers();

    } catch {
        console.log('error calling 3rd party API');
    }
}

function addOneJobToDOM(job) {
    const jobTitle = job.jobTitle;
    const companyName = job.companyName;
    const jobLink = job.url;
    const notes = job.jobExcerpt;
    const jobID = job.id;

    const rowHTML = `
            <td class="item1 card-entry"><h4 class="mobile-header">Position</h4>
                <a class="job-title-popover" tabindex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">` + jobTitle + `</a></td>
            <td class="item2 card-entry"><h4 class="mobile-header">Company</h4>` + companyName + `</td>
            <td class="td-center item5 card-entry"><h4 class="mobile-header">Link</h4><a href="` + jobLink + `" target="_blank"><img src="./icons/link.svg" class="table-icon"></a></td>
            <td class="td-center item7 card-entry"><h4 class="mobile-header">Description</h4><button class="no-show-button" data-bs-toggle="modal" data-bs-target="#noteModal` + jobID + `">
                <img src="./icons/journal.svg" class="table-icon">
            </button></td>
        `;

        const modalHTML = `
        <div class="modal fade" id="noteModal` + jobID + `" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Notes</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                    <p>` + notes + `</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        `;

    const row = document.createElement('tr');
    row.setAttribute('id', jobID);
    row.innerHTML = rowHTML;
    const tableParent = document.getElementById('add-rows');
    tableParent.appendChild(row);

    const mainEl = document.querySelector('main');
    const modalEl = document.createElement('div');
    modalEl.innerHTML = modalHTML;
    mainEl.appendChild(modalEl);
}

function loadPopovers() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => {
        const popoverOptions = {};
        if (popoverTriggerEl.classList.contains('job-title-popover')) {
            popoverOptions.html = true;
            popoverOptions.content = addJobButtons(popoverTriggerEl.parentElement.parentElement.id);
        }
        return new bootstrap.Popover(popoverTriggerEl, popoverOptions);
    });
}

function addJobButtons(jobID) {
    const buttonsDiv = document.createElement('div');
    buttonsDiv.classList.add('buttons-container');
    
    const addButton = document.createElement('button');
    addButton.setAttribute('id', 'add' + jobID);
    addButton.classList.add('btn', 'btn-dark', 'btn-sm', 'padding-button-override');
    addButton.setAttribute('onclick', 'addSearchJobToLocalStorage(this)');
    addButton.textContent = 'Add';

    buttonsDiv.appendChild(addButton);

    return buttonsDiv;
}

function getJobIDFromID(id) {
    return id.replace(/^\D+/g, '');
}

function addSearchJobToLocalStorage(addEl) {
    localStorage.setItem('searchJob', getJobIDFromID(addEl.id));
    window.location.href = './add.html';
}

function loadLastSearch() {
    document.querySelector("#tags").value = localStorage.getItem('lastSearch');
    const jobListText = localStorage.getItem('searchJobs');
    if (jobListText) {
        const jobList = JSON.parse(jobListText);
        jobList.forEach((job) => {
            addOneJobToDOM(job);
        });
    }
    document.querySelector("#show-post-search").setAttribute("style", "display: table;");
    loadPopovers();
}

loadLastSearch();