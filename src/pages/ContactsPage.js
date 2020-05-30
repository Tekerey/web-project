import React from 'react';
import Page from './Page';
import Api from '../helpers/backendApi';

export default class ContactsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            contacts: []
        };
    }

    componentDidMount() {
        Api.getContactsLess()
        .then(
            (data) => {
                console.log(data);
                this.setState({
                    isLoaded: true,
                    contacts: data
                });
            },
            (err) => {
                console.log(err);
                this.setState({
                    isLoaded: true,
                    error: err
                });
            }
        );
    }

    render() {
        const { error, isLoaded, contacts } = this.state;

        let content = null;

        if (error) {
            content = <div>Ой! Щось пішло не так, спробуйте пізніше.</div>;
        } else if (!isLoaded) {
            content = <div>Завантаження...</div>
        } else {
            content = (
                <div>
                    <ul>
                        {contacts.map(el => (
                            <li key={el.id}>
                                <h3>{el.name}</h3>
                                {el.adressValue}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        }
        return (
            <Page>
                <h2>Contacts Page</h2>
                {content}
            </Page>
        );
    }
}