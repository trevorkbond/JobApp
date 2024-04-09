import React from 'react';
import { useNavigate } from 'react-router-dom';

export function Authenticated(props) {
    const userName = props.userName;
    const navigate = useNavigate();

    function logout() {
        fetch(`/api/auth/logout`, {
            method: 'delete',
        })
            .catch(() => {
                // Logout failed. Assuming offline
            })
            .finally(() => {
                localStorage.removeItem('userName');
                localStorage.removeItem('sharedJobList');
                props.onLogout();
            });
    }

    return (
        <div className='app'>
            <div className="signin-upper-padding"></div>
            <div className="signin-form">
                <div style={{ width: 'fit-content', border: 'solid thin black', padding: '2em', borderRadius: '2em' }}>
                    <h2>Welcome, {userName}</h2>
                    <p>Continue to view your jobs</p>
                    <div className="buttons-container">
                        <button type="button" className="btn btn-dark" style={{marginRight: '.5em'}} onClick={() => navigate('/jobs')}>View jobs</button>
                        <button type="button" className="btn btn-dark"
                            onClick={() => logout()}>Logout</button>
                    </div>
                </div>
            </div>
        </div>
    );
}