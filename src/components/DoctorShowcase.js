import React from 'react';
import './DoctorShowcase.css';
import photo from './images/doctor.svg';
import { withRouter } from 'react-router-dom';

class DoctorShowcase extends React.Component {
    constructor(props) {
        super(props);
        this.openDoctorPage = this.openDoctorPage.bind(this);
    }

    openDoctorPage(e) {
        this.props.history.push(`/doctors?id=${this.props.doctor.id}`);
    }

    render() {
        const doc = this.props.doctor;

        return (
            <div className='DoctorShowcase' onClick={this.openDoctorPage}>
                <div className='DoctorShowcase-Img'>
                    <img src={doc.photoPath ? require(`${doc.photoPath}`) : photo}
                     alt={doc.firstName + doc.lastName}></img>
                </div>
                <div className='DoctorShowcase-Info'>
                    <div className='DoctorShowcase-Name'>{`${doc.firstName} ${doc.lastName}`}</div>
                    <div>
                        <span>{this.props.type.typeName}</span>
                        <span className='DoctorShowcase-Price'>{doc.comments.length} відгуків</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(DoctorShowcase);