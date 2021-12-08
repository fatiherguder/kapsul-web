import React from 'react'
import "./information_text_layout.css"

export default function InformationTextLayout({title,subtitle,textAlign}) {
    return (
        <div className="text-wrapper">
            <h3 className="info-title">{title}</h3>
            <p className="info-subtitle">{subtitle}</p>
        </div>
    )
}
