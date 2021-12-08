import React from 'react'
import "./image_card.css"
import "aos/dist/aos.css";

export default function ImageCard({dataAos}) {
    return (
        <div className="info-image" data-aos={dataAos}>
        </div>
    )
}
