import React from 'react';
import './MainMenu.css';
import logo from './images/logo.png';
import LoginControl from './LoginControl';
import SearchBar from './Search';
import { NavLink, Link } from 'react-router-dom';
import Cookies from '../helpers/cookies';

class MainMenu extends React.Component {
    constructor(props) {
        super(props);
        this.onLogOut = this.onLogOut.bind(this);
    }

    onLogOut() {
        this.props.loginControl.setLoginState(false);
    }

    render() {
        let profileButton = null;

        const roleId = Cookies.getCookie('role');

        if (this.props.loginControl.isLoggedIn) {
            // Додати випадаюче меню при наведенні
            profileButton = (
                <div className='Menu-Dropdown'>
                    <button className='Menu-DropdownButton'>Профіль</button>
                    <div className='Menu-DropdownMenu'>
                        <NavLink to="/profile/history" activeClassName="active">Історія записів</NavLink>
                        <NavLink exact to="/profile" activeClassName="active">Інформація</NavLink>
                        {Number.parseInt(roleId) === 2 &&
                            <NavLink to="/profile/doctor" activeClassName="active">Сторінка лікаря</NavLink>
                        }
                    </div>
                </div>
            );
        }

        return (
            <div className='Menu-container'>
                <div className='Main-menu'>
                    <MenuLogo />
                    <nav className='Menu-buttons'>
                        <button id='OpenMenu'>Меню</button>
                        <div className='Menu-buttons-Navs'>
                            <NavLink className='MenuButton' exact to="/" activeClassName="active">Головна сторінка</NavLink>
                            <NavLink className='MenuButton' to="/doctors" activeClassName="active">Список лікарів</NavLink>
                            {profileButton}
                            <NavLink className='MenuButton' to="/contacts" activeClassName="active">Контакти</NavLink>
                        </div>
                    </nav>
                    <SearchBar />
                    <LoginControl isLoggedIn={this.props.loginControl.isLoggedIn}
                     onLogOut={this.onLogOut} />
                </div>
                <SearchBar mobile={true} />
            </div>
        );
    }
}

function MenuLogo() {
    return (
        <Link to='/' className='Menu-logo'>
            <img src={logo} alt='App logo'/>
        </Link>
    );
}

export default MainMenu;