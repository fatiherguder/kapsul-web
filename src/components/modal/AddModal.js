import universityJSON from "../../store/universite.json";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import facultyJSON from "../../store/fakulte.json";
import { MemberContext } from '../../context/MemberContext';
import departmentJSON from "../../store/bolum.json";
import { Form, Button, ModalTitle, ModalBody, Modal, ModalFooter } from "react-bootstrap";
import { React, useState, useContext } from 'react'



const AddModal = ({ show, handleClose }) => {
    const { addMember } = useContext(MemberContext);
    const [insType, setInsType] = useState("0");


    const [newMember, setNewMember] = useState({ })

    const [cvFile, setCvFile] = useState(null);

    const { name, surname, university, faculty, department, duty } = newMember;

    const [validated, setValidated] = useState(false);

    const handleSubmit = (e) => {
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
            setValidated(true)
        } else {
            e.preventDefault()
            addMember(newMember)
            
            setNewMember({})
            setValidated(false)
        }
    }

    const onInputChange = (e) => {      
        let cvFile = e.target.files != null ? e.target.files[0]:null;
        setNewMember({ ...newMember, [e.target.name]: e.target.value, cvFile  });
    }

    const [universityID, setUniversityID] = useState(0);
    const [facultyID, setFacultyID] = useState(0);

    var filterFaculity = facultyJSON["universite_fakulte"].filter(function (item) {
        return item["universite_id"] == universityID;
    })

    var filterDepartment = departmentJSON["universite_bolum"].filter(function (item) {
        return item["fakulte_id"] == facultyID;
    })

    const handleReset = () => {
        handleClose()
        setUniversityID(0)
        setFacultyID(0)
    }

    return (
        <Modal show={show} onHide={handleReset}>
            <ModalHeader closeButton>
                <ModalTitle>
                    ??ye Ekle
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form noValidate validated={validated} onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" >
                        <Form.Label>Ad</Form.Label>
                        <Form.Control type="text" required maxLength="50" value={name || ""} name="name" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            L??tfen bu alan?? doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Soyad</Form.Label>
                        <Form.Control type="text" required maxLength="50" value={surname || ""} name="surname" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            L??tfen bu alan?? doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>E??itim Seviyesi</Form.Label>
                        <Form.Select aria-required="true" required name="eduLevel" onChange={(e) => { setInsType(e.target.value); onInputChange(e) }}>
                            <option value="">Se??iniz..</option>
                            <option value="L??SE">L??SE</option>
                            <option value="??N L??SANS">??N L??SANS</option>
                            <option value="L??SANS">L??SANS</option>
                            <option value="Y??KSEK L??SANS">Y??KSEK L??SANS</option>
                            <option value="DOKTORA">DOKTORA</option>                            
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L??tfen birini se??iniz.
                        </Form.Control.Feedback>
                    </Form.Group>

                    {insType == "L??SE" ? <Form.Group className="mb-3">
                        <Form.Label>Okul Ad??</Form.Label>
                        <Form.Control type="name" name="school" onChange={e => onInputChange(e)} required maxLength="50" />
                        <Form.Control.Feedback type="invalid">
                            L??tfen bu alan?? doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    {insType != "L??SE" && insType != "0" ? <Form.Group className="mb-3"  >
                        <Form.Label>??niversite</Form.Label>
                        <Form.Select onChange={(e) => { setUniversityID(e.target.selectedIndex); console.log(e.target.selectedIndex); onInputChange(e) }} aria-required="true" required value={university || ""} name="university">
                            <option value="">Se??iniz..</option>
                            {                         
                                universityJSON["data"].map(function (item) {
                                    return <option key={item["universite_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L??tfen birini se??iniz.
                        </Form.Control.Feedback>
                    </Form.Group > : null}
                    {insType != "L??SE"  && insType != "0" ? <Form.Group className="mb-3" >
                        <Form.Label>Fak??lte / Enstit??</Form.Label>
                        <Form.Select onChange={(e) => { setFacultyID(e.target[e.target.selectedIndex].id); onInputChange(e) }} aria-required="true" required value={faculty || ""} name="faculty">
                            <option value="">Se??iniz...</option>
                            {
                                filterFaculity.map(function (item) {
                                    return <option id={item["fakulte_id"]} key={item["fakulte_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L??tfen birini se??iniz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    {insType != "L??SE"  && insType != "0"? <Form.Group className="mb-3" >
                        <Form.Label>B??l??m</Form.Label>
                        <Form.Select onChange={(e) => onInputChange(e)} aria-required="true" required value={department || ""} name="department">
                            <option value="">Se??iniz...</option>
                            {
                                filterDepartment.map(function (item) {
                                    return <option key={item["bolum_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L??tfen birini se??iniz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    <Form.Group className="mb-3" >
                        <Form.Label>Tak??mdaki G??revi/Ba??l?? Oldu??u Departman</Form.Label>
                        <Form.Control type="text" required maxLength="50"  name="assignment" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            L??tfen bu alan?? doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>??zge??mi?? <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(PDF Format??nda)</small></Form.Label>
                        <Form.Control required type="file" name="cvFile" onChange={e => {setCvFile(e.target.files);onInputChange(e)}} accept='.pdf' />
                        <Form.Control.Feedback type="invalid">
                            L??tfen bir dosya y??kleyin.
                        </Form.Control.Feedback>
                    </Form.Group >
                    <Button variant="primary" type="submit" className="py-2 px-4 " style={{ width: "100%", fontWeight: "600", backgroundColor: "#216fb6" }}>EKLE</Button>
                </Form>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </Modal>
    )
}

export default AddModal;