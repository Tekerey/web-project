import React from 'react';
import './Search.css';
import {ReactComponent as SearchIcon} from './search.svg'
import Api from '../helpers/backendApi';
import './inputs.css';
import { withRouter } from 'react-router-dom';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.state = {
            isLoaded: false,
            doctors: null,
            error: null,
            results: null,
        }
    }

    componentDidMount() {
        Api.getDoctors()
        .then(
            res => {
                if (res) this.setState({isLoaded: true, doctors: res});
                else this.setState({
                    error: true,
                    isLoaded: true,
                });
            },
            err => {
                this.setState({
                    error: err,
                    isLoaded: true,
                });
            }
        );
    }

    handleClick(id) {
        this.props.history.push(`/doctors?id=${id}`);
    }

    handleInput(e) {
        const val = e.target.value.toLowerCase().trim();
        console.log(val);
        if (val.length === 0) {
            this.setState({
                results: null,
            });
            return;
        }

        const docs = this.state.doctors.filter(d => {
            if (d.firstName.toLowerCase().includes(val)) return true;
            if (d.lastName.toLowerCase().includes(val)) return true;
            if (`${d.firstName.toLowerCase()} ${d.lastName.toLowerCase()}`.includes(val)) return true;
            else return false;
        });

        this.setState({
            results: docs,
        });
    }

    handleFocus(e) {
        e.target.parentElement.classList.add('active');
        e.target.parentElement.parentElement.nextSibling.classList.add('active');
    }

    handleBlur(e) {
        e.target.parentElement.classList.remove('active');
        e.target.parentElement.parentElement.nextSibling.classList.remove('active');
    }

    render() {
        const { error, results } = this.state;

        let content;

        if (error) {
            content = <div className='errorInfo'>Не вдалося завантажити список лікарів.</div>
        }
        else if (results && results.length === 0) {
            content = <div className='justInfo'>Немає результатів.</div>
        }
        else if (results) {
            content = (
                <>
                {results.map(r => {
                    return <SearchResult key={r.id} onClick={() => this.handleClick(r.id)}
                        type={r.type.typeName} name={`${r.firstName} ${r.lastName}`} />;
                })}
                </>
            );
        }

        return (
            <div className='SearchContainer'>
                <div className='SearchInputContainer'>
                    <div className='Search'>
                        <span><SearchIcon /></span>
                        <input type='search' placeholder='Пошук...' onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            onInput={this.handleInput}
                        />
                    </div>
                </div>
                <div className='SearchResults'>
                    {content}
                </div>
            </div>
        );
    }
}

class SearchResult extends React.Component {
    render() {
        return (
            <div onClick={this.props.onClick} className='SearchResult'>
                <span className='SearchResult-Name'>{this.props.name}</span>
                <span className='SearchResult-Type'>{this.props.type}</span>
            </div>
        );
    }
}

export default withRouter(SearchBar);