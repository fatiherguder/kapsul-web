import universityJSON from "../../store/universite.json";
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import facultyJSON from "../../store/fakulte.json";
import { MemberContext } from '../../context/MemberContext';
import departmentJSON from "../../store/bolum.json";
import { Form, Button, ModalTitle, ModalBody, Modal, ModalFooter } from "react-bootstrap";
import { React, useState, useContext, useEffect } from 'react'


const EditModal = ({ showEdit, handleEditClose, member }) => {

    const { updateMember } = useContext(MemberContext)

    const id = member.uid;

    const [newMember, setNewMember] = useState({
        ...member
    })

    const onInputChange = (e) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value })
    }

    

    const [universityID, setUniversityID] = useState(0);

    const [facultyID, setFacultyID] = useState(0);

    const [insType, setInsType] = useState(member.eduLevel);


    useEffect(() => {
        var uni_id, fac_id;

        universityJSON["data"].filter(item => {
            if (item["name"] === member.university) {

                          
                return uni_id = item["universite_id"];
            }
            return false;
        })

        facultyJSON["universite_fakulte"].filter(item => {
            if (item["universite_id"] == uni_id) {
                if (item["name"] == member.faculty) {

                    return fac_id = item["fakulte_id"];
                }
                return false;
            }
            return false;
        })

        setUniversityID(uni_id)
        setFacultyID(fac_id);
    }, [member.university, member.faculty])

    var filterFaculity = facultyJSON["universite_fakulte"].filter(function (item) {
        return item["universite_id"] == universityID;
    })

    var filterDepartment = departmentJSON["universite_bolum"].filter(function (item) {
        return item["fakulte_id"] == facultyID;
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMember(id, newMember);
    }

    return (
        showEdit ? <Modal show={showEdit} onHide={handleEditClose}>
            <ModalHeader closeButton>
                <ModalTitle>
                    Üye Güncelle
                </ModalTitle>
            </ModalHeader>
            <ModalBody>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group className="mb-3" >
                        <Form.Label>İsim</Form.Label>
                        <Form.Control type="text" required maxLength="50" value={newMember.name || ""} name="name" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" >
                        <Form.Label>Soyisim</Form.Label>
                        <Form.Control type="text" required maxLength="50" value={newMember.surname || ""} name="surname" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Eğitim Seviyesi</Form.Label>
                        <Form.Select aria-required="true" value={newMember.eduLevel || ""} required name="eduLevel" onChange={(e) => { setInsType(e.target.value); onInputChange(e) }}>
                            <option value="">Seçiniz..</option>
                            <option value="LİSE">LİSE</option>
                            <option value="ÖN LİSANS">ÖN LİSANS</option>
                            <option value="LİSANS">LİSANS</option>
                            <option value="YÜKSEK LİSANS">YÜKSEK LİSANS</option>
                            <option value="DOKTORA">DOKTORA</option>
                            <option value="MEZUN">MEZUN</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group>


                    {insType == "LİSE" ? <Form.Group className="mb-3">
                        <Form.Label>Okul Adı</Form.Label>
                        <Form.Control type="name" value={newMember.school || ""} name="school" onChange={e => onInputChange(e)} required maxLength="50" />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    {insType != "LİSE" && insType != "0" ? <Form.Group className="mb-3"  >
                        <Form.Label>Üniversite</Form.Label>
                        <Form.Select onChange={(e) => { setUniversityID(e.target.selectedIndex - 1); onInputChange(e) }} aria-required="true" required value={newMember.university || ""} name="university">
                            <option value="">Seçiniz..</option>
                            {
                                universityJSON["data"].map(function (item) {
                                    return <option key={item["universite_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group > : null}



                    {insType != "LİSE" ? <Form.Group className="mb-3" >
                        <Form.Label>Fakülte / Enstitü</Form.Label>
                        <Form.Select onChange={(e) => { setFacultyID(e.target[e.target.selectedIndex].id); onInputChange(e) }} aria-required="true" required value={newMember.faculty || ""} name="faculty">
                            <option value="">Seçiniz...</option>
                            {
                                filterFaculity.map(function (item) {
                                    return <option id={item["fakulte_id"]} key={item["fakulte_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    {insType != "LİSE" ? <Form.Group className="mb-3" >
                        <Form.Label>Bölüm</Form.Label>
                        <Form.Select aria-required="true" required value={newMember.department || ""} name="department" onChange={(e) => onInputChange(e)}>
                            <option value="">Seçiniz...</option>
                            {
                                filterDepartment.map(function (item) {
                                    return <option key={item["bolum_id"]} value={item["name"]}>{item["name"]}</option>
                                })
                            }
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group> : null}
                    <Form.Group className="mb-3" >
                        <Form.Label>Takımdaki Görevi/Bağlı Olduğu Departman</Form.Label>
                        <Form.Control type="text" required maxLength="50" value={newMember.assignment || ""} name="assignment" onChange={e => onInputChange(e)} />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="py-2 px-4 " style={{ width: "100%", fontWeight: "600" }}>GÜNCELLE</Button>
                </Form>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </Modal> : null
    )
}

export default EditModal;