import React from 'react';
import Page from './Page';
import AuthService from '../helpers/authService';
import Api from '../helpers/backendApi';
import { withRouter, Redirect } from 'react-router-dom';
import '../components/inputs.css';

class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleSignup = this.handleSignup.bind(this);
        this.state = {
            isAuth: false,
            error: null,
            isSignuped: false,
            
            email: null,
            phone: null,
            firstName: null,
            lastName: null,
            password: null,

            emailError: false,
            emailErrorText: '',
            passwordError: false,
            passwordErrorText: '',
            phoneError: false,
            phoneErrorText: '',
            firstNameError: false,
            firstNameErrorText: '',
            lastNameError: false,
            lastNameErrorText: '',
        }
    }

    handleFocus(e) {
        const el = e.target;
        el.classList.remove('error');
        if (el.id === 'email') {
            this.setState({
                emailError: false
            });
        } else if (el.id === 'firstname') {
            this.setState({
                firstNameError: false
            });
        } else if (el.id === 'lastname') {
            this.setState({
                lastNameError: false
            });
        } else if (el.id === 'phone') {
            this.setState({
                phoneError: false
            });
        } else if (el.id === 'password') {
            this.setState({
                passwordError: false
            });
        }
    }

    componentDidMount() {
        AuthService.auth().then(
            (res) => {
                if (!res.isAuth) {
                    this.setState({
                        isAuth: false
                    });
                    this.props.setLoginState(false);
                } else {
                    this.setState({
                        isAuth: true
                    });                    
                }
            },
            err => {
                this.setState({
                    error: err
                });
            }
        );
    }

    handleSignup(e) {
        e.preventDefault();
        document.getElementById('email').classList.remove('error');
        document.getElementById('firstname').classList.remove('error');
        document.getElementById('lastname').classList.remove('error');
        document.getElementById('phone').classList.remove('error');
        document.getElementById('password').classList.remove('error');

        const formData = new FormData(document.getElementById('signupForm'));
        const body = {
            email: formData.get('email'),
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            phone: formData.get('phone'),
            password: formData.get('password'),
        };

        const noEmail = body.email.trim().length === 0;
        const noFirstName = body.firstName.trim().length === 0;
        const noLastName = body.lastName.trim().length === 0;
        const noPhone = body.phone.trim().length === 0;
        const noPassword = body.password.trim().length === 0;

        let errors = false;

        if (noEmail) {
            this.setState({
                emailError: true,
                emailErrorText: 'Введіть e-mail.',
            });
            errors = true;
        }
        if (noFirstName) {
            this.setState({
                firstNameError: true,
                firstNameErrorText: "Введіть ім'я.",
            });
            errors = true;
        }
        if (noLastName) {
            this.setState({
                lastNameError: true,
                lastNameErrorText: 'Введіть прізвище.'
            });
            errors = true;
        }
        if (noPhone) {
            this.setState({
                phoneError: true,
                phoneErrorText: 'Введіть номер телефону.'
            });
            errors = true;
        }
        if (noPassword) {
            this.setState({
                passwordError: true,
                passwordErrorText: 'Введіть пароль.'
            });
            errors = true;
        }

        
        if (!noPhone && (body.phone.trim().length < 10 || body.phone.trim().length > 10
         || !/^[0-9]+$/.test(body.phone.trim())) ) {
            this.setState({
                phoneError: true,
                phoneErrorText: 'Номер повинен складатися з 10 цифр'
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
            Api.createUser(body)
            .then(
                res => {
                    if (res.isSignup) {
                        this.setState({
                            isSignuped: true,
                        });
                    } else if (res.status === 'exist') {
                        this.setState({
                            error: 'Користувач з таким email вже існує.',
                        });
                    } else if (res.status === 'empty') {
                        this.setState({
                            error: 'Ви не заповнили всі поля.',
                        });
                    } else if (res.status === 'auth') {
                        this.setState({
                            isAuth: true,
                        });
                    }
                }
            );
        }
    }

    render() {
        const { isAuth, isSignuped, error } = this.state;

        let content;

        if (isSignuped) {
            content = <div className='justInfo'>Ви успішно зареєструвалися. Тепер ви можете увійти в свій аккаунт.</div>;
        } else if (error) {
            content = (
                <>
                <div className='errorInfo'>{error}</div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <button className='SecondaryButton'
                        onClick={(e) => {this.setState({isSignuped: false, error: null})}}>
                        Спробувати ще раз
                    </button>
                </div>
                </>
            );
        } else if (isAuth) {
            return <Redirect to='/' />;
        } else {
            content = (
                <div className='ProfileContainer'>
                    <h2>Реєстрація</h2>
                    <form id='signupForm' className='InputForm' onSubmit={this.handleSignup}
                        style={{marginBottom: '30px'}}>
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

                        <label htmlFor='firstname'>Ім'я:</label>
                        <input type='text' name='firstname' id='firstname' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.firstNameError &&
                            <div className='errorInfo'>
                                {this.state.firstNameErrorText}
                            </div>}
                        
                        <label htmlFor='lastname'>Прізвище:</label>
                        <input type='text' name='lastname' id='lastname' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.lastNameError &&
                            <div className='errorInfo'>
                                {this.state.lastNameErrorText}
                            </div>}

                        <label htmlFor='phone'>Номер телефону:</label>
                        <input type='phone' name='phone' id='phone' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.phoneError &&
                            <div className='errorInfo'>
                                {this.state.phoneErrorText}
                            </div>}
                        <button type='submit' className='PrimaryButton'>Зареєструватися</button>
                    </form>
                </div>
            );
        }

        return (
            <Page width='600px'>
                {content}
            </Page>
        );
    }
}

export default withRouter(SignupPage);