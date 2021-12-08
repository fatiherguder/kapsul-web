import React from 'react'
import "./working_list_layout.css"

export default function WorkingListLayout() {
    return (
        <div className="list">
            <ul>
                <MenuItem name="Toplum Yararına Teknoloji" />                
                <MenuItem name="Teknolojik Ürünler" />
                <MenuItem name="Start-Up" />
                <MenuItem name="Co-Ofis" />                                
                <MenuItem name="Mentör Desteği" />
                <MenuItem name="Girişimcilik" />
                <MenuItem name="Eğitim" />
                <MenuItem name="Teknoloji Yarışmaları" />
                <MenuItem name="Ar-Ge" />
            </ul>
        </div>
    )
}




const MenuItem = ({ name }) => {
    return (
        <li className="menu-item">
            <span>
                {name}
            </span>
        </li>

    );
}