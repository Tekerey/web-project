import React from 'react';
import Page from './Page';
import Api from '../helpers/backendApi';
import Loader from '../components/Loader';

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
            content = <Loader/>;
        } else {
            content = (
                <div>
                    {contacts.map(el => {
                        let map;

                        switch (el.id) {
                            case 1:
                                map = <iframe className='ContactMap' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2542.042585381868!2d30.524293215895284!3d50.421678197318485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cf171ab41311%3A0xc9f07898a38b5e71!2z44CQTUVESUtPTeOAkdCa0LvRltC90ZbQutCwINC90LAg0J_QtdGH0LXRgNGB0YzQutGDOiDQotC10YDQsNC_0LXQstGCLCDQk9GW0L3QtdC60L7Qu9C-0LMsINCj0YDQvtC70L7Qsywg0JvQntCgLCDQo9CX0JQ!5e0!3m2!1sru!2sua!4v1591699337192!5m2!1sru!2sua" width="600" height="450" frameBorder="0" style={{border:0}} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
                                break;
                            case 2:
                                map = <iframe className='ContactMap' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2538.031322621689!2d30.517883615897293!3d50.49637479193561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4d1f8e1fff5c5%3A0x104622dbc77a48e8!2z44CQTUVESUtPTeOAkTog0J_RgNC10LzRltGD0Lwt0LrQu9GW0L3RltC60LA!5e0!3m2!1sru!2sua!4v1591711264021!5m2!1sru!2sua" width="600" height="450" frameBorder="0" style={{border:0}} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
                                break;
                            case 3:
                                map = <iframe className='ContactMap' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2536.581652342!2d30.462714215898128!3d50.5233503899902!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4d28b080a543d%3A0x388c84fcebbced50!2z4pyqIOOAkE1FRElLT03jgJEg0JrQu9C40L3QuNC60LAg0L3QsCDQntCx0L7Qu9C-0L3QuDog0KLRgNCw0LLQvNC_0YPQvdC60YIsINCd0LXQvtGC0LvQvtC20L3QsNGPINCf0L7QvNC-0YnRjA!5e0!3m2!1sru!2sua!4v1591711499016!5m2!1sru!2sua" width="600" height="450" frameBorder="0" style={{border:0}} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
                                break;
                            default:
                                break;
                        }

                        return (
                        <div key={el.id} className='ContactBlock'>
                            <div className='ContactInfo'>
                                <h3>{el.name}</h3>
                                <div><b>Адреса:</b> {el.adressValue}</div>
                                <div><b>Телефон:</b> {el.phone}</div>
                            </div>
                            <div style={{flex: '1 1 50%'}}>
                                {map}
                            </div>
                        </div>
                        );
                    })}
                </div>
            );
        }
        return (
            <Page>
                <center><h1>Контакти</h1></center>
                {content}
            </Page>
        );
    }
}