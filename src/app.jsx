import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import { Jobs } from './jobs/jobs'
import { JobForm } from './jobForm/jobForm';
import { Delete } from './delete/delete';
import { Search } from './search/search';
import { useEffect } from 'react';
import { JobEventNotifier, initializeJobNotifier } from './jobs/jobNotifier';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { UserMenu } from './jobs/UserMenu';
import { SharedJobModal } from './jobs/sharedJobModal';
import { Button } from 'react-bootstrap';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);
    const [editJob, setEditJob] = React.useState(null);
    const [delJob, setDelJob] = React.useState(null);
    const [searchJob, setSearchJob] = React.useState(null);
    const [events, setEvents] = React.useState([]);
    const [sharedJob, setSharedJob] = React.useState(null);
    const [showModal, setShowModal] = React.useState(false);
    const [jobNotifier, setJobNotifier] = React.useState(null);

    async function getNotifier() {
        await initializeJobNotifier();
        return JobEventNotifier.getInstance();
    }

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

    function toggleModal() {
        setShowModal(!showModal);
    }

    useEffect(() => {
        const initialize = async () => {
            try {
                const notifier = await initializeJobNotifier();
                setJobNotifier(notifier);
            } catch (error) {
                console.error('Error initializing JobNotifier:', error);
            }
        };

        initialize();
    }, []);

    useEffect(() => {
        if (jobNotifier) {
            // Ensure jobNotifier is initialized before accessing its methods
            jobNotifier.addHandler(handleJobEvent);
            setSearchJob(null);
        }
    }, [jobNotifier]);
    
    

    function handleJobEvent(event) {
        setEvents([...events, event]);
    }

    function doSearch(job) {
        setEditJob(job);
        setSearchJob(job);
    }

    function ignoreSharedJob() {
        setEvents([]);
    }

    function createMessageArray() {
        const messageArray = [];
        for (const [i, event] of events.entries()) {
            messageArray.push(
                <div key={i} style={{ borderBottom: '1px solid black', marginTop: '.5em' }}>
                    <p>{event.user} shared a {event.title} position at {event.company} with you. Would you like to add or ignore the job?</p>
                    <div className='buttons-container'>
                        <NavLink to='add-searched'>
                            <Button className='btn btn-dark padding-button-override-small' onClick={() => { doSearch(event); closeModal(); }}>Add</Button>
                        </NavLink>
                        <Button className='btn btn-dark padding-button-override-small' onClick={ignoreSharedJob} >Ignore</Button>
                    </div>
                </div>
            );
        }
        return messageArray;
    }

    return (
        <BrowserRouter>
            <div className="app">
                <header>
                    <h1 className="header-padding header-override">JobApp</h1>
                    <div className="header-icons-padding">
                        {authState === AuthState.Authenticated && (<NavLink className="header-icon" to='/search'>
                            <img src="./icons/search.svg" style={{ filter: 'invert(100%)', width: '30px' }} />
                        </NavLink>)}
                        {authState === AuthState.Authenticated && (<SharedJobModal sharedJobs={createMessageArray(toggleModal)} isShow={showModal} closeModal={toggleModal} />
                        )}
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
                    <Route path='/jobs' element={<Jobs userName={userName}
                        handleEdit={(editJob) => setEditJob(editJob)}
                        handleDelete={(delJob) => setDelJob(delJob)} />} />
                    <Route path='/edit' element={<JobForm editJob={editJob} userName={userName} />} />
                    <Route path='/add' element={<JobForm
                        editJob={addJob} userName={userName} />} />
                    <Route path='/add-searched' element={<JobForm
                        editJob={editJob} searchJob={searchJob} userName={userName} />} />
                    <Route path='/delete' element={<Delete delJob={delJob} />} />
                    <Route path='/search' element={<Search handleSearch={(searchJob) => setSearchJob(searchJob)}
                        handleEdit={(editJob) => setEditJob(editJob)} />} />
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
