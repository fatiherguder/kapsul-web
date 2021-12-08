import React,{useState} from 'react'
import BusinessContactLayout from '../../components/layout/business_contact._layout'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress'
import arge from "../../assets/arge.jpg"


const ARGEContact = () => {

    const [open, setOpen] = useState(false);

    return (
        <div className="mt-5" >
            <Backdrop
                sx={{ color: '#19a9e1', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
           <BusinessContactLayout setOpen={setOpen} fileFolder={"Arge-Fikirleri"} URL={"https://kapsulcom.herokuapp.com/research-and-development"}/>
        </div>
    )
}

export default ARGEContact
