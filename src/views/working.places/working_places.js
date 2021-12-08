import React, { useEffect } from 'react'
import "./working_places.css";
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation } from 'framer-motion';
import WorkingCard from '../../components/card/working_card';
import { FaChartLine, FaPeopleCarry, FaChalkboardTeacher, FaToolbox } from "react-icons/fa";
import { GiPodiumWinner, GiProcessor } from "react-icons/gi";
import { MdSchool } from "react-icons/md";
import { GrWorkshop } from "react-icons/gr";
import { GoTools } from "react-icons/go";
import { ImOffice } from "react-icons/im";
import { Row, Col } from 'react-bootstrap';


export default function WorkingPlaces() {
    const controls = useAnimation();
    const { ref, inView } = useInView();


    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);


    const list = {
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.3,
            }
        },
        hidden: {
            opacity: 0,
        }
    }

    const item = {
        visible: {
            opacity: 1,
            transition: {
                duration: 0.3
            }
        },
        hidden: {
            opacity: 0,
        }
    }

    return (
        <section id='work'>
            <div className="working-wrapper">            
            <Row>
            <h3 className="working-title my-5">Kapsül Hangi İmkanları Sağlar ?</h3>
            <br/>
                <div >
                    <motion.div className="place-wrapper" initial="hidden" animate={controls} variants={list} ref={ref}>
                        <Row>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><FaToolbox className="icon-color" /></li>} title={"Malzeme İmkanı"} 
                                    
                                        content={"Kapsül Teknoloji Platformu bünyesinde bulunan yarışma takımlarına ihtiyaç duydukları teknolojik sarf ve üretim malzemelerini sağlar."}
                                    />
                                </motion.div>
                            </Col>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><GrWorkshop className="icon-color" /></li>} title={"Atölye İmkanı"} 
                                        content={"Kapsül Teknoloji Platformu, teknoloji odaklı çalışmalarda üretim kısmında atölyelerinde yer alan üretim araçlarının kullanılmasını sağlar."}
                                    />
                                </motion.div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><ImOffice className="icon-color" /></li>} title={"Ofis İmkanı"} 
                                    
                                        content={"Kapsül Teknoloji Platformu girişimcilere ve Ar-Ge çalışması sürdürenlere, yerleşkesinde teknolojik altyapıya sahip ofislerini kullanma imkanı tanır."}
                                    />
                                </motion.div>
                            </Col>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><MdSchool className="icon-color" /></li>} title={"Eğitim İmkanı"}

                                                content={"Kapsül Teknoloji Platformu ihtiyaç duyulan eğitimlerin teminini ve eğitmen öğrenci buluşmalarını organize eder."}
                                    />
                                </motion.div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><FaChalkboardTeacher className="icon-color" /></li>} title={"Mentör İmkanı"} 
                                    
                                        content={"Kapsül Teknoloji Platformu teknoloji odaklı çalışmalar sürdüren herkese, ihtiyaç duydukları çalışma alanlarında ve konularda alanında uzman mentörlerle çalışma imkanı sağlar."}
                                    />
                                </motion.div>
                            </Col>
                            <Col sm>
                                <motion.div variants={item}>
                                    <WorkingCard children={<li><FaPeopleCarry className="icon-color" /></li>} title={"Yatırım Ağlarına Entegrasyon İmkanı"}
                                    
                                        content={"Kapsül Teknoloji Platformu kurmuş olduğu yatırım ağları ve kurumsal işbirlikleriyle, girişimcilerin ihtiyaç duydukları yatırımcı havuzuna erişimi kolaylaştırır."}
                                    />
                                </motion.div>
                            </Col>
                        </Row>
                    </motion.div>
                </div>
            </Row>
        </div>
        </section>
    )
}
