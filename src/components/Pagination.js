import React from 'react';
import './Pagination.css';

export default class Pagination extends React.Component {
    render() {
        const buttons = [];
        for (let i = 0; i < this.props.pages; i++) {
            buttons[i] = (
            <button key={i} className={i === this.props.curPage ? 'active' : ''}
              onClick={(e) => this.props.callback(i)}>
                {i+1}
            </button>
            );
        }

        if (this.props.pages < 2) {
            return null;
        }

        return (
            <div className="Pagination">
                <button onClick={(e) => {
                    const curPage = this.props.curPage;
                    const newPage = curPage === 0 ? this.props.pages - 1 : curPage - 1;
                    this.props.callback(newPage);
                }}>&laquo;</button>
                {buttons}
                <button onClick={(e) => {
                    const curPage = this.props.curPage;
                    const newPage = curPage === this.props.pages - 1 ? 0 : curPage + 1;
                    this.props.callback(newPage);
                }}>&raquo;</button>
            </div>
        );
    }
}