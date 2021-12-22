import React, {useState, useEffect } from 'react'
import TeamContactLayout from "../../components/layout/team_contact_layout"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const TeamContact = () => {

    const [open, setOpen] = useState(false);
    useEffect(() => {
        window.scrollTo(0, 0)
      });

    return (
        <div className="mt-5">
            <Backdrop
                sx={{ color: '#19a9e1', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TeamContactLayout setOpen={setOpen}/>
        </div>
    )
}

export default TeamContact
