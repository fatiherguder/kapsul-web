import React from 'react'
import particlesConfig from './particleConfig.json'

export default function Particles() {
    return (
        <div>
            <Particles params={particlesConfig} className="App-particles__container"/>
        </div>
    )
}
