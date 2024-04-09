import React from 'react';
import { JobDropdown } from './JobDropdown';
import { JobTitlePopover } from './JobTitlePopover';

export function JobRow(props) {
    const user = props.job.user;
    const jobTitle = props.job.title;
    const companyName = props.job.company;
    const dueDate = props.job.date;
    const jobLink = props.job.link;
    const status = props.job.status;
    const contact = props.job.contact;
    const jobID = props.job.jobID;
    return (
        <tr id={props.job.jobID}>
            {/* <td className="item1 card-entry"><h4 className="mobile-header">Position</h4>
                <a className="job-title-popover" tabIndex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="">{jobTitle}</a></td> */}
            <td className="item1 card-entry"><h4 className="mobile-header">Position</h4><JobTitlePopover jobID={jobID} title={jobTitle}></JobTitlePopover></td>
            <td className="item2 card-entry"><h4 className="mobile-header">Company</h4>{companyName}</td>
            <td className="item3 card-entry"><h4 className="mobile-header">Due</h4>{dueDate}</td>
            <td className="item4 card-entry">
                <JobDropdown initialValue={status} jobID={jobID} userName={user}/>
            </td>
            <td className="td-center item5 card-entry"><h4 className="mobile-header">Link</h4><a href={jobLink} target="_blank"><img src="./icons/link.svg" className="table-icon" alt="Link" /></a></td>
            <td className="td-center item6 card-entry"><h4 className="mobile-header">Contact</h4>
                <button type="button" className="no-show-button" data-bs-toggle="popover" data-bs-content={contact}>
                    <img src="./icons/envelope.svg" className="table-icon" alt="Contact Icon" />
                </button>
            </td>
            <td className="td-center item7 card-entry"><h4 className="mobile-header">Notes</h4><button className="no-show-button" data-bs-toggle="modal" data-bs-target={"#noteModal" + jobID}>
                <img src="./icons/journal.svg" className="table-icon" alt="Notes Icon" />
            </button></td>
        </tr>
    );
}