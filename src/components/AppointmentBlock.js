import React from 'react';
import './AppointmentBlock.css';
import './inputs.css';
import AuthService from '../helpers/authService';
import AppointmentForm from './AppointmentForm';
import Cookies from '../helpers/cookies';

export default class AppointmentBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            isAuthChecked: false
        }
    }

    componentDidMount() {
        AuthService.auth()
        .then(
            res => {
                if (res.isAuth) {
                    this.setState({
                        isAuthChecked: true,
                        isAuth: true,
                    });
                } else {
                    // Вставить изменение состояния
                    this.props.setLoginState(false);
                    this.setState({
                        isAuthChecked: true,
                        isAuth: false,
                    });
                }
            }
        );
    }

    render() {
        const { isAuth, isAuthChecked } = this.state;
        let content = null;

        // Не можна записуватися до самого себе!
        if (this.props.doctor.userId === Number.parseInt(Cookies.getCookie('user_id'))) {
            return (
                <div className='AppointmentBlock'>
                    <div className='justInfo'>
                        <b>Ви не можете записатися до самого себе. :(</b>
                    </div>
                </div>
            );
        }
        if ((isAuthChecked && !isAuth) || !this.props.isLoggedIn) {
            content = (
                <div className='justInfo'>
                    <b>Увійдіть до свого аккаунту для того, щоб записатися на прийом.</b>
                </div>
            );
        } else if (isAuth) {
            content =(
                <AppointmentForm doctor={this.props.doctor}
                    setLoginState={this.props.setLoginState} />
            );
        }

        return (
            <div className='AppointmentBlock'>
                {content}
            </div>
        );
    }
}