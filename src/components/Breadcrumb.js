import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

class Breadcrumb extends React.Component {
    render() {
        return (
            <ul className="breadcrumb">
                {this.props.links.map(link => {
                    return (
                    <li key={link.path}>
                        <Link to={link.path}>
                            {link.text}
                        </Link>
                    </li>
                    );
                })}
                <li>{this.props.currentLocText}</li>
            </ul>
        );
    }
}

export default Breadcrumb;