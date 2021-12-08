import React, { useState, createContext } from 'react'
import { v4 as uuidv4 } from 'uuid';

export const MemberContext = createContext();

const MemberContextProvider = (props) => {

    const [members, setMembers] = useState([])

    const addMember = (name, surname, university, faculty, department, assignment) => {
        setMembers([...members, { id: uuidv4(), name, surname, university, faculty, department, assignment }])
    }

    const deleteMember = (id) => {
        setMembers(members.filter((member) => member.id !== id))
    }


    const updateMember = (id, updatedMember) => {
        setMembers(members.map(member => (member.id === id ? updatedMember : member)))
    }

const { children } = props;

return (
    <MemberContext.Provider value={{ members, addMember, deleteMember,updateMember}}>
        {children}
    </MemberContext.Provider>
)
}

export default MemberContextProvider;