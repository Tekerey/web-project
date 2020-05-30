import React from 'react';
import './SideMenu.css';

export class SideMenu extends React.Component {
    render() {
        return (
            <div className='SideMenu'>
                <div className='SideMenu-Title'>
                    {this.props.title}
                </div>
                {this.props.children}
            </div>
        );
    }
}

export class SideMenuCategory extends React.Component {

    handleClick(e) {
        e.target.classList.toggle('active');
        const list = document.querySelectorAll('.SMCategory-Button');
        list.forEach(el => {
            if (el !== e.target) el.classList.remove('active');
        });

        const categoryList = e.target.nextElementSibling;

        if (categoryList.style.maxHeight) {
            categoryList.style.maxHeight = null;
        } else {
            categoryList.style.maxHeight = categoryList.scrollHeight + 'px';
            document.querySelectorAll('.SMCategory-Menu').forEach(el => {
                if (el !== categoryList) el.style.maxHeight = null;
            });
        }
    }

    render() {
        return (
            <>
            <button className='SMCategory-Button' onClick={this.handleClick}>{this.props.name}</button>
            <div className='SMCategory-Menu'>
                {this.props.children}
            </div>
            </>
        );
    }
}

export class SideMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }


    handleClick(e) {
        e.target.classList.toggle('active');
        let list = document.querySelectorAll('.SideMenu-Item');
        list.forEach(el => {
            if (el !== e.target) el.classList.remove('active');
        });

        // Добавить закрытие категорий?
        // list = document.querySelectorAll('.SMCategory-Button');
        // list.forEach(el => {
        //     console.log(e.target.parentElement.previousSibling);
        //     if (el !== e.target.parentElement.previousSibling) el.classList.remove('active');
        // });

        this.props.callback(this.props.id);
    }

    render() {
        return (
            <button className='SideMenu-Item' onClick={this.handleClick}>{this.props.name}</button>
        );
    }
}