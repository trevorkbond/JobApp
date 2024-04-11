import React from 'react';
import { SearchModal } from './searchModal';

export function JobSearchRow(props) {

    const jobTitle = props.job.jobTitle;
    const companyName = props.job.companyName;
    const jobLink = props.job.url;
    const note = props.job.jobExcerpt;

    const handleDropdownChange = (value) => {
        setStatus(value);
    };

    return (
        <tr id={props.job.jobID}>
            <td className="item1 card-entry"><h4 className="mobile-header">Position</h4>
                <a>{jobTitle}</a>
            </td>
            <td className="item2 card-entry"><h4 className="mobile-header">Company</h4>{companyName}</td>
            <td className="td-center item5 card-entry"><h4 className="mobile-header">Link</h4><a href={jobLink} target="_blank"><img src="./icons/link.svg" className="table-icon" alt="Link" /></a></td>
            <td className="td-center item7 card-entry"><h4 className="mobile-header">Notes</h4>
                <SearchModal initialNote={note} />
            </td>
        </tr>
    );
}