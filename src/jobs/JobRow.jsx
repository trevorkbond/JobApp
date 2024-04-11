import React from 'react';
import { JobDropdown } from './JobDropdown';
import { JobTitlePopover } from './JobTitlePopover';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { NoteModal } from './NoteModal';

export function JobRow(props) {
    const [status, setStatus] = React.useState(props.job.status);

    const user = props.job.user;
    const jobTitle = props.job.title;
    const companyName = props.job.company;
    const dueDate = props.job.date;
    const jobLink = props.job.link;
    const contact = props.job.contact;
    const jobID = props.job.jobID;
    const note = props.job.notes;
    const contactPopover = (
        <Popover>
            <Popover.Body>
                <p>{contact}</p>
            </Popover.Body>
        </Popover>
    );

    const handleDropdownChange = (value) => {
        setStatus(value);
    };

    return (
        <tr id={props.job.jobID}>
            <td className="item1 card-entry"><h4 className="mobile-header">Position</h4>
                <JobTitlePopover jobID={jobID} title={jobTitle} handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete}></JobTitlePopover>
            </td>
            <td className="item2 card-entry"><h4 className="mobile-header">Company</h4>{companyName}</td>
            <td className="item3 card-entry"><h4 className="mobile-header">Due</h4>{dueDate}</td>
            <td className="item4 card-entry">
                <JobDropdown initialValue={status} jobID={jobID} userName={user} updateDB={true} onDropdownChange={handleDropdownChange}/>
            </td>
            <td className="td-center item5 card-entry"><h4 className="mobile-header">Link</h4><a href={jobLink} target="_blank"><img src="./icons/link.svg" className="table-icon" alt="Link" /></a></td>
            <td className="td-center item6 card-entry"><h4 className="mobile-header">Contact</h4>
                <OverlayTrigger trigger="click" placement="top" className='job-button' overlay={contactPopover} rootClose>
                    <button type="button" className="no-show-button">
                        <img src="./icons/envelope.svg" className="table-icon" alt="Contact Icon" />
                    </button>
                </OverlayTrigger>
            </td>
            <td className="td-center item7 card-entry"><h4 className="mobile-header">Notes</h4>
                <NoteModal jobID={jobID} initialNote={note}/>
            </td>
        </tr>
    );
}