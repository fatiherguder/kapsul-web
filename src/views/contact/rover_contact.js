import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PersonalApplyContextProvider from '../../context/PersonalApplyContext';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import RoverContactLayout from '../../components/layout/rover_contact_layout';


const RoverContact = () => {

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
            <PersonalApplyContextProvider>
                <RoverContactLayout setOpen={setOpen}/>
            </PersonalApplyContextProvider>
        </div>
    )
}

export default RoverContact
