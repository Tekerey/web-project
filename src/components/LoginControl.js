import React from 'react';
import { withRouter } from 'react-router-dom';
import './LoginControl.css';
import LoginButton from './LoginButton';
import AuthService from '../helpers/authService';

class LoginControl extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogin() {
        this.props.history.push('/login');
    }

    handleLogout() {
        AuthService.logout()
        .then(
            () => {
                this.props.onLogOut();
                this.props.history.push('/');
            },
            (error) => console.log(error)
        );
    }

    render() {
        const isLoggedIn = this.props.isLoggedIn;
        let button;
        if (isLoggedIn) {
            button = <LoginButton text='Вийти' onClick={this.handleLogout} />
        } else {
            button = <LoginButton text='Увійти' onClick={this.handleLogin} />
        }

        return (
            <div className='Login-panel'>
                {button}
            </div>
        );
    };
}

export default withRouter(LoginControl);