import React from 'react';
import './Page.css';

export default class Page extends React.Component {
    render() {
        let style = {};
        if (this.props.width) {
            style.maxWidth = this.props.width;
            style.marginLeft = 'auto';
            style.marginRight = 'auto';
        }

        let containerStyle = {};
        if (this.props.marginLeft) containerStyle.marginLeft = this.props.marginLeft;

        return (
            <div className='PageMarginContainer' style={containerStyle}>
                <div className='Page' style={style}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}