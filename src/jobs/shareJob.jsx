import React from 'react';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { JobEventNotifier } from './jobNotifier';
import '../app.css';

export function ShareJobModal(props) {
    const [friend, setFriend] = useState('');
    const jobNotifier = JobEventNotifier.getInstance();

    const onFriendChange = (e) => setFriend(e.target.value);

    async function shareJob() {
        const shareJob = JSON.parse(JSON.stringify(props.job));
        shareJob.shareToUser = friend;
        shareJob.status = 'Select Status';
        jobNotifier.broadcastEvent(shareJob);
    }

    return (
        <>
            <Modal {...props} show={props.message} >
                <Modal.Header><Modal.Title>Share job</Modal.Title></Modal.Header>
                <Modal.Body>
                    <p>Who would you like to share this job with?</p>
                    <div className='form-group form-group-margin-less'>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Username of friend to share with..."
                            value={friend}
                            onChange={onFriendChange}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide} variant='secondary'>Close</Button>
                    <Button className='btn-dark' onClick={shareJob}>
                        Share
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
