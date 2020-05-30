import React from 'react';
import './MenuButton.css';

function MenuButton(props) {
    return (
    <a className='Menu-button'>{props.text}</a>
    );
}

export default MenuButton;