import React from 'react';
import { useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function SearchJobTitlePopover({ job, handleSearch, handleEdit }) {

    const navigate = useNavigate();

    async function doAdd() {
        handleSearch(job);
        handleEdit(job);
        navigate('/add-searched');
    }

    const popover = (
        <Popover>
            <Popover.Body>
                <div className='buttons-container'>
                    <Button className='btn btn-dark padding-button-override-small' onClick={() => doAdd()}>Add</Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="right" className='job-button' overlay={popover} rootClose>
            <span className='job-title-popover' role='button'>{job.title}</span>
        </OverlayTrigger>
    );

}