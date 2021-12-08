import React from 'react'
import './counter-card.css'
import CountUp from 'react-countup';

export const CounterCard = (props) => {
    return (
        <>
            <div className='cardArea'>
                <CountUp className='number' start={0} end={props.number} duration={2}></CountUp >
                <p className='title'>{props.title}</p>
            </div>
        </>
    )
}
