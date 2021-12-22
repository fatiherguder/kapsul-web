import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../assets/maintenance.json';

const MaintenancePage = () => {

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <div >
            <Lottie
                options={defaultOptions}
                width={"50%"}
            />
        </div>
    )
}

export default MaintenancePage;