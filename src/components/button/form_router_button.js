import React from 'react'
import { Link } from "react-router-dom";
import "./form_router_button.css"

const FormRouterButton = ({name,link}) => {
    return (
        <div>
            <Link to={`/apply${link}`} style={{ textDecoration: 'none' }}>
                <div className="info-button">
                    {name}
                </div>
            </Link>
        </div>
    )
}

export default FormRouterButton
