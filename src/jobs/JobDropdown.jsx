import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function JobDropdown({ initialValue, jobID, userName }) {
    const [value, setValue] = React.useState(initialValue);

    async function updateStatusTable(status, jobID) {
        setValue(status);
        const editJobObject = { jobID: jobID, user: userName };
        fetch(`/api/jobs/${status}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editJobObject),
        })
            .then(response => response.json())
            .then(jobs => {
                setJobs(jobs);
                localStorage.setItem('jobs', JSON.stringify(jobs));
            });
    }

    return (
        <DropdownButton id="dropdown-basic-button" variant='secondary' title={value}>
            <Dropdown.Item onClick={() => updateStatusTable('Not Applied', jobID)}>Not Applied</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Applied', jobID)}>Applied</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Invited for Interview', jobID)}>Invited for Interview</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Interviewed', jobID)}>Interviewed</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Received Offer', jobID)}>Received Offer</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Application Rejected', jobID)}>Application Rejected</Dropdown.Item>
        </DropdownButton>
    );


}

// <td className="item4 card-entry"><h4 className="mobile-header">Status</h4>
//                 <a className="btn btn-secondary btn-light dropdown-toggle dropdown-mobile" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
//                   ` + status + `
//                 </a>
//                 <ul className="dropdown-menu">
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Not Applied', this.parentElement.parentElement.previousElementSibling);">Not Applied</a></li>
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Applied', this.parentElement.parentElement.previousElementSibling);">Applied</a></li>
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Invited for Interview', this.parentElement.parentElement.previousElementSibling);">Invited for Interview</a></li>
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Interviewed', this.parentElement.parentElement.previousElementSibling);">Interviewed</a></li>
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Received Offer', this.parentElement.parentElement.previousElementSibling);">Received Offer</a></li>
//                   <li><a className="dropdown-item" onClick="updateStatusTable('Application Rejected', this.parentElement.parentElement.previousElementSibling);">Application Rejected</a></li>
//                 </ul>
//             </td>