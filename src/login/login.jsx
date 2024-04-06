import React from 'react';

import { Unauthenticated } from './unauthenticated';
// import { Authenticated } from './authenticated';
import { AuthState } from './authState';

export function Login({ userName, authState, onAuthChange }) {
    return (
        <Unauthenticated
            userName={userName}
            onLogin={(loginUserName) => {
                onAuthChange(loginUserName, AuthState.Authenticated);
            }}
        />
    );
}