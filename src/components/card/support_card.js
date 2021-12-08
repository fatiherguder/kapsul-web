import React from 'react'
import "./support_card.css"

export default function SupportCard({ children,src,title }) {
    return (
        <div className="support-card" data-label="In Progress">
            <div className="support-card-img">
                <img src={src} alt="">
                </img>
            </div>
            <div className="content">
                <h3>{title}</h3>
                <hr/>   
                {
                    children != null ? (
                        children.map((item, index) => {
                            return (
                              <p className='content-text'>{item}</p>
                            )
                        })
                    ) : null
                }      
            </div>
        </div>
    )
}
