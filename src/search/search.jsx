import React from 'react';
import { useEffect } from 'react';
import { JobSearchRow } from './jobSearchRow';


export function Search() {

    const [search, setSearch] = React.useState(localStorage.getItem('lastSearch') || '');
    const [searchJobs, setSearchJobs] = React.useState(JSON.parse(localStorage.getItem('searchJobs')) || null);
    const [showResults, setShowResults] = React.useState(false);

    useEffect(() => {
        if (searchJobs !== null) {
            setShowResults(true);
        } else {
            setShowResults(false);
        }
    }, [searchJobs]);

    function onSearchChange(e) { setSearch(e.target.value); }

    async function doSearch() {
        localStorage.setItem('lastSearch', search);
        const uriKeyWords = encodeURI(search);
        const url = `https://jobicy.com/api/v2/remote-jobs?count=10&tag=${uriKeyWords}`;
        const response = await fetch(url);
        const jobsJSON = await response.json();
        const jobList = jobsJSON.jobs;

        if (jobList.length) {
            setSearchJobs(jobList);
            setShowResults(!showResults);
            localStorage.setItem('searchJobs', JSON.stringify(jobList));
        } // else if (jobList.statusCode === 404) {
        //     document.querySelector("#add-rows").innerHTML = "";
        //     const modalEl = document.querySelector('#msgModal');
        //     modalEl.querySelector('.modal-body').textContent = `⚠ Error: Your search returned no results. Please try again.`;
        //     const msgModal = new bootstrap.Modal(modalEl, {});
        //     msgModal.show();
        // }
    }

    const jobRows = [];
    if (searchJobs) {
        for (const [i, job] of searchJobs.entries()) {
            jobRows.push(
                <JobSearchRow job={job} key={i} />
            );
        }
    }

    //     const finalRow = document.createElement('tr');
    //     finalRow.innerHTML = (`
    //     <td colspan="7" id="finalRow" className="fill-row-mobile"><div className="padding-button"><a href="./add.html"><button className="btn btn-primary btn-lg btn-dark">Add New Job</button></a></div></td>
    // `);
    //     const tableParent = document.getElementById('add-rows');
    //     tableParent.appendChild(finalRow);

    return (
        <div className='app inner-component-padding'>
            <div className="form-div form-group-margin-less">
                <div className="form-content-container">
                    <h3 className="form-group-margin-less form-header" style={{ alignSelf: 'flex-start', paddingTop: '1em' }}>Search
                        for remote jobs</h3>
                    <form className="add-delete-share-form" action="./jobs.html">
                        <div className="form-group form-group-margin-less">
                            <input type="text" className="form-control" id="tags" aria-describedby="friendHelp"
                                placeholder="Key words..." onChange={(e) => onSearchChange(e)} value={search} />
                            <small id="friendHelp" className="form-text text-muted">Job search made possible by <a
                                href="https://jobicy.com/jobs-rss-feed" target="_blank">Jobicy's</a> API. Please restrict searching to
                                once a day as API usage is limited.</small>
                            <div className="buttons-container">
                                <button type="button" className="btn btn-dark padding-button-override"
                                    onClick={doSearch}>Search</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showResults && (<table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Link</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider" id="add-rows">{jobRows}</tbody>
            </table>)}
        </div>
    )
}