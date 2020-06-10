import React from 'react';
import Page from './Page';
import MainPageBlock from '../components/MainPageBlock';
import { withRouter } from 'react-router-dom';

import img1 from '../images/slide_doctors.jpg';
import img2 from '../images/slide_app.jpg';
import img3 from '../images/slide_3.jpg';

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.redirectToDoctors = this.redirectToDoctors.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this);
        this.redirectToContacts = this.redirectToContacts.bind(this);
        this.redirectToHistory = this.redirectToHistory.bind(this);
    }

    redirectToDoctors() {
        this.props.history.push('/doctors');
    }

    redirectToLogin() {
        this.props.history.push('/login');
    }

    redirectToHistory() {
        this.props.history.push('/profile/history');
    }

    redirectToContacts() {
        this.props.history.push('/contacts');
    }

    render() {
        return (
            <Page>
                <MainPageBlock
                    title='Професійні лікарі'
                    text='На нашому сайті ви знайдете лише найкращих лікарів.'
                    btnText='Список лікарів'
                    btnCallback={this.redirectToDoctors}
                    img={img1}
                    imgAlt='Професійні лікарі'
                />
                <MainPageBlock
                    title='Швидкий запис на прийом'
                    text={this.props.isLoggedIn ?
                    `Записатися на прийом дуже легко і швидко.
                    Окрім того, ви завжди можете переглянути історію своїх записів.`
                    : `Записатися на прийом дуже легко і швидко. Увійдіть
                    до свого облікового запису та запишіться прямо зараз.`}
                    btnText={this.props.isLoggedIn ?
                    'Переглянути історію записів' : 'Увійти'}
                    btnCallback={this.props.isLoggedIn ?
                        this.redirectToHistory : this.redirectToLogin}
                    img={img2}
                    imgAlt='Швидкий запис на прийом'
                    inverse
                />
                <MainPageBlock
                    title='Якісні поліклініки'
                    text='Наші лікарі працюють в найкращих поліклініках.
                    Переглянути їх місцезнаходження можна на сторінці контактів.'
                    btnText='Переглянути місцезнаходження'
                    btnCallback={this.redirectToContacts}
                    img={img3}
                    imgAlt='Якісні поліклініки'
                />
            </Page>
        );
    }
}

export default withRouter(HomePage);