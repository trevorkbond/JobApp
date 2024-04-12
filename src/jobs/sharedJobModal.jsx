import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function SharedJobModal({ sharedJobs }) {
    const [show, setShow] = React.useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <img src="./icons/bell.svg" role="button" style={{ filter: 'invert(100%)', width: '30px' }} 
                onClick={handleShow} className="table-icon" alt="Notification Icon" />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Jobs Shared With You</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {sharedJobs}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}