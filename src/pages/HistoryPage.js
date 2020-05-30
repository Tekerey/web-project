import React from 'react';
import Page from './Page';
import AuthService from '../helpers/authService';
import Api from '../helpers/backendApi';
import '../components/inputs.css';
import { withRouter, Redirect } from 'react-router-dom';
import Cookies from '../helpers/cookies';
import '../components/HistoryTable.css';
import moment from 'moment';

class HistoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.loadAppointments = this.loadAppointments.bind(this);
        this.cancelAppointment = this.cancelAppointment.bind(this);
        this.state = {
            isAuth: true,
            error: null,
            isLoaded: false,
            appointments: []
        }
    }

    cancelAppointment(id) {
        const ok = window.confirm('Ви точно хочете відмінити запис?');
        if (!ok) return;
        Api.deleteAppointment(id)
        .then(
            res => {
                if (!res.isAuth || !res.data) this.setState({error: true});
                else {
                    this.setState((state, props) => ({
                        appointments: state.appointments.filter(a => a.id !== id)
                    }));
                }
            } 
        )
    }

    loadAppointments() {
        Api.getAppointmentsByUser(Cookies.getCookie("user_id"))
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
                        appointments: res.data
                    });
                    // console.log(res.data);
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
                    // });
                    this.loadAppointments();
                }
            },
            err => {
                this.setState({
                    error: err
                });
            }
        );
    }

    render() {
        const { isAuth, isLoaded, appointments, error } = this.state;

        let content = null;

        if (error) {
            content = <div className='errorInfo'>Не вдалося завантажити дані.</div>;
        } else if (!isAuth) {
            return <Redirect to='/' />;
        } else if (!isLoaded) {
            content = <div>Завантаження...</div>; // Replace with loader
        } else {
            // Open appointments
            const open = appointments.filter(app => app.status === 'open');
            const close = appointments.filter(app => app.status === 'close');

            // Sort by date
            open.sort((a,b) => {
                return new Date(a.timeSlot.time) - new Date(b.timeSlot.time);
            });
            close.sort((a,b) => {
                return new Date(b.timeSlot.time) - new Date(a.timeSlot.time);
            });

            let openTable = null;
            let closeTable = null;

            if (open.length > 0) {
                openTable = (
                    <>
                    <h3>Поточні записи</h3>
                    <table className='HistoryTable'>
                        <thead>
                            <tr>
                                <th>Спеціальність лікаря</th>
                                <th>Ім'я лікаря</th>
                                <th>Час</th>
                                <th>Дата</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {open.map(a => {
                            return (
                                <tr key={a.id}>
                                    <td>{a.doctor.type.typeName}</td>
                                    <td>{`${a.doctor.firstName} ${a.doctor.lastName}`}</td>
                                    <td>{moment(a.timeSlot.time).format('HH:mm')}</td>
                                    <td>{moment(a.timeSlot.time).format('DD.MM.YYYY')}</td>
                                    <td><button onClick={(e) => this.cancelAppointment(a.id)}>Відмінити</button></td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    </>
                );
            } else openTable = <h3>Поточні записи відсутні.</h3>

            if (close.length > 0) {
                closeTable = (
                    <>
                    <h3>Пройдені записи</h3>
                    <table className='HistoryTable'>
                        <thead>
                            <tr>
                                <th>Спеціальність лікаря</th>
                                <th>Ім'я лікаря</th>
                                <th>Час</th>
                                <th>Дата</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {close.map(a => {
                            return (
                                <tr key={a.id}>
                                    <td>{a.doctor.type.typeName}</td>
                                    <td>{`${a.doctor.firstName} ${a.doctor.lastName}`}</td>
                                    <td>{moment(a.timeSlot.time).format('HH:mm')}</td>
                                    <td>{moment(a.timeSlot.time).format('DD.MM.YYYY')}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    </>
                );
            } else closeTable = <h3>Пройдені записи відсутні.</h3>

            content = (
                <div className='HistoryContainer'>
                    <h2>Історія записів</h2>
                    <div className='History-Open'>
                        {openTable}
                    </div>
                    <div className='History-Close'>
                        {closeTable}
                    </div>
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

export default withRouter(HistoryPage);

