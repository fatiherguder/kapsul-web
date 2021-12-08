import React, {useState} from 'react'
import { motion } from 'framer-motion'
import PersonalContactLayout from "../../components/layout/personal_contact_layout"
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const PersonalContact = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="mt-5">
            <Backdrop
                sx={{ color: '#19a9e1', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <PersonalContactLayout setOpen={setOpen}/>
        </div>
    )
}

export default PersonalContact
