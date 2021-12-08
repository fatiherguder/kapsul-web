import React from "react"
import { Row} from 'react-bootstrap';
import Aos from "aos";
import './slogan.css'

const Slogan = () => {


    return (
        <section id='slogan'>
            <Row className="slogan-wrapper">
                <p data-aos="flip-up" data-aos-duration="750" data-aos-easing="ease-in-out" className="slogan-text">"Gelecek Kapsül'de..."</p>
            </Row>
        </section>
    );
}

export default Slogan;
