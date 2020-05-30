import React from 'react';
import Page from './Page';
import './Page.css';
import '../components/inputs.css';
import { Link, withRouter } from 'react-router-dom';
import AuthService from '../helpers/authService';

class LogInPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.state = {
            emailError: false,
            emailErrorText: '',
            passwordError: false,
            passwordErrorText: ''
        };
    }

    componentDidMount() {
        AuthService.auth().then(
            (res) => {
                if (res.isAuth) {
                    this.props.history.push('/');
                }
            }
        );
    }

    handleFocus(e) {
        const el = e.target;
        el.classList.remove('error');
        if (el.id === 'email') {
            this.setState({
                emailError: false
            });
        } else if (el.id === 'password') {
            this.setState({
                passwordError: false
            });
        }
    }

    handleLogin(e) {
        e.preventDefault();
        document.getElementById('email').classList.remove('error');
        document.getElementById('password').classList.remove('error');

        const formData = new FormData(document.getElementById('loginForm'));
        const body = {
            email: formData.get('email'),
            password: formData.get('password'),
        };

        const noEmail = body.email.trim().length === 0;
        const noPassword = body.password.trim().length === 0;

        let errors = false;

        if (noEmail && noPassword) {
            this.setState({
                emailError: true,
                emailErrorText: 'Введіть e-mail.',
                passwordError: true,
                passwordErrorText: 'Введіть пароль.'
            });
            errors = true;
        } else if (noEmail) {
            this.setState({
                emailError: true,
                emailErrorText: 'Введіть e-mail.',
                passwordError: false
            });
            errors = true;
        } else if (noPassword) {
            this.setState({
                emailError: false,
                passwordError: true,
                passwordErrorText: 'Введіть пароль.'
            });
            errors = true;
        }
        
        if (!noPassword && body.password.trim().length <= 6) {
            this.setState({
                passwordError: true,
                passwordErrorText: 'Пароль повинен бути довшим за 6 символів.'
            });
            errors = true;
        }

        if (!errors) {
            AuthService.login(body)
            .then(
                result => {
                    if (result.isLogged) {
                        this.props.setLoginState(true);
                        // Добавить возможность указывать редирект ссылку
                        this.props.history.push('/');
                    } else {
                        if (result.status === 'email') {
                            document.getElementById('email').classList.add('error');
                            this.setState({
                                emailError: true,
                                emailErrorText: 'Немає користувача з таким e-mail.',
                                passwordError: false
                            });
                        } else {
                            document.getElementById('password').classList.add('error');
                            this.setState({
                                emailError: false,
                                passwordError: true,
                                passwordErrorText: 'Неправильний пароль.'
                            });
                        }
                    }
                },
                error => {
                    console.log(error);
                }
            );            
        }
    }

    render() {
        return (
            <Page width='600px'>
                <div className='LogInPage-container'>
                    <h2>Вхід</h2>
                    <form id='loginForm' onSubmit={this.handleLogin} className='InputForm'>
                        <label htmlFor='email'>E-mail:</label>
                        <input type='email' name='email' id='email' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.emailError &&
                            <div className='errorInfo'>
                                {this.state.emailErrorText}
                            </div>}
                        <label htmlFor='password'>Пароль:</label>
                        <input type='password' name='password' id='password' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.passwordError &&
                            <div className='errorInfo'>
                                {this.state.passwordErrorText}
                            </div>}
                        <button type='submit' className='PrimaryButton'>Увійти</button>
                        <Link to='/signup' className='SecondaryButton'>
                            Зареєструватися
                        </Link>
                    </form>
                </div>
            </Page>
        );
    }
}

export default withRouter(LogInPage);