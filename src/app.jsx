import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import { Jobs } from './jobs/jobs'
import { JobForm } from './jobForm/jobForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { UserMenu } from './jobs/UserMenu';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);
    const [editJob, setEditJob] = React.useState(null);
    const addJob = {
        title: '',
        company: '',
        date: '',
        status: 'Select Status',
        link: '',
        contact: '',
        notes: '',
        user: userName
    }

    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <h1 className="header-padding header-override">JobApp</h1>
                    <div className="header-icons-padding">
                        <a href="./search.html" className="header-icon"><img src="./icons/search.svg" style={{ filter: 'invert(100%)', width: '30px' }} /></a>
                        <button className="no-show-button" data-bs-toggle="modal" data-bs-target="#notificationModal">
                            <img id="notificationIcon" src="./icons/bell-slash.svg" style={{ filter: 'invert(100%)', width: '30px' }} />
                        </button>
                        {authState === AuthState.Authenticated && (
                            <UserMenu userName={userName} />
                        )}
                    </div>
                </header>

                <Routes>
                    <Route path='/' element={
                        <Login
                            userName={userName}
                            authState={authState}
                            onAuthChange={(userName, authState) => {
                                setAuthState(authState);
                                setUserName(userName);
                            }}
                        />
                    }
                        exact
                    />
                    <Route path='/jobs' element={<Jobs userName={userName} handleEdit={(editJob) => setEditJob(editJob)}/>}/>
                    <Route path='/edit' element={<JobForm editJob={editJob}/>}/>
                    <Route path='/add' element={<JobForm 
                        editJob={addJob}/>}/>
                </Routes>

                <footer>
                    <div><b>Trevor Bond</b></div>
                    <div><a href="https://github.com/trevorkbond/startup" target="_blank"><img src="./icons/github-white.svg" className="footer-icons" alt="GitHub Link" /></a></div>
                    <div><a href="https://www.linkedin.com/in/trevor-k-bond/" target="_blank"><img src="./icons/linkedin-white.png" className="footer-icons" alt="LinkedIn Link" /></a></div>
                </footer>
            </div>
        </BrowserRouter >
    );
}
