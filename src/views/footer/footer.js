import React from "react"
import { Row, Col } from 'react-bootstrap';
import './footer.css'
import { FaInstagram, FaTwitter, FaLinkedinIn, FaMapMarkerAlt, FaRegEnvelope, FaPhoneAlt, FaYoutube } from "react-icons/fa";
import benimSehrim from "../../assets/benim_sehrim.svg"
import KBBLogo from "../../assets/KBB_logo.svg"
import Uğurİbrahim from "../../assets/ugur_ibrahim_logo.svg"

const Footer = () => {


    return (
        <section id='footer'>
            <div className="footer">
                <div className="footer-wrapper">
                    <div className="contact-area">
                        <p className="text"><FaMapMarkerAlt className="contact-icon" />Beyazıt, Derviş Hilmi Sk. No:2/d, 42060 Selçuklu/Konya</p>
                        <p className="text"><FaRegEnvelope className="contact-icon" />info@kapsulkonya.com</p>
                    </div>
                    <div className="social-area">
                        <div className="social-wrapper">
                            <a href="https://www.instagram.com/kapsulkonya/" target="_blank" rel="noreferrer" ><FaInstagram className="social-icon"></FaInstagram></a>
                            <a href="https://twitter.com/kapsulkonya" target="_blank" rel="noreferrer" ><FaTwitter className="social-icon"></FaTwitter></a>
                            <a href="https://www.linkedin.com/in/kaps%C3%BClkonya/?originalSubdomain=tr" target="_blank" rel="noreferrer" ><FaLinkedinIn className="social-icon" ></FaLinkedinIn></a>
                            <a href="https://www.youtube.com/channel/UCyT6skpXh6W09oADZwHXvLg" target="_blank" rel="noreferrer" ><FaYoutube className="social-icon"></FaYoutube></a>
                        </div>
                        <div className="belediye-wrapper">
                            <img src={benimSehrim} alt="benım sehrim" className="belediye-logo"/>
                            <img src={KBBLogo} alt="benım sehrim" className="belediye-logo"/>
                            <img src={Uğurİbrahim} alt="benım sehrim" className="belediye-logo"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Footer;