import React, {useState} from 'react'
import { useLocation } from 'react-router'
import BusinessContactLayout from '../../components/layout/business_contact._layout'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const BusinessIdeaContact = () => {

    const [open, setOpen] = useState(false);
    return (
        <div className="mt-5">
            <Backdrop
                sx={{ color: '#19a9e1', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
           <BusinessContactLayout setOpen={setOpen} fileFolder={"İş-Fikirleri"} URL={"https://kapsulcom.herokuapp.com/business-idea"}/>
        </div>
    )
}

export default BusinessIdeaContact
