import React from 'react';

export function Unauthenticated(props) {
    const [userName, setUserName] = React.useState(props.userName);
    const [password, setPassword] = React.useState('');
    const [displayError, setDisplayError] = React.useState(null);

    async function loginUser() {
        loginOrCreate('/api/auth/login');
    }

    async function createUser() {
        loginOrCreate('/api/auth/create');
    }

    async function loginOrCreate(endpoint) {
        const response = await fetch(endpoint, {
            method: 'post',
            body: JSON.stringify({ email: userName, password: password }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        if (response.ok) {
            localStorage.setItem('userName', userName);
            window.location.href = 'jobs.html';
        } else {
            const body = await response.json();
            const modalEl = document.querySelector('#msgModal');
            modalEl.querySelector('.modal-body').textContent = `⚠ Error: ${body.msg}`;
            const msgModal = new bootstrap.Modal(modalEl, {});
            msgModal.show();
        }
    }

    return (
        <div className='app'>
            <div className="signin-upper-padding"></div>
            <div className="signin-form">
                <div style={{width: 'fit-content', border: 'solid thin black', padding: '2em', borderRadius: '2em'}}>
                    <h2>Sign in</h2>
                    <p>Sign in or create an account to access JobApp</p>
                    <form>
                        <div className="form-group form-group-margin">
                            <label>Username</label>
                            <input 
                                type="text" 
                                className="form-control"
                                aria-describedby="usernameHelp"
                                placeholder="Enter username" 
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <div className="form-group form-group-margin">
                            <label>Password</label>
                            <input 
                                type="password" 
                                className="form-control" 
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password" />
                        </div>
                        <div className="buttons-container">
                            <button type="button" className="btn btn-dark padding-button-override" onClick={() => loginUser()}>Sign
                                in</button>
                            <button type="button" className="btn btn-dark padding-button-override"
                                onClick={() => createUser()}>Register</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}