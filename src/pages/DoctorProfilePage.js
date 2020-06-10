import React from 'react';
import Page from './Page';
import AuthService from '../helpers/authService';
import Api from '../helpers/backendApi';
import '../components/inputs.css';
import { withRouter, Redirect } from 'react-router-dom';
import Cookies from '../helpers/cookies';
import '../components/HistoryTable.css';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import Loader from '../components/Loader';

class DoctorProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.loadDoctor = this.loadDoctor.bind(this);
        this.selectDate = this.selectDate.bind(this);
        this.selectStartTime = this.selectStartTime.bind(this);
        this.selectEndTime = this.selectEndTime.bind(this);
        this.createWorkDay = this.createWorkDay.bind(this);
        this.selectDeleteDate = this.selectDeleteDate.bind(this);
        this.deleteWorkDay = this.deleteWorkDay.bind(this);
        this.reset = this.reset.bind(this);
        this.state = {
            isAuth: true,
            error: null,
            isLoaded: false,
            doctor: null,

            // Створення робочого дня
            date: null,
            startTime: null,
            endTime: null,
            isDateSelected: true,
            isStartTimeSelected: false,
            isEndTimeSelected: false,
            isWorkDayCreated: false,
            workdayError: null,
            workdayErrorText: null,
            
            // Видалення робочого дня
            deleteDate: null,
            isDeleteDateSelected: false,
            isDeletedWorkday: false,
            deleteError: null,
        };
    }

    deleteWorkDay(e) {
        e.preventDefault();
        // УДАЛЕНИЕ РАБОЧЕГО ДНЯ
        if (!this.state.isDeleteDateSelected) {
            this.setState({
                deleteError: 'Ви не вибрали день!',
            });
            return;
        }

        Api.deleteTimeSlots({
            doctorId: this.state.doctor.id,
            date: this.state.deleteDate,
        }).then(res => {
            if (!res.isAuth) this.setState({isAuth: false});
            else if (!res.isDeleted) {
                this.setState({
                    deleteError: 'Не вдалося видалити робочий день. Перевірте правильність даних.',
                });
            } else {
                this.setState({
                    isDeletedWorkday: true,
                });
            }
        });
    }

    selectDeleteDate(date) {
        this.setState({
            deleteDate: date,
            isDeleteDateSelected: true,
            deleteError: null,
        });
    }

    reset() {
        this.setState({
            date: null,
            startTime: null,
            endTime: null,
            isDateSelected: true,
            isStartTimeSelected: false,
            isEndTimeSelected: false,
            isWorkDayCreated: false,
            deleteDate: null,
            isDeleteDateSelected: false,
            isDeletedWorkday: false,
        });
        this.loadDoctor();
    }

    createWorkDay(e) {
        e.preventDefault();
        // СОЗДАНИЕ РАБОЧЕГО ДНЯ
        if (!this.state.isDateSelected || !this.state.isStartTimeSelected || !this.state.isEndTimeSelected) {
            this.setState({
                workdayError: true,
                workdayErrorText: 'Ви не заповнили всі поля!',
            });
            return;
        }
        // console.log(this.state.date);
        // console.log(this.state.startTime);
        // console.log(this.state.endTime);

        Api.createTimeSlots({
            doctorId: this.state.doctor.id,
            date: this.state.date,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
        }).then(res => {
            if (!res.isAuth) this.setState({isAuth: false});
            else if (!res.isCreated) {
                this.setState({
                    workdayError: true,
                    workdayErrorText: 'Не вдалося створити робочий день. Перевірте правильність даних.',
                });
            } else {
                this.setState({
                    isWorkDayCreated: true,
                });
            }
        });
    }

    selectDate(date) {
        this.setState({
          date: date,
          workdayError: null,
        });
    }

    selectStartTime(date) {
        if (this.state.endTime &&  (this.state.endTime - date) < 7200000) {
            this.setState({
                startTime: moment(this.state.endTime).subtract(2, 'hours').toDate(),
                isStartTimeSelected: true,
                workdayError: null,
            });
        } else {
            this.setState({
              startTime: date,
              isStartTimeSelected: true,
              workdayError: null,
            });
        }
    }

    selectEndTime(date) {
        if ((date - this.state.startTime) < 7200000) {
            this.setState({
                endTime: moment(this.state.startTime).add(2, 'hours').toDate(),
                isEndTimeSelected: true,
                workdayError: null,
            });
        } else {
            this.setState({
                endTime: date,
                isEndTimeSelected: true,
                workdayError: null,
            });
        }
    }

    loadDoctor() {
        Api.getDoctorByUser(Cookies.getCookie("user_id"))
        .then(
            res => {
                if (res) {
                    this.setState({
                        isLoaded: true,
                        doctor: res
                    });
                } else {
                    this.setState({
                        isLoaded: true,
                        error: 'Не вдалося знайти дані про лікаря.'
                    });
                }
            },
            err => this.setState({isLoaded: true, error: err})
        );
    }

    componentDidMount() {
        AuthService.auth().then(
            (res) => {
                if (!res.isAuth) {
                    this.setState({
                        isAuth: false
                    });
                    this.props.loginControl.setLoginState(false);
                } else {
                    this.loadDoctor();
                }
            },
            err => {
                this.setState({
                    error: 'Не вдалося завантажити дані.'
                });
            }
        );
    }

    render() {
        const { isAuth, isLoaded, doctor, error, date, isWorkDayCreated,
            startTime, endTime, workdayError, workdayErrorText,
            deleteDate, isDeletedWorkday, deleteError } = this.state;

        let content = null;

        if (isDeletedWorkday) {
            content = (
                <>
                <div className='justInfo'>Ви успішно видалили робочий день.</div>
                <button className='PrimaryButton' onClick={this.reset}>Назад</button>
                </>
            );
        } else if (isWorkDayCreated) {
            content = (
                <>
                <div className='justInfo'>Ви успішно створили новий робочий день.</div>
                <button className='PrimaryButton' onClick={this.reset}>Назад</button>
                </>
            );
        } else if (error) {
            content = <div className='errorInfo'>{error}</div>;
        } else if (!isAuth) {
            return <Redirect to='/' />;
        } else if (!isLoaded) {
            content = <Loader/>; // Replace with loader
        } else {

            console.log(doctor);

            // Open appointments
            const open = doctor.appointments.filter(app => app.status === 'open');
            const close = doctor.appointments.filter(app => app.status === 'close');

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
                    <div className='tableOverflowContainer'>
                        <table className='HistoryTable'>
                            <thead>
                                <tr>
                                    <th>Ім'я пацієнта</th>
                                    <th>Номер телефону</th>
                                    <th>Час</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                            {open.map(a => {
                                return (
                                    <tr key={a.id}>
                                        <td>{`${a.user.firstName} ${a.user.lastName}`}</td>
                                        <td>{a.user.phone}</td>
                                        <td>{moment(a.timeSlot.time).format('HH:mm')}</td>
                                        <td>{moment(a.timeSlot.time).format('DD.MM.YYYY')}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    </>
                );
            } else openTable = <h3>Поточні записи відсутні.</h3>

            if (close.length > 0) {
                closeTable = (
                    <>
                    <h3>Пройдені записи</h3>
                    <div className='tableOverflowContainer'>
                        <table className='HistoryTable'>
                            <thead>
                                <tr>
                                    <th>Ім'я пацієнта</th>
                                    <th>Номер телефону</th>
                                    <th>Час</th>
                                    <th>Дата</th>
                                </tr>
                            </thead>
                            <tbody>
                            {close.map(a => {
                                return (
                                    <tr key={a.id}>
                                        <td>{`${a.user.firstName} ${a.user.lastName}`}</td>
                                        <td>{a.user.phone}</td>
                                        <td>{moment(a.timeSlot.time).format('HH:mm')}</td>
                                        <td>{moment(a.timeSlot.time).format('DD.MM.YYYY')}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    </>
                );
            } else closeTable = <h3>Пройдені записи відсутні.</h3>

            // ВИРАХОВУЄМО НА ЯКІ ДНІ ЛІКАР ВЖЕ МАЄ РОБОЧИЙ ДЕНЬ ДЛЯ ТОГО ЩОБ ЗАБОРОНИТИ
            // ВИБИРАТИ ЦІ ДНІ.
            let workingDates = doctor.timeSlots.map(slot => {
                return moment(slot.time).toDate();
            });

            // Вираховуємо які дні лікар може видалити
            let bookedTimeSlots = doctor.timeSlots.filter(slot => {
                if (slot.status === 'booked') return true;
                return false;
            });
            let datesForDelete = workingDates.filter(date => {
                let canDelete = true;
                bookedTimeSlots.forEach(slot => {
                    if (moment(slot.time).format('DD.MM.YYYY') === moment(date).format('DD.MM.YYYY')) {
                        canDelete = false;
                    }
                });
                return canDelete;
            });

            content = (
                <>
                <div className='HistoryContainer'>
                    <h2>Записи пацієнтів</h2>
                    <div className='History-Open'>
                        {openTable}
                    </div>
                    <div className='History-Close'>
                        {closeTable}
                    </div>
                </div>
                {/* Створення робочих днів */}
                <div className='HistoryContainer'>
                    <h2>Додати робочий день</h2>
                    <form onSubmit={this.createWorkDay} className='InputForm' style={{alignItems: 'center',
                    maxWidth: '100%'}}>
                        <label>Виберіть день:</label>
                        <ReactDatePicker className='DateInput'
                            dateFormat='dd/MM/yyyy'
                            minDate={moment(new Date()).add(2, 'days').toDate()}
                            maxDate={moment(new Date()).add(90, 'days').toDate()}
                            excludeDates ={workingDates}
                            // highlightDates={workingDates}
                            selected={date ? date : null}
                            locale="uk"
                            onChange={this.selectDate}
                        />
                        <div className='InputRow'>
                            <div className='InputCol'>
                                <label>Початок робочого дня:</label>
                                <ReactDatePicker className='DateInput'
                                    selected={startTime ? startTime : null}
                                    onChange={this.selectStartTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Початок"
                                    dateFormat="HH:mm"
                                    locale="uk"
                                 />
                            </div>
                            <div className='InputCol'>
                                <label>Кінець робочого дня:</label>
                                <ReactDatePicker className='DateInput'
                                    selected={endTime ? endTime : null}
                                    onChange={this.selectEndTime}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={30}
                                    timeCaption="Кінець"
                                    dateFormat="HH:mm"
                                    locale="uk"
                                    minTime={startTime ? moment(startTime).add(1, 'hours').toDate() : null}
                                    maxTime={startTime ? moment(startTime).add(24, 'hours').toDate() : null}
                                 />
                            </div>
                            <button type='submit' className='PrimaryButton'>Додати</button>
                        </div>
                        {workdayError && <div className='errorInfo'>{workdayErrorText}</div>}
                    </form>
                </div>
                {/* Видалення робочих днів */}
                <div className='HistoryContainer'>
                    <h2>Видалити робочий день</h2>
                    <p>Ви не можете видалити дні, на які вже маєте записи від пацієнтів.</p>
                    <form onSubmit={this.deleteWorkDay} className='InputForm' style={{alignItems: 'center'}}>
                        <label>Виберіть день:</label>
                        <ReactDatePicker className='DateInput'
                            dateFormat='dd/MM/yyyy'
                            minDate={moment(new Date()).add(1, 'days').toDate()}
                            maxDate={moment(new Date()).add(90, 'days').toDate()}
                            includeDates={datesForDelete}
                            highlightDates={datesForDelete}
                            selected={deleteDate ? deleteDate : null}
                            locale="uk"
                            onChange={this.selectDeleteDate}
                        />
                        <div className='InputRow'>
                            <button type='submit' className='PrimaryButton'>Видалити</button>
                        </div>
                        {deleteError && <div className='errorInfo'>{deleteError}</div>}
                    </form>
                </div>
                </>
            );
        }

        return (
            <Page width='900px'>
                {content}
            </Page>
        );
    }
}

export default withRouter(DoctorProfilePage);

