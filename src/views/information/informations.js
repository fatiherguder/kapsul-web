import React, { useEffect } from "react"
import InformationTextLayout from "../../components/layout/information_text_layout"
import ImageCard from "../../components/card/image_card.js"
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import './informations.css'

const Informations = ({ dataAos }) => {

    const subtitle = "Kapsül Teknoloji Platformu, Sanayi ve Teknoloji Bakanlığı tarafından Türkiye'nin teknolojik yetkinliğini geliştirmek amacıyla etki gücü yüksek program ve projelerin hayata geçirilmesine destek sağlamak için mevzuata alınan, Milli Teknoloji Hamlesi'ne katkı sunmak amacıyla Kasım 2020 tarihinde Konya Büyükşehir Belediyesi bünyesinde kurulmuştur. Kapsül Teknoloji Platformu çatısı altında deneyim, tecrübe, bilgi, iş ağı, teknoloji gibi birikimler bir araya getirilerek sürdürülebilir bir yapı etrafında ulusal teknolojik kalkınmaya katkı sunmak için çalışmalarını sürdürmektedir.Kapsül Teknoloji Platformu gençlerin hayallerine ulaşmasını hedefleyen Türkiye’nin ilk belediye destekli teknoloji platformudur."
    
    const title = "Kapsül Nedir?";

    const controls = useAnimation();
    const { inView } = useInView();


    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
        if (!inView) {
            controls.start('hidden');
        }
    }, [controls, inView]);


    return (
        <section id='info'>
            <div className="info-wrapper">
            <div className="info-row">
                <div className="info-column">                    
                    <InformationTextLayout title={title} subtitle={subtitle} />                    
                </div>
                <div className="img">
                    <ImageCard dataAos={dataAos} />
                </div>
            </div>
        </div>
        </section>
    );
}

export default Informations;
