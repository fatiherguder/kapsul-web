import React, { useState, createContext } from 'react'
import { v4 as uuidv4 } from 'uuid';

export const MemberContext = createContext();

const MemberContextProvider = (props) => {

    const [members, setMembers] = useState([]);
    const [teamIns,setTeamIns] = useState("");
    const [applyData, setApplyData] = useState({});
    const [files, setFiles] = useState(null);
    
    


    //name, surname,eduLevel,school,university=null, faculty=null, department=null, assignment

    const addMember = (newMember) => {
        newMember.uid = uuidv4();
        setMembers([...members, newMember])
    }

    const deleteMember = (id) => { 
        setMembers(members.filter((member) => member.uid !== id))
    }


    const updateMember = (id, updatedMember) => {
        setMembers(members.map((member) => (member.uid === id ? {...updatedMember, uid:id} : member)))
    }

    const updateTeamIns = (teamIns) => setTeamIns(teamIns);

   const updateApplyData = (fieldName,fieldValue) => {
        setApplyData({...applyData, [fieldName]:fieldValue});
   }

   const updateFiles = (fieldName,fieldValue) => setFiles({...files,[fieldName]:fieldValue});

    const { children } = props;

    return (
        <MemberContext.Provider value={{applyData,files, members,updateFiles, addMember, deleteMember, updateMember,teamIns,updateTeamIns,updateApplyData}}>
            {children}
        </MemberContext.Provider>
    )
}

export default MemberContextProvider;