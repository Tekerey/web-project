import React from 'react';
import './Search.css';
import {ReactComponent as SearchIcon} from './search.svg'

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleFocus(e) {
        e.target.parentElement.classList.add('active');
    }

    handleBlur(e) {
        e.target.parentElement.classList.remove('active');
    }

    render() {
        return (
            <div className='Search'>
                <span><SearchIcon /></span>
                <input type='text' placeholder='Пошук...' onFocus={this.handleFocus}
                    onBlur={this.handleBlur}/>
            </div>
        );
    }
}