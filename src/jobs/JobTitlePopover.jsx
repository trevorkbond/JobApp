import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';
import { ShareJobModal } from './shareJob';

export function JobTitlePopover({ jobID, title, handleEdit, handleDelete, job}) {
    const [displayShare, setDisplayShare] = React.useState(null);

    const navigate = useNavigate();

    async function doEdit() {
        const response = await fetch(`/api/jobs/single/${jobID}`);
        const editJob = await response.json();
        handleEdit(editJob);
        navigate('/edit');
    }

    async function doDelete() {
        const response = await fetch(`/api/jobs/single/${jobID}`);
        const delJob = await response.json();
        handleDelete(delJob);
        navigate('/delete');
    }

    const popover = (
        <Popover>
            <Popover.Body>
                <div className='buttons-container'>
                    <Button className='btn btn-dark padding-button-override-small' onClick={() => doEdit()}>Edit</Button>
                    <Button className='btn btn-dark padding-button-override-small' onClick={() => setDisplayShare('yes')} >Share</Button>
                    <Button  className='btn btn-dark padding-button-override-small' onClick={doDelete}>Delete</Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <>
            <OverlayTrigger trigger="click" placement="right" className='job-button' overlay={popover} rootClose>
                <a className='job-title-popover' role='button'>{title}</a>
            </OverlayTrigger>
            <ShareJobModal message={displayShare} onHide={() => setDisplayShare(null)} job={job} />
        </>
    );

}