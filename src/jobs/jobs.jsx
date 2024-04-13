import React, { useEffect } from 'react';
import { JobRow } from './JobRow';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../app.css';

export function Jobs(props) {
    const [jobs, setJobs] = React.useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/api/jobs/${props.userName}`)
            .then(response => response.json())
            .then(jobs => {
                setJobs(jobs);
                localStorage.setItem('jobs', JSON.stringify(jobs));
            })
            .catch(error => {
                const jobsText = localStorage.getItem('jobs');
                if (jobsText) {
                    setJobs(JSON.parse(jobsText));
                }
            });

    }, []);

    const jobRows = [];
    if (jobs.length) {
        for (const [i, job] of jobs.entries()) {
            jobRows.push(
                <JobRow job={job} key={i} handleEdit={props.handleEdit}
                    handleDelete={props.handleDelete} />
            );
            if (i === jobs.length - 1) {
                jobRows.push(<tr key={i + 1} className='fill-row-mobile' id='finalRow'>
                    <td colSpan={7}>
                        <div className='padding-button'>
                            <Button className='btn btn-lg btn-dark' onClick={addJob}>Add New Job</Button>
                        </div>
                    </td>
                </tr>)
            }
        }

    } else {
        jobRows.push(<tr key={1} className='fill-row-mobile' id='finalRow'>
            <td colSpan={7}>
                <div className='padding-button'>
                    <Button className='btn btn-lg btn-dark' onClick={addJob}>Add New Job</Button>
                </div>
            </td>
        </tr>)
    }

    function addJob() {
        navigate('/add');
    }

    return (
        <div className='app inner-component-padding job-main'>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Link</th>
                        <th>Contact</th>
                        <th>Notes</th>
                    </tr>
                </thead>
                <tbody className="table-group-divider" id="add-rows">{jobRows}</tbody>
            </table>
            <div style={{paddingBottom: '2em'}}></div>
        </div>
    );
}