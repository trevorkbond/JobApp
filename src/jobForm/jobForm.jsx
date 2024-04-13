import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JobDropdown } from '../jobs/JobDropdown';
import { useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function JobForm({ editJob, searchJob, userName }) {
    const navigate = useNavigate();
    const [title, setTitle] = React.useState(editJob.title);
    const [company, setCompany] = React.useState(editJob.company);
    const [date, setDate] = React.useState(convertDateFormat(editJob.date));
    const [status, setStatus] = React.useState(editJob.status);
    const [link, setLink] = React.useState(editJob.link);
    const [contact, setContact] = React.useState(editJob.contact);
    const [notes, setNotes] = React.useState(editJob.notes);
    const editJobID = editJob.jobID;
    const user = userName;
    const isAddJob = editJob.title === '';
    const isSearchJob = searchJob !== undefined;
    const header = isAddJob ? 'Add a job below' : isSearchJob ? 'Add additional fields as needed' : 'Edit job below';
    const submitButton = (isAddJob || isSearchJob) ? 'Add job' : 'Edit job';

    function onTitleChange(e) { setTitle(e.target.value); }
    function onCompanyChange(e) { setCompany(e.target.value); }
    function onDateChange(e) { setDate(e.target.value); }
    function onLinkChange(e) { setLink(e.target.value); }
    function onContactChange(e) { setContact(e.target.value); }
    function onNotesChange(e) { setNotes(e.target.value); }

    const handleDropdownChange = (value) => {
        setStatus(value);
    };

    function toDisplayDate(date) {
        const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
        let dateObj = new Date(date);
        dateObj.setDate(dateObj.getDate() + 1);
        let dueDate = dateObj.toLocaleDateString('en-US', dateOptions);
        dueDate = dueDate === "Invalid Date" ? "None" : dueDate;
        return dueDate;
    }

    function convertDateFormat(inputDate) {
        if (inputDate) {
            let parts = inputDate.split('/');
            let formattedDate;
            try {
                formattedDate = parts[2] + '-' + parts[0].padStart(2, '0') + '-' + parts[1].padStart(2, '0');
            } catch {
                formattedDate = "";
            }
            return formattedDate;
        }
        return '';
    }

    async function submitChanges() {
        const jobObject = {
            title: title,
            company: company,
            date: toDisplayDate(date),
            status: status,
            link: link,
            contact: contact,
            notes: notes,
            jobID: editJobID,
            user: user
        }
        const httpMethod = (isAddJob || isSearchJob) ? 'POST' : 'PUT';
        const response = await fetch('/api/jobs', {
            method: httpMethod,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jobObject),
        });
        const jobs = await response.json();
        navigate('/jobs');
    }

    function cancelEdits() {
        navigate('/jobs');
    }

    return (
        <div className='app'>
            <div className="form-div form-group-margin-less">
                <div className="form-content-container">
                    <h3 id="editHeader" className="form-group-margin-less form-header" style={{ alignSelf: 'flex-start', paddingTop: '1em' }}>{header}</h3>
                    <form className="add-delete-share-form" action="./jobs.html">
                        <div className="form-group form-group-margin-less">
                            <input type="text" className="form-control" id="jobTitle"
                                aria-describedby="titleHelp" placeholder="Job title..." value={title}
                                onChange={(e) => onTitleChange(e)} required />
                            <small id="titleHelp" className="form-text text-muted">Job title for prospective position</small>
                        </div>
                        <div className="form-group form-group-margin-less">
                            <input type="text" className="form-control" id="companyName"
                                aria-describedby="companyHelp" placeholder="Company name..." value={company}
                                onChange={(e) => onCompanyChange(e)} required />
                            <small id="emailHelp" className="form-text text-muted">Company the position is with</small>
                        </div>
                        <div className="form-group form-group-margin-less">
                            <input type="date" className="form-control" id="dueDate" aria-describedby="dateHelp"
                                value={date} onChange={(e) => onDateChange(e)} />
                            <small id="dateHelp" className="form-text text-muted">Date job application is due</small>
                        </div>
                        <div className="form-group form-group-margin-less">
                            <JobDropdown initialValue={status} onDropdownChange={handleDropdownChange} />
                        </div>
                        <div className="form-group form-group-margin-less">
                            <input type="url" className="form-control" id="jobLink"
                                aria-describedby="linkHelp" placeholder="Link..." value={link}
                                onChange={(e) => onLinkChange(e)} />
                            <small id="linkHelp" className="form-text text-muted">Link to job posting</small>
                        </div>
                        <div className="form-group form-group-margin-less">
                            <input type="text" className="form-control" id="contact"
                                aria-describedby="contactHelp" placeholder="Contact email..." value={contact}
                                onChange={(e) => onContactChange(e)} />
                            <small id="contactHelp" className="form-text text-muted">Email for hiring manager or other contacts</small>
                        </div>
                        <div className="form-group form-group-margin-less">
                            <textarea className="form-control" id="notes" rows="3" placeholder="Additional notes..."
                                value={notes} onChange={(e) => onNotesChange(e)} ></textarea>
                            <small id="notesHelp" className="form-text text-muted">Other notes for the job (job description, interview notes, etc.)</small>
                        </div>
                        <div className="buttons-container">
                            <button id="editJobButton" type="button" className="btn btn-dark padding-button-override"
                                onClick={submitChanges}>{submitButton}</button>
                            <button type="button" className="btn btn-dark padding-button-override" onClick={cancelEdits}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{paddingBottom: '2em'}}></div>
        </div>
    );
}