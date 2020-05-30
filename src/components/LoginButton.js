import React from 'react';
import './LoginControl.css';
import {ReactComponent as UserIcon} from './user.svg'

function LoginButton(props) {
    return (
        <button className='Login-button' onClick={props.onClick}>
            <UserIcon/>
            <span>{props.text}</span>
        </button>
    );
}

export default LoginButton;