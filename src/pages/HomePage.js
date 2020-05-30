import React from 'react';
import Page from './Page';

export default class HomePage extends React.Component {
    render() {
        return (
            <Page>
                <h2>Home Page</h2>
                <p> Some text of home page.</p>
                <button>List of doctors</button>
            </Page>
        );
    }
}