import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import AuthService from './helpers/authService';
import { UserContext } from './helpers/UserContext';

import './App.css';
import MainMenu from './components/MainMenu';
import Slideshow from './components/Slideshow/Slideshow';

// Pages
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import ProfilePage from './pages/ProfilePage';
import HistoryPage from './pages/HistoryPage';
import ContactsPage from './pages/ContactsPage';
import LogInPage from './pages/LogInPage';
import SignupPage from './pages/SignupPage';

// Slideshow images
import slideImg1 from './images/slide_doctors.jpg';
import DoctorProfilePage from './pages/DoctorProfilePage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.setLoginState = this.setLoginState.bind(this);
    this.state = {
      isLoggedIn: false,
      setLoginState: this.setLoginState
    };
  }

  setLoginState(s) {
    this.setState({
      isLoggedIn: s
    });
  } 

  componentDidMount() {
    AuthService.auth()
    .then(
        res => {
            if (res.isAuth) {
                this.setState({
                    isLoggedIn: true
                });
            } else {
                this.setState({
                    isLoggedIn: false
                });
            }
        }
    );
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        <div className='App'>
          <header>
            <Switch>
              <Route exact path='/login' />
              <Route exact path='/signup' />
              <Route path='/profile' />
              <Route path='/'>
                <Slideshow id='slide' slides={[
                  {title: 'Test Title', text: 'Test article about slide.', image: slideImg1},
                  {title: 'Test Title', text: 'Test article about slide.'},
                  {title: 'Test Title', text: 'Test article about slide.'},
                ]} />
              </Route>
            </Switch>
          </header>
          <main>
            <MainMenu loginControl={{
              isLoggedIn: this.state.isLoggedIn,
              setLoginState: this.setLoginState
            }} />
            <div id='content'>
              <Switch>
                <Redirect from='/home' to='/' />
                <Redirect from='/index.html' to='/' />
                <Route exact path='/'>
                  <HomePage/>
                </Route>
                <Route path='/doctors'>
                  <DoctorsPage/>
                </Route>
                <Route exact path='/profile'>
                  <ProfilePage loginControl={{
                    isLoggedIn: this.state.isLoggedIn,
                    setLoginState: this.setLoginState
                  }} />
                </Route>
                <Route path='/profile/doctor'>
                  <DoctorProfilePage loginControl={{
                    isLoggedIn: this.state.isLoggedIn,
                    setLoginState: this.setLoginState
                  }} />
                </Route>
                <Route path='/profile/history'>
                  <HistoryPage loginControl={{
                    isLoggedIn: this.state.isLoggedIn,
                    setLoginState: this.setLoginState
                  }} />
                </Route>
                <Route path='/contacts'>
                  <ContactsPage/>
                </Route>
                <Route path='/login'>
                  <LogInPage setLoginState={this.setLoginState}/>
                </Route>
                <Route path='/signup'>
                  <SignupPage setLoginState={this.setLoginState}/>
                </Route>
                <Route>
                  {/* <NotFoundPage></NotFoundPage> */}
                </Route>
              </Switch>
            </div>
          </main>
        </div>
      </UserContext.Provider>
    );
  }
}

export default App;
