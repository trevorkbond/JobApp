import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Delete({ delJob }) {

    const navigate = useNavigate();

    async function deleteJob() {
        const response = await fetch('/api/jobs', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
          },
            body: JSON.stringify(delJob),
          });
          const jobs = await response.json();
          navigate('/jobs');
    }

    function cancelDelJob() {
        navigate('/jobs');
    }

    return (
        <div className='app'>
            <div className="form-div form-group-margin-less">
                <div className="form-content-container">
                    <h3 className="form-group-margin-less form-header">Are you sure you'd like to stop tracking the {delJob.title} position at {delJob.company}?</h3>
                    <form className="add-delete-share-form" action="./jobs.html">
                        <div className="form-group form-group-margin-less">
                            <div className="buttons-container">
                                <button type="button" className="btn btn-dark padding-button-override" onClick={deleteJob}>Yes</button>
                                <button type="button" className="btn btn-dark padding-button-override" onClick={cancelDelJob}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}