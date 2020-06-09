import React from 'react';
import './AppointmentForm.css';
import './inputs.css';
import Api from '../helpers/backendApi';
import moment from 'moment';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
// import Cookies from '../helpers/cookies';

import { registerLocale } from  "react-datepicker";
import { uk } from 'date-fns/locale';
registerLocale('uk', uk);

export default class AppointmentForm extends React.Component {
    constructor(props) {
        super(props);
        this.selectTimeSlot = this.selectTimeSlot.bind(this);
        this.selectDate = this.selectDate.bind(this);
        this.makeAppointment = this.makeAppointment.bind(this);
        this.state = {
            isTimeSlotsLoaded: false,
            error: null,
            timeSlots: null,
            date: null,
            isTimeSlotSelected: false,
            timeSlotId: null,
            isAppointmentBooked: false,
        };
    }

    selectDate(date) {
        this.setState({
          date: date,
          isTimeSlotSelected: false,
          timeSlotId: null,
        });
    }

    selectTimeSlot(slotId) {
        this.setState({
            isTimeSlotSelected: true,
            timeSlotId: slotId,
        });
    }

    makeAppointment() {
        Api.postAppointment({
            doctorId: this.props.doctor.id,
            timeSlotId: this.state.timeSlotId
        }).then(
            res => {
                if (res) {
                    // Успішний запис
                    this.setState({
                        isAppointmentBooked: true
                    });
                } else {
                    this.props.setLoginState(false);
                }
            }
        );
    }

    componentDidMount() {
        Api.getTimeSlotsByDoctor(this.props.doctor.id)
        .then(res => {
            if (res) {
                this.setState({
                    timeSlots: res,
                    isTimeSlotsLoaded: true
                });
            } else {
                this.setState({
                    isTimeSlotsLoaded: true
                })
            }
        }, error => {
            this.setState({
                isTimeSlotsLoaded: true,
                error: error,
            })
        });
    }

    render() {
        const { error, isTimeSlotsLoaded, isTimeSlotSelected,
            date, timeSlots, isAppointmentBooked } = this.state;

        let timeslotsContent;
        let workingDates = [];

        if (error) {
            timeslotsContent = <div className='errorInfo'>Не вдалося завантажити.</div>;
        } else if (isTimeSlotsLoaded && !timeSlots) {
            timeslotsContent = <div className='justInfo'>На жаль, цей лікар не працює.</div>
        } else if (timeSlots) {
            workingDates = timeSlots.filter(slot => {
                return moment(slot.time).format('yyyy-MM-dd') !== moment().format('yyyy-MM-dd');
            }).map(slot => {
                return moment(slot.time).toDate();
            });

            workingDates.sort((a,b) => {
                return a - b;
            })

            // Вибираємо таймслоти для відображення за поточною вибраною датою або першою робочою
            const slots = timeSlots.filter(slot => {
                const slotDate = moment(slot.time).format('yyyy-MM-DD');
                let selectedDate = date ? date : workingDates[0];
                selectedDate = moment(selectedDate).format('yyyy-MM-DD');
                return slotDate === selectedDate;
            });

            // Сортуємо таймслоти за датою (часом)
            slots.sort((a,b) => {
                return new Date(a.time) - new Date(b.time);
            });

            if (slots.length === 0) {
                timeslotsContent = <div className='justInfo'>В цей день лікар не працює.</div>
            } else {
                timeslotsContent = slots.map(slot => {
                    return <TimeSlotButton key={slot.id}
                     timeslot={slot} onClick={this.selectTimeSlot} />
                });
            }
        }

        if (isAppointmentBooked) {
            return (
                <div className='AppForm'>
                    <h2>Ви успішно записалися на прийом.</h2>
                </div>
            );
        }

        return (
            <div className='AppForm'>
                <h2>Запис на прийом</h2>
                <div className='AppForm-UpperBlock'>
                    <div className='AppForm-Container Date'>
                        <p className='AppForm-Label'>Виберіть дату:</p>
                        {/* <input type='date' name='date'></input> */}
                        <ReactDatePicker className='DateInput'
                            dateFormat='dd/MM/yyyy'
                            minDate={moment(new Date()).add(1, 'days').toDate()}
                            maxDate={moment(new Date()).add(90, 'days').toDate()}
                            includeDates={workingDates}
                            highlightDates={workingDates}
                            selected={date ? date : workingDates[0]}
                            locale="uk"
                            onChange={this.selectDate}
                        />
                    </div>
                    <div className='AppForm-Container Time'>
                        <p className='AppForm-Label'>Виберіть час:</p>
                        <div className='AppForm-TimeSlots'>
                            {timeslotsContent}
                        </div>
                    </div>
                </div>
                <button type='submit' className='AppButton PrimaryButton'
                 disabled={isTimeSlotSelected ? '' : 'disabled'}
                 onClick={this.makeAppointment}>
                    Записатися
                </button>
            </div>
        );
    }
}

export class TimeSlotButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        this.props.onClick(this.props.timeslot.id);
        document.querySelectorAll('.TimeSlotButton').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
    }

    render() {
        const timeslot = this.props.timeslot;
        const time = moment(timeslot.time).format('HH:mm');
        const status = timeslot.status;

        let booked = status === 'booked';

        return (
            <button className={`TimeSlotButton ${booked ? 'Booked' : ''}`}
            disabled={booked ? 'disabled' : ''} onClick={this.handleClick}>
                {time}
            </button>
        )
    }
}