import React from 'react';
import './DoctorPage.css';
import photo from './images/doctor.svg';
import AppointmentBlock from './AppointmentBlock';
import { UserContext } from '../helpers/UserContext';

export default class DoctorPage extends React.Component {
    render() {
        const doc = this.props.doctor;
        const type = this.props.type;
        const adress = this.props.adress;

        return (
            <div className='DoctorPage'>
                <div className="Doctor-Info">
                    <div className='Doctor-Info-Left'>
                        <div className='DoctorPage-Image'>
                            <img src={doc.photoPath ? require(`${doc.photoPath}`) : photo}
                            alt={doc.firstName + doc.lastName} />
                        </div>
                        <div className='Doctor-Info-Rating'>Rating here</div>
                    </div>
                    <div className='Doctor-Info-Right'>
                        <div className='Doctor-Info-Name'>
                            {doc.firstName} {doc.lastName}
                        </div>
                        <div className='Doctor-Info-type'>
                            <span><b>{type.typeName}</b></span>
                            <span><b>Стаж роботи:</b> {doc.workingYears} років</span>
                        </div>
                        <div className='Doctor-Info-Adress'>
                            <span><b>{adress.name}</b></span>
                            <span><b>Адреса:</b> {adress.adressValue}</span>
                            <span><b>Номер телефону:</b> {adress.phone}</span>
                        </div>
                        <div className='Doctor-Info-Desciption'>
                            <p>{doc.description}</p>
                        </div>
                    </div>
                </div>
                <div className='Appointment-conatainer'>
                    <UserContext.Consumer>
                        {({isLoggedIn, setLoginState}) => {
                            return <AppointmentBlock doctor={doc} setLoginState={setLoginState}
                                isLoggedIn={isLoggedIn} />
                        }}
                    </UserContext.Consumer>
                </div>
            </div>
        );
    }
}