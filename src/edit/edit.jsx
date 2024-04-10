import React, { useEffect, useState } from 'react';
import { JobDropdown } from '../jobs/JobDropdown';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Edit({ editJobID }) {
    const [editJob, setEditJob] = React.useState(null);
    const location = useLocation;
    const otherJobID = location.state?.editJob;
    console.log(`other ${otherJobID}`);

    useEffect(() => {
        fetch(`/api/jobs/single/${otherJobID}`)
            .then(response => response.json())
            .then(editJob => {
                setEditJob(editJob);
                console.log(editJob);
            })
            .then(() => {
                loadJobFields();
            });
        // configureWebSocket();
        // loadSharedJobsFromDB();
    }, []);

    async function loadJobFields() {
        document.getElementById('jobTitle').value = editJob.title;
        document.getElementById('companyName').value = editJob.company;
        document.getElementById('dueDate').value = convertDateFormat(editJob.date);
        document.getElementById('jobLink').value = editJob.link;
        document.getElementById('contact').value = editJob.contact;
        document.getElementById('notes').value = editJob.notes;
    }

    return (
        <div className="form-div form-group-margin-less">
            <div className="form-content-container">
                <h3 id="editHeader" className="form-group-margin-less form-header" style={{alignSelf: 'flex-start', paddingTop: '1em'}}>Edit job below</h3>
                <form className="add-delete-share-form" action="./jobs.html">
                    <div className="form-group form-group-margin-less">
                        <input type="text" className="form-control" id="jobTitle" aria-describedby="titleHelp" placeholder="Job title..." required />
                        <small id="titleHelp" className="form-text text-muted">Job title for prospective position</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <input type="text" className="form-control" id="companyName" aria-describedby="companyHelp" placeholder="Company name..." required />
                        <small id="emailHelp" className="form-text text-muted">Company the position is with</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <input type="date" className="form-control" id="dueDate" aria-describedby="dateHelp" />
                        <small id="dateHelp" className="form-text text-muted">Date job application is due</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <JobDropdown initialValue={"ween"}/>
                        <small id="statusHelp" className="form-text text-muted">Status of job application</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <input type="url" className="form-control" id="jobLink" aria-describedby="linkHelp" placeholder="Link..." />
                        <small id="linkHelp" className="form-text text-muted">Link to job posting</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <input type="text" className="form-control" id="contact" aria-describedby="contactHelp" placeholder="Contact email..." />
                        <small id="contactHelp" className="form-text text-muted">Email for hiring manager or other contacts</small>
                    </div>
                    <div className="form-group form-group-margin-less">
                        <textarea className="form-control" id="notes" rows="3" placeholder="Additional notes..."></textarea>
                        <small id="notesHelp" className="form-text text-muted">Other notes for the job (job description, interview notes, etc.)</small>
                    </div>
                    <div className="buttons-container">
                        <button id="editJobButton" type="button" className="btn btn-dark padding-button-override" onclick="editJobLocalStorage()">Edit job</button>
                        <button type="button" className="btn btn-dark padding-button-override" onclick="cancelEditJob()" formnovalidate>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}