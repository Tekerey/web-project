import React from 'react';
import Page from './Page';
import AuthService from '../helpers/authService';
import Api from '../helpers/backendApi';
import { withRouter, Redirect } from 'react-router-dom';
import Cookies from '../helpers/cookies';
import '../components/inputs.css';

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.loadUserData = this.loadUserData.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.fillInputs = this.fillInputs.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.state = {
            isAuth: true,
            error: null,
            isLoaded: false,
            userData: null,
            isUpdated: false,
            
            email: null,
            phone: null,
            firstName: null,
            lastName: null,

            emailError: false,
            emailErrorText: '',
            // passwordError: false,
            // passwordErrorText: '',
            phoneError: false,
            phoneErrorText: '',
            firstNameError: false,
            firstNameErrorText: '',
            lastNameError: false,
            lastNameErrorText: '',
        }
    }

    fillInputs(user) {
        document.getElementById('firstname').value = user.firstName;
        document.getElementById('email').value = user.email;
        document.getElementById('lastname').value = user.lastName;
        document.getElementById('phone').value = user.phone;
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
        }
    }

    loadUserData() {
        Api.getUserData(Cookies.getCookie("user_id"))
        .then(
            res => {
                if (!res.isAuth) this.setState({isAuth: false});
                else if (!res.data) {
                    this.setState({
                        isLoaded: true,
                        error: true
                    }); 
                } else {
                    this.setState({
                        isLoaded: true,
                        userData: res.data
                    });
                    console.log(res.data);
                    this.fillInputs(res.data);
                }
            },
            err => this.setState({isLoaded: true, error: err})
        );
    }

    componentDidMount() {
        AuthService.auth().then(
            (res) => {
                if (!res.isAuth) {
                    //this.props.history.push('/');
                    this.setState({
                        isAuth: false
                    });
                    this.props.loginControl.setLoginState(false);
                } else {
                    // this.setState({
                    //     isAuth: true
                    // })
                    this.loadUserData();
                }
            },
            err => {
                this.setState({
                    error: err
                });
            }
        );
    }

    handleUpdate(e) {
        e.preventDefault();
        document.getElementById('email').classList.remove('error');
        document.getElementById('firstname').classList.remove('error');
        document.getElementById('lastname').classList.remove('error');
        document.getElementById('phone').classList.remove('error');

        const formData = new FormData(document.getElementById('updateForm'));
        const body = {
            email: formData.get('email'),
            firstName: formData.get('firstname'),
            lastName: formData.get('lastname'),
            phone: formData.get('phone'),
        };

        const noEmail = body.email.trim().length === 0;
        const noFirstName = body.firstName.trim().length === 0;
        const noLastName = body.lastName.trim().length === 0;
        const noPhone = body.phone.trim().length === 0;

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
        
        if (!noPhone && (body.phone.trim().length < 10 || body.phone.trim().length > 10
         || !/^[0-9]+$/.test(body.phone.trim())) ) {
            this.setState({
                phoneError: true,
                phoneErrorText: 'Номер повинен складатися з 10 цифр'
            });
            errors = true;
        }

        if (!errors) {
            console.log('NO ERRORS IN INPUTS');
            Api.updateUserData(body)
            .then(
                res => {
                    if (!res.isAuth) this.setState({isAuth: false});
                    else if (!res.data) {
                        this.setState({
                            error: true
                        }); 
                    } else {
                        this.setState({
                            isUpdated: true
                        });
                    }
                },
                err => {
                    this.setState({isLoaded: true, error: err})
                }
            );
        }
    }

    render() {
        const { isAuth, isLoaded, isUpdated, error } = this.state;

        // console.log(userData);

        let content;

        if (isUpdated) {
            content = <div className='justInfo'>Зміни збережено.</div>;
        } else if (error) {
            content = <div className='errorInfo'>Не вдалося завантажити дані.</div>;
        } else if (!isAuth) {
            return <Redirect to='/' />;
        } else if (!isLoaded) {
            content = <div>Завантаження...</div>; // Replace with loader
        } else {
            // Put here UserProfile component
            content = (
                <div className='ProfileContainer'>
                    <h2>Інформація користувача</h2>
                    <form id='updateForm' className='InputForm' onSubmit={this.handleUpdate}
                        style={{marginBottom: '30px'}}>
                    <label htmlFor='email'>E-mail:</label>
                        <input type='email' name='email' id='email' className='Input'
                            onFocus={this.handleFocus}></input>
                        {this.state.emailError &&
                            <div className='errorInfo'>
                                {this.state.emailErrorText}
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
                        <button type='submit' className='PrimaryButton'>Внести зміни</button>
                    </form>
                </div>
            );
        }

        return (
            <Page width='900px'>
                {/* {breadcrumbs} */}
                {content}
            </Page>
        );
    }
}

export default withRouter(ProfilePage);