import React from 'react';
import { useEffect } from 'react';
import { JobSearchRow } from './jobSearchRow';
import { MessageDialog } from '../login/messageDialog';
import { useNavigate } from 'react-router-dom';


export function Search({ handleSearch, handleEdit }) {

    const [search, setSearch] = React.useState(localStorage.getItem('lastSearch') || '');
    const [searchJobs, setSearchJobs] = React.useState(JSON.parse(localStorage.getItem('searchJobs')) || null);
    const [showResults, setShowResults] = React.useState(false);
    const [displayError, setDisplayError] = React.useState(null);
    const navigate = useNavigate();

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
        } else if (jobList.statusCode === 404) {
            setDisplayError("⚠ Error: Search didn't return results. Please try again.");
        }
    }

    function goHome() {
        navigate('/jobs');
    }

    const jobRows = [];
    if (searchJobs) {
        for (const [i, job] of searchJobs.entries()) {
            job.status = 'Select Status';
            jobRows.push(
                <JobSearchRow job={job} key={i} handleSearch={handleSearch} handleEdit={handleEdit} />
            );
        }
    }

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
                                <button type="button" className="btn btn-dark padding-button-override"
                                    onClick={goHome}>Back</button>
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
            <MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
            <div style={{ paddingBottom: '2em' }}></div>
        </div>
    )
}