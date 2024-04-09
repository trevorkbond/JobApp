import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { AuthState } from './login/authState';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
    const [userName, setUserName] = React.useState(localStorage.getItem('userName') || '');
    const currentAuthState = userName ? AuthState.Authenticated : AuthState.Unauthenticated;
    const [authState, setAuthState] = React.useState(currentAuthState);

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
                        <a id="userPopover" className="header-icon" tabIndex="0" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="Not changed">
                            <img src="./icons/person.svg" style={{ filter: 'invert(100%)', width: '30px' }} />
                        </a>
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
