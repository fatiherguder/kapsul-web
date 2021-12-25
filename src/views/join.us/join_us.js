import React from 'react'
import FormRouterButton from '../../components/button/form_router_button';
import robot from "../../assets/robot_blue.png"
import "./join_us.css"
import "aos/dist/aos.css";


export default function JoinUs({ dataAos }) {

    return (
        <section id='join-us'>
            <div className="join-us-page">
                <div className="join-us-wrapper">
                    <div className="join-us-image-wrapper">
                        <img src={robot} data-aos={dataAos} data-aos-duration="600" data-aos-easing="ease-in-out" />
                    </div>
                    <div className="join-us-button-wrapper">
                        <FormRouterButton name="Teknofest Başvurusu" link="/team" />
                        <FormRouterButton name="İş Fikri Başvurusu" link="/business" />
                        <FormRouterButton name="Ar-Ge Başvurusu" link="/arge" />
                        <FormRouterButton name="Bireysel Başvuru" link="/personal" />
                        <FormRouterButton name="Rover Başvurusu" link="/rover" />
                    </div>
                </div>
            </div>
        </section>
    )
}
