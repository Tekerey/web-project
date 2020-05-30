import React from 'react';
import './Slideshow.css';
import { ReactComponent as LeftButtonIcon} from './cheveron-left.svg';
import { ReactComponent as RightButtonIcon} from './cheveron-right.svg';

// Slideshow component
// To have more than one Slideshows must have id's

// Example of usage:
/*<Slideshow id='slide' slides={[
    {title: 'Test Title', text: 'Test article about slide.', image: slideImg1},
    {title: 'Test Title', text: 'Test article about slide.'},
    {title: 'Test Title', text: 'Test article about slide.'},
]} />*/
export class Slideshow extends React.Component {
    constructor(props) {
        super(props);
        this.slideCount = 0;
        this.scrollRight = this.scrollRight.bind(this);
        this.scrollLeft = this.scrollLeft.bind(this);
        this.curSlideId = '';
        this.slidesComponents = '';
        this.dotsComponents = '';
        this.id = '';
    }

    componentDidMount() {
        this.curSlideId = this.slidesComponents[0].props.id;
    }

    scrollRight() {
        if (this.curSlideId === this.slideCount + this.id) {
            this.curSlideId = this.slidesComponents[0].props.id;
        } else {
            this.curSlideId = (Number.parseInt(this.curSlideId) + 1) + this.id;
        }

        const curSlide = document.getElementById(this.curSlideId);

        if (curSlide) {
            //document.getElementById(this.curSlideId).scrollIntoView(false);
            //document.getElementById(this.curSlideId).parentElement.scrollBy(800, 0);
            curSlide.parentElement.scrollTo(curSlide.offsetLeft, 0);
            //console.log(curSlide.offsetLeft);
        }
    }

    scrollLeft() {
        if (this.curSlideId === this.slidesComponents[0].props.id) {
            this.curSlideId = this.slideCount + this.id;
        } else {
            this.curSlideId = (Number.parseInt(this.curSlideId) - 1) + this.id;
        }

        const curSlide = document.getElementById(this.curSlideId);

        if (curSlide) {
            //document.getElementById(this.curSlideId).scrollIntoView(false);
            curSlide.parentElement.scrollTo(curSlide.offsetLeft, 0);
        }
    }

    currentSlide(id) {
        const curSlide = document.getElementById(id);
        curSlide.parentElement.scrollTo(curSlide.offsetLeft, 0);
        this.curSlideId = id;
    }

    render() {
        if (this.props.id) this.id = this.props.id;

        if (Array.isArray(this.props.slides)) {
            this.slideCount = this.props.slides.length;

            let i = 1;
            this.slidesComponents = this.props.slides.map(slide => {
                return <Slide id = {i + this.id}
                    key = {i++ + this.id}
                    image = {slide.image}
                    title = {slide.title}
                    text = {slide.text}
                />
            });
            i = 1;
            this.dotsComponents = this.slidesComponents.map(slideComp => {
                return <span key={slideComp.props.id + '_dot'} className="Dot"
                    onClick={e => this.currentSlide(slideComp.props.id, e)}></span>
            });
        }

        return (
            <div className='Slideshow-container'>
                <div className='Slideshow'>
                    <button className='ScrollButton Left' onClick={this.scrollLeft}>
                        <LeftButtonIcon />
                    </button>
                    <div className='Slideshow-view'>
                        {this.slidesComponents}
                    </div>
                    <button className='ScrollButton Right' onClick={this.scrollRight}>
                        <RightButtonIcon />
                    </button>
                </div>
                <div className='Slideshow-nav'>
                    {this.dotsComponents}
                </div>
            </div>
        );
    }
}

// Slide component. Must be inside of Slideshow component.
export class Slide extends React.Component {
    render() {
        return (
            <div
              id={this.props.id}
              className='Slide'
              style={{backgroundImage:`url(${this.props.image})`}}
            >
                {this.props.title &&
                    <div className='Slide-left-part'>
                        <h1>{this.props.title}</h1>
                        <p>{this.props.text}</p>
                    </div>
                }
            </div>
        );
    }
}

export default Slideshow;