import { React, useState, useContext, useEffect } from 'react'
import { MemberContext } from '../../context/MemberContext';
import { Form, Row, Col, Button, Table } from "react-bootstrap";
import "./team_contact_layout.css"
import LightingTextArea from './lighting_text_area';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddModal from "../modal/AddModal"
import EditModal from '../modal/EditModal';
import axios from 'axios';
import { FaUserPlus, FaTrashAlt, FaEdit } from 'react-icons/fa';
import universityJSON from "../../store/universite.json";
import challangeJSON from "../../store/yarisma_isimleri.json"
import { storage } from '../../firebase';


const url = "https://kapsulcom.herokuapp.com/team-form"

export default function TeamContactLayout({ setOpen }) {
    const [validated, setValidated] = useState(false);
    const [fadeValidated, setfadeValidated] = useState(false)
    const members = useContext(MemberContext);

    const onFormSubmit = (e) => {
        const form = e.currentTarget
        if (fadeValidated) {
            if (form.checkValidity() === false) {
                e.preventDefault()
                e.stopPropagation()
                setValidated(true)

            }
            if (form.checkValidity() === true) {
                console.log(members["members"])
                setOpen(true)

                storage
                    .ref(
                        `takım-basvurular/${form[0].value}/${form[11].files[0].name}`
                    )
                    .put(form[11].files[0])
                    .on('state_changed',
                        (snapShot) => {
                            //takes a snap shot of the process as it is happening
                            console.log(snapShot)
                        }, (err) => {
                            //catches the errors
                            console.log(err)
                        }, () => {
                            // gets the functions from storage refences the image storage in firebase by the children
                            // gets the download url then sets the image from firebase as the value for the imgUrl key:
                            storage.ref('takım-basvurular').child(`${form[0].value}/${form[11].files[0].name}`).getDownloadURL()
                                .then(fireBaseUrl => {
                                    if (fireBaseUrl != null) {
                                        var applyData = {
                                            "name": form[0].value,
                                            "memberCount": form[1].value,
                                            "foundationYear": form[2].value,
                                            "fieldOfProfessionalism": form[3].value,
                                            "institutionType": form[4].value,
                                            "teamSchool": form[5].value,
                                            "teamLevel": form[6].value,
                                            "consultantName": form[7].value,
                                            "consultantSurname": form[8].value,
                                            "institutionOfTheConsultant": form[9].value,
                                            "competition": form[10].value,
                                            "file": fireBaseUrl,
                                            "members": members["members"]
                                        };

                                        axios.post(url,
                                            applyData
                                        ).then(res => {
                                            if (res) {
                                                setOpen(false)
                                                toast.success(res.data.message, {
                                                    position: toast.POSITION.BOTTOM_RIGHT
                                                })
                                            }
                                        }).catch(err => {
                                            if (err) {
                                                setOpen(false)
                                                toast.error("Bir hata oluştu", {
                                                    position: toast.POSITION.BOTTOM_RIGHT
                                                })
                                            }
                                         }
                                        );
                                    }

                                })
                        })
                e.preventDefault();
            }
            setValidated(true);
        }
    }

    return (
        <div className="form-container p-4" >
            <ToastContainer />
            <Form noValidate validated={validated} onSubmit={e => onFormSubmit(e)}>
                <TeamInformation />
                <ConsultantInformation />
                <LightingTextArea setFadeValidation={setfadeValidated} />
            </Form>
        </div >
    )
}




