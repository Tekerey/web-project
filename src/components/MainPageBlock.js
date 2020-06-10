import React from 'react';
import './MainPageBlock.css';
import './inputs.css';

export default class MainPageBlock extends React.Component {
    render() {
        return (
            <div className={this.props.inverse ? 'MainPageBlock inverse'
            : 'MainPageBlock'}>
                <div className='MainPageBlock-Info'>
                    <h1>{this.props.title}</h1>
                    <p>{this.props.text}</p>
                    {this.props.btnText &&
                        <button className='PrimaryButton' onClick={this.props.btnCallback}>
                            {this.props.btnText}
                        </button>
                    }
                </div>
                <div className='MainPageBlock-ImageContainer'>
                    <img src={this.props.img} alt={this.props.imgAlt}></img>
                </div>
            </div>
        );
    }
}