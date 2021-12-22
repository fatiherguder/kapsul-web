import React, { useState, createContext } from 'react'

export const PersonalApplyContext = createContext();

const PersonalApplyContextProvider = (props) => {

    const [interests, setInterests] = useState([])
    const [contributions, setContributions] = useState([])

    const addInterests = (interests) => {
        setInterests(interests);
        
    };

    const addContributions = (contributions) => {
        setContributions(contributions);
        
    };
    

    return (
        <PersonalApplyContext.Provider value={{interests,contributions,addInterests,addContributions}}>
            {props.children}
        </PersonalApplyContext.Provider>
    )
    
}

export default PersonalApplyContextProvider;