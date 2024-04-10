import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function JobDropdown({ initialValue, jobID, userName, updateDB, onDropdownChange }) {
    const [selectedValue, setSelectedValue] = useState(initialValue);

    async function updateStatusTable(status, jobID) {
        const editJobObject = { jobID: jobID, user: userName };
        if (updateDB) {
            fetch(`/api/jobs/${status}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editJobObject),
            })
        }
        setSelectedValue(status);
        onDropdownChange(status);
    }

    return (
        <DropdownButton id="dropdown-basic-button" variant='secondary' title={selectedValue}>
            <Dropdown.Item onClick={() => updateStatusTable('Not Applied', jobID)}>Not Applied</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Applied', jobID)}>Applied</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Invited for Interview', jobID)}>Invited for Interview</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Interviewed', jobID)}>Interviewed</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Received Offer', jobID)}>Received Offer</Dropdown.Item>
            <Dropdown.Item onClick={() => updateStatusTable('Application Rejected', jobID)}>Application Rejected</Dropdown.Item>
        </DropdownButton>
    );


}