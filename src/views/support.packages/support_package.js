import React, { useEffect } from 'react'
import "./support_packages.css"
import SupportCard from '../../components/card/support_card'
import "aos/dist/aos.css";
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import { Row, Col } from 'react-bootstrap';
import one from "../../assets/kart2_2.jpg"
import two from "../../assets/kart1_2.jpg"
import three from "../../assets/kart3_2.jpg"


export default function SupportPackages({ dataAos }) {

    const controls = useAnimation();
    const { ref, inView } = useInView();


    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
        if (!inView) {
            controls.start('hidden');
        }
    }, [controls, inView]);

    const boxVariants = {
        hidden: { x: -200, rotateY: -180 },
        visible: {
            x: 0,
            transition: { type: "spring", stiffness: 120 },
        }
    }

    const teknofest = ['Akıllı Ulaşım', 'Eğitim Teknolojileri', 'Model Uydu', 'Otonom Araç', 'Roket', 'İHA', 'Tarım Teknolojileri', 'Yapay Zeka', 'Elektrikli Araç', 'İnsanlık Yararına Teknoloji', 'Araştırma Proje Yarışmaları', 'İnsansız Su Altı Sistemleri'];
    const lab =  ['Bistlab', 'Tasarım Lab', 'Akıllı Şehirler Lab', 'Project Lab', 'Tasarım Teknolojileri Lab'];
    const startup = ['Kapsül burada kuluçka merkezi faaliyetlerini yürütür ve olgunlaşan çalışmaları yatırımcı ağlarına entegre eder. ']

    return (
        <section id='support'>
            <div className="support-wrapper">
            <h3 className="support-title my-auto">Kapsül Çalışma Alanları</h3>
            <div data-aos={dataAos} className='card-area'>
                <div className="support-card-wrapper">
                    <Row>
                        <Col sm>
                            <SupportCard src={one} title={'Teknofest Takımları'} children={teknofest} dataAos={dataAos}/>
                        </Col>
                        <Col sm>
                            <SupportCard src={two} title={'Ar-Ge ve Laboratuvarlar'} children={lab} dataAos={dataAos}/>
                        </Col>
                        <Col sm>
                            <SupportCard src={three} title={'Start-up'} children={startup} dataAos={dataAos}/>
                        </Col>
                    </Row>
                </div>
            </div>

        </div>
        </section>
    )
}
