import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function NoteModal({ jobID, initialNote }) {
    const [show, setShow] = React.useState(false);
    const [note, setNote] = React.useState(initialNote);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    async function saveNote(jobID) {
        const textFieldEl = document.getElementById('exampleForm.ControlTextarea' + jobID);
        const newNote = textFieldEl.value;
        setNote(newNote);

        const response = await fetch(`/api/jobs/single/${jobID}`);
        let foundJob = await response.json();
        foundJob.notes = newNote;

        const jobResponse = await fetch('/api/jobs', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foundJob),
        });
        const jobs = await jobResponse.json();
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    return (
        <>
            <Button className='job-button' onClick={handleShow}>
                <img src="./icons/journal.svg" className="table-icon" alt="Notes Icon" />
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Notes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId={"exampleForm.ControlTextarea" + jobID}
                        >
                            <Form.Control
                                as="textarea"
                                rows={20}
                                defaultValue={note}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button className='btn-dark' onClick={() => saveNote(jobID)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}