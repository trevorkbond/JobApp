import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function UserMenu({ userName }) {

    function logout() {
        localStorage.removeItem('userName');
        localStorage.removeItem('sharedJobList');
        fetch(`/api/auth/logout`, {
            method: 'delete',
        }).then(() => (window.location.href = '/'));
    }

    const popover = (
        <Popover>
            <Popover.Body style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <p>{userName}</p>
                <div className='buttons-container'>
                    <Button className='btn btn-dark padding-button-override-small'
                        onClick={() => logout()}>Logout</Button>
                </div>
            </Popover.Body>
        </Popover>
    );

    return (
            <OverlayTrigger trigger="click" placement="bottom" className='job-button' overlay={popover} rootClose>
                <img id="personIcon" src="./icons/person.svg" style={{ filter: 'invert(100%)', width: '30px' }} />
            </OverlayTrigger>
    );
}