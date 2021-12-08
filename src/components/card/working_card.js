import "./working_card.css"
import React, { useState } from 'react'
import { IconContext } from "react-icons/lib";
import { motion } from "framer-motion";

export default function WorkingCard({ children,title,content}) {


    const [hover, sethover] = useState(false)

    onmouseenter = (e) => {
        sethover(true)
    };

    onmouseleave = (e) => {
        sethover(false)
    };


    return (
        <div className="working-card" onMouseEnter={onmouseenter} onMouseLeave={onmouseleave}>
            <div className="working-card-row">
                <div className="working-img">
                    <IconContext.Provider value={{ size: "2rem" }}>
                        {hover ?
                            <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 0.5,stiffness:60,type:"spring" }}><>{children}</></motion.div> :
                            <div>{children}</div>
                        }
                    </IconContext.Provider>
                </div>
                <div className="working-text-wrapper">
                    <div><h2>{title}</h2></div>
                    <div><p>{content}</p></div>
                </div>
            </div>
        </div>
    )
}
