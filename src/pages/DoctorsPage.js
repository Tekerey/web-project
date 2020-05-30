import React from 'react';
import Page from './Page';
import Api from '../helpers/backendApi';
import { SideMenu, SideMenuCategory, SideMenuItem } from '../components/SideMenu';
import DoctorShowcase from '../components/DoctorShowcase';
import Breadcrumb from '../components/Breadcrumb';
import DoctorPage from '../components/DoctorPage';
import { withRouter } from 'react-router-dom';
import Pagination from '../components/Pagination';

class DoctorsPage extends React.Component {
    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this);
        this.showAll = this.showAll.bind(this);
        this.filterByContact = this.filterByContact.bind(this);
        this.filterByDoctorType = this.filterByDoctorType.bind(this);
        this.state = {
            isLoadedTypes: false,
            errorTypes: null,
            doctorTypes: null,
            contacts: null,
            errorContacts: null,
            isLoadedContacts: false,
            allDoctors: null,
            visibleDoctors: null,
            curPage: 0
        };
    }

    setPage(page) {
        this.setState({
            curPage: page
        });
    }

    showAll() {
        this.setState({
            visibleDoctors: this.state.allDoctors,
            curPage: 0
        });
        this.props.history.push(`/doctors`);
    }

    filterByContact(id) {
        // alert(id);
        const doctors = this.state.allDoctors.filter(doc => doc.adressId === id);
        this.setState({
            visibleDoctors: doctors,
            curPage: 0
        });
        this.props.history.push(`/doctors`);
    }

    filterByDoctorType(id) {
        //alert('sdsd');
        const doctors = this.state.allDoctors.filter(doc => doc.typeId === id);
        this.setState({
            visibleDoctors: doctors,
            curPage: 0
        });
        this.props.history.push(`/doctors`);
    }

    componentDidMount() {
        Api.getDoctorTypes()
        .then(
            (types) => {
                console.log(types);
                if (types) {
                    // Нужно собрать вместе всех докторов со всех типов
                    const doctors = types.reduce((base, next) => {
                        return base.concat(next.doctors);
                    }, []);

                    this.setState({
                        isLoadedTypes: true,
                        doctorTypes: types,
                        allDoctors: doctors,
                        visibleDoctors: doctors
                    });
                } else {
                    this.setState({
                        isLoadedTypes: true,
                        errorTypes: true
                    })
                }
            },
            (error) => {
                console.log(error);
                this.setState({
                    isLoadedTypes: true,
                    errorTypes: error
                });
            }
        );
        Api.getContactsLess()
        .then(
            (contacts) => {
                if (contacts) {
                    this.setState({
                        contacts: contacts,
                        isLoadedContacts: true
                    });
                }
            },
            (error) => {
                console.log(error);
                this.setState({
                    isLoadedContacts: true,
                    errorContacts: error
                });
            }
        )
    }

    render() {
        const { errorTypes, errorContacts, isLoadedTypes,
            isLoadedContacts, doctorTypes, contacts,
            visibleDoctors, curPage } = this.state;

        //console.log(visibleDoctors);

        let content = null;
        let sideMenuContacts = null;
        let sideMenuDoctorTypes = null;
        let breadcrumbs = null;

        // SideMenu render
        if (errorContacts) {
            sideMenuContacts = <div className='ErrorMessage'>Не вдалося завантажити.</div>;
        } else if (!isLoadedContacts) {
            // Fill
        } else {
            sideMenuContacts = (
                <SideMenuCategory name='Поліклініки'>
                    {contacts.map(contact => {
                        return <SideMenuItem key={contact.id} id={contact.id} name={contact.name}
                         callback={this.filterByContact} />
                    })}
                </SideMenuCategory>
            );
        }

        // Content render + part of side menu where types
        if (errorTypes) {
            content = <div className='ErrorMessage'>Ой! Щось пішло не так, спробуйте пізніше.</div>;
        } else if (!isLoadedTypes || !isLoadedContacts) {
            content = <div>Завантаження...</div>; // Replace with loader
        } else {
            // Якщо завантажили дані без помилок
            const params = new URLSearchParams(this.props.location.search);
            const doctorId = Number.parseInt( params.get('id') );
            const doctor = visibleDoctors.find(doc => doc.id === doctorId);
            if (doctorId && doctor) {
                // СТОРІНКА ЛІКАРЯ
                content = (
                    <DoctorPage doctor={doctor}
                     type={doctorTypes.find(type => type.id === doctor.typeId)}
                     adress={contacts.find(c => c.id === doctor.adressId)} />
                );
                breadcrumbs = (
                    <Breadcrumb currentLocText={`${doctor.firstName} ${doctor.lastName}`} links={[
                        {path: '/', text: 'Головна сторінка'},
                        {path: '/doctors', text: 'Лікарі'}
                    ]} />
                );
            } else {
                // СПИСОК ЛІКАРІВ
                //вираховуємо сторінку
                const pages = Math.ceil(visibleDoctors.length / 12);
                const firstItemIndex = curPage * 12;
                const doctorsPerPage = visibleDoctors.slice(firstItemIndex,
                     firstItemIndex + 12);

                content = (
                    <>
                    <h2 className='PageTitle'>Список лікарів</h2>
                    <div className='SortingBlock'>Тут будуть інпути для сортування</div>
                    <div className='DoctorList'>
                        {doctorsPerPage.map(doc => (
                            <DoctorShowcase key={doc.id} doctor={doc}
                            type={doctorTypes.find(type => type.id === doc.typeId)} />
                        ))}
                    </div>
                    <Pagination pages={pages} curPage={curPage} callback={this.setPage}/>
                    </>
                );
                breadcrumbs = (
                    <Breadcrumb currentLocText='Лікарі' links={[
                        {path: '/', text: 'Головна сторінка'}
                    ]} />
                );
            }
            sideMenuDoctorTypes = (
                <SideMenuCategory name='Спеціальності'>
                    {doctorTypes.map(type => {
                        return <SideMenuItem key={type.id} id={type.id} name={type.typeName}
                         callback={this.filterByDoctorType} />
                    })}
                </SideMenuCategory>
            );
        }
        return (
            <div className='PageContainer'>
                <SideMenu title='Фільтр:'>
                    <SideMenuItem name='Всі лікарі' callback={this.showAll} />
                    {sideMenuContacts}
                    {sideMenuDoctorTypes}
                </SideMenu>
                <Page marginLeft='10px'>
                    {breadcrumbs}
                    {content}
                </Page>
            </div>
        );
    }
}

export default withRouter(DoctorsPage);