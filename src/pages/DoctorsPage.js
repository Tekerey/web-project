import React from 'react';
import Page from './Page';
import Api from '../helpers/backendApi';
import { SideMenu, SideMenuCategory, SideMenuItem } from '../components/SideMenu';
import DoctorShowcase from '../components/DoctorShowcase';
import Breadcrumb from '../components/Breadcrumb';
import DoctorPage from '../components/DoctorPage';
import { withRouter } from 'react-router-dom';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';

class DoctorsPage extends React.Component {
    constructor(props) {
        super(props);
        this.setPage = this.setPage.bind(this);
        this.showAll = this.showAll.bind(this);
        this.filterByContact = this.filterByContact.bind(this);
        this.filterByDoctorType = this.filterByDoctorType.bind(this);
        this.sortDoctors = this.sortDoctors.bind(this);
        this.state = {
            isLoadedTypes: false,
            errorTypes: null,
            doctorTypes: null,
            contacts: null,
            errorContacts: null,
            isLoadedContacts: false,
            allDoctors: null,
            visibleDoctors: null,
            curPage: 0,
            sort: null,
        };
    }

    setPage(page) {
        this.setState({
            curPage: page
        });
    }

    showAll() {
        if (this.state.sort) this.sort(this.state.sort, this.state.allDoctors);
        this.setState({
            visibleDoctors: this.state.allDoctors,
            curPage: 0
        });
        this.props.history.push(`/doctors`);
    }

    sort(val, doctors) {
        switch (val) {
            case 'name':
                doctors.sort((a,b) => {
                    if (a.firstName < b.firstName) return -1;
                    else if (a.firstName > b.firstName) return 1;
                    else return 0;
                });
                break;
            case 'lastname':
                doctors.sort((a,b) => {
                    if (a.lastName < b.lastName) return -1;
                    else if (a.lastName > b.lastName) return 1;
                    else return 0;
                });
                break;
            case 'price1':
                doctors.sort((a,b) => {
                    if (a.price < b.price) return -1;
                    else if (a.price > b.price) return 1;
                    else return 0;
                });
                break;
            case 'price2':
                doctors.sort((a,b) => {
                    if (a.price < b.price) return 1;
                    else if (a.price > b.price) return -1;
                    else return 0;
                });
                break;
            case 'years2':
                doctors.sort((a,b) => {
                    if (a.workingYears < b.workingYears) return 1;
                    else if (a.workingYears > b.workingYears) return -1;
                    else return 0;
                });
                break;
            case 'years1':
                doctors.sort((a,b) => {
                    if (a.workingYears < b.workingYears) return -1;
                    else if (a.workingYears > b.workingYears) return 1;
                    else return 0;
                });
                break;
            default:
                val = null;
                break;
        }
    }

    sortDoctors(val) {
        // alert(val);
        let doctors = this.state.visibleDoctors;

        this.sort(val, doctors);

        this.setState({
            visibleDoctors: doctors,
            curPage: 0,
            sort: val,
        });
    }

    filterByContact(id) {
        // alert(id);
        const doctors = this.state.allDoctors.filter(doc => doc.adressId === id);
        if (this.state.sort) this.sort(this.state.sort, doctors);
        this.setState({
            visibleDoctors: doctors,
            curPage: 0
        });
        this.props.history.push(`/doctors`);
    }

    filterByDoctorType(id) {
        //alert('sdsd');
        const doctors = this.state.allDoctors.filter(doc => doc.typeId === id);
        if (this.state.sort) this.sort(this.state.sort, doctors);
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
            visibleDoctors, curPage, sort } = this.state;

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
            content = <Loader/>; // Replace with loader
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
                    <div className='SortingBlock'>
                        <label><b>Сортувати за: </b></label>
                        <select onChange={e => this.sortDoctors(e.target.value)}
                         name='sort' id='sortDoctors' value={sort ? sort : ''}>
                            <option hidden='hidden'></option>
                            <option value='name'>Ім'я</option>
                            <option value='lastname'>Прізвище</option>
                            <option value='price1'>Вартість консультації (від меншої до більшої)</option>
                            <option value='price2'>Вартість консультації (від більшої до меншої)</option>
                            <option value='years2'>Стаж роботи (від більшого до меншого)</option>
                            <option value='years1'>Стаж роботи (від меншого до більшого)</option>
                        </select>
                    </div>
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