const TeamInformation = () => {
    const years = [];

    for (let index = 1; index < 23; index++) {
        years.push((new Date().getFullYear() - index) + 1);
    }

    return (
        <div>
            <h4 className="mb-3 pt-3">Takım Bilgileri</h4>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Adı</Form.Label>
                    <Form.Control type="name" required maxLength="50" onChange={(e) => console.log(e.target.value.trim())} />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Üye Sayısı (Danışman Hariç)</Form.Label>
                    <Form.Control type="number" required maxLength="2" min="1" />
                    <Form.Control.Feedback type="invalid">
                        Geçerli bir sayı giriniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Kuruluş Yılı</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        {
                            years.map((item) => {
                                return <option value={item - 2000} key={item - 2000}>{item}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Profesyonellik Alanı</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        <option value="1">DİĞER</option>
                        <option value="2">ELEKTRİKLİ ARAÇLAR</option>
                        <option value="3">ELEKTRONİK</option>
                        <option value="4">HAVACILIK</option>
                        <option value="5">İNSANSIZ HAVA ARACI</option>
                        <option value="6">KODLAMA</option>
                        <option value="7">MEKANİK TASARIM</option>
                        <option value="8">NANOTEKNOLOJİSİ VE MALZEME BİLİMİ</option>
                        <option value="9">OTONOM SİSTEMLER</option>
                        <option value="10">ROBOTİK</option>
                        <option value="11">SİBER GÜVENLİK</option>
                        <option value="12">ÜRETİM</option>
                        <option value="13">UZAY</option>
                        <option value="14">VERİ BİLİMİ</option>
                        <option value="15">YAPAY ZEKA</option>
                        <option value="16">YAZILIM</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
            </Row>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>İçerisinde Bulunduğunuz Kurum Tipi</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz..</option>
                        <option value="1">Üniversite</option>
                        <option value="2">Lise</option>
                        <option value="3">Bilim Merkezi</option>
                        <option value="4">Diğer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Okulu (Üyelerin en fazla olduğu okulu seçin)</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz..</option>
                        {
                            universityJSON["data"].map(function (item) {
                                return <option key={item["universite_id"]} value={item["universite_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Takım Seviyesi: (Takımınızın eğitim seviyesini danışman hoca haricinde takım üyelerinden en yüksek eğitim seviyesine sahip olana göre seçiniz)</Form.Label>
                <Form.Select aria-required="true" required >
                    <option value="">Seçiniz..</option>
                    <option value="1">İLKOKUL</option>
                    <option value="2">ORTAOKUL</option>
                    <option value="3">LİSE</option>
                    <option value="4">ÖN LİSANS</option>
                    <option value="5">LİSANS</option>
                    <option value="6">YÜKSEK LİSANS</option>
                    <option value="7">DOKTORA</option>
                    <option value="8">MEZUN</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group >
        </div>
    )
}


const ConsultantInformation = ({ setFile }) => {
    const members = useContext(MemberContext);
    const { deleteMember } = useContext(MemberContext)

    const [show, setShow] = useState(false);
    const [showEdit, setshowEdit] = useState(false)

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true)

    const handleEditClose = () => setshowEdit(false)
    const handleEditOpen = () => setshowEdit(true)

    useEffect(() => {
        handleClose();
        handleEditClose();
    }, [members])

    const [isOther, setOther] = useState(false);
    return (
        <div>
            <h4 className="mb-3 pt-3">Takım Danışman Bilgisi</h4>
            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Danışman Adı</Form.Label>
                    <Form.Control type="name" required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Danışman Soyadı</Form.Label>
                    <Form.Control type="name" required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Danışmanın Bağlı Olduğu Kurum/Kuruluş</Form.Label>
                <Form.Control type="name" required maxLength="50" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Başvurulan Yarışma</Form.Label>
                <Form.Select onChange={(e) => e.target.value === challangeJSON["data"].length ? setOther(true) : setOther(false)} aria-required="true" required >
                    <option value="">Seçiniz..</option>
                    {
                        challangeJSON["data"].map(item => {
                            return <option key={item["id"]} value={item["id"]}>{item["challange_name"]}</option>
                        })
                    }

                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group >
            {
                isOther ? <Form.Group className="mb-3">
                    <Form.Control type="name" required maxLength="50" placeholder="Başvurulacak yarışmayı belirtin" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group> : null
            }
            <Form.Group className="mb-3">
                <Form.Label>Takım Dosyası</Form.Label>
                <Form.Control required type="file" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >

            <Form.Label className="mb-2">Takım Üyeleri</Form.Label>
            {
                members["members"].length > 0 ?
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ad Soyad</th>
                                    <th>Üniversite</th>
                                    <th>Bölüm</th>
                                    <th>Görev</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members["members"].map((item, index) => {
                                        return <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item["name"] + " " + item["surname"]}</td>
                                            <td>{item["university"]}</td>
                                            <td>{item["department"]}</td>
                                            <td>{item["duty"]}</td>
                                            <td className="d-flex justify-content-end">
                                                <Button onClick={handleEditOpen} variant="primary" size="sm" className="align-items-center d-flex bg-transparent border-0">
                                                    <FaEdit className="text-primary" size="20px" />
                                                </Button>
                                                <Button onClick={() => deleteMember(item.id)} variant="danger" size="sm" className="align-items-center d-flex bg-transparent border-0">
                                                    <FaTrashAlt size="20px" className="text-danger" />
                                                </Button>
                                                <EditModal showEdit={showEdit} handleEditClose={handleEditClose} member={item} />
                                            </td>
                                        </tr>
                                    })
                                }

                            </tbody>
                        </Table>
                    </div> :
                    <div className="member-container">
                        <p>Henüz bir üye bulunmamaktadır.</p>
                    </div>
            }
            <div className="d-flex justify-content-end">
                <Button onClick={handleOpen} style={{ backgroundColor: "#216fb6" }} className="px-3 py-2 my-3 align-items-center d-flex">
                    Üye Ekle
                    <FaUserPlus className="mx-2" />
                </Button>
            </div>
            <AddModal show={show} handleClose={handleClose} />
        </div>

    )
}



