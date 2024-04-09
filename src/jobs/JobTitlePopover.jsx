import React from 'react';
import { useState, useRef, useEffect } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function JobTitlePopover({ jobID, title }) {
    const popover = (
        <Popover>
            <Popover.Body>
                <div className='buttons-container'>
                    <Button className='btn btn-dark padding-button-override-small'>Edit</Button>
                    <Button className='btn btn-dark padding-button-override-small'>Share</Button>
                    <Button  className='btn btn-dark padding-button-override-small'>Delete</Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
        <OverlayTrigger trigger="click" placement="right" className='job-button' overlay={popover} rootClose>
            <Button className='job-button'>{title}</Button>
        </OverlayTrigger>
    );

}