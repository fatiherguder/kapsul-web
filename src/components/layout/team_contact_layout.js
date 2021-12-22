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
import { Select, Popover, Text, MultiSelect, Anchor } from '@mantine/core';




const url = "https://kapsulcom.herokuapp.com/team-form"

export default function TeamContactLayout({ setOpen }) {
    const [validated, setValidated] = useState(false);
    const [fadeValidated, setfadeValidated] = useState(false);
    const members = useContext(MemberContext);

    const { teamIns } = useContext(MemberContext);
    const { applyData } = useContext(MemberContext);
    const { files } = useContext(MemberContext);
    let uploadStatus = 0;

    const uploadMemberCv = (file, teamName) => {
        storage
            .ref(
                `takım-basvurular/${teamName}/uye-cvleri/${file.name}`
            )
            .put(file)
            .on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                }, (err) => {
                    //catches the errors
                }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                    storage.ref('takım-basvurular').child(`${teamName}/uye-cvleri/${file.name}`).getDownloadURL()
                        .then(fireBaseUrl => {

                        })
                })

    }
    const postReq = () => {
        let apply = applyData;
        apply.members = members["members"];
        axios.post(url,
            apply
        ).then(res => {
            if (res) {
                setOpen(false)
                toast.success(res.data.message, {
                    position: toast.POSITION.BOTTOM_RIGHT
                })
            }
            setfadeValidated(false);
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



    const uploadFile = (file) => {
        storage
            .ref(
                `takım-basvurular/${applyData.teamName}/${file.name}`
            )
            .put(file)
            .on('state_changed',
                (snapShot) => {
                    //takes a snap shot of the process as it is happening
                }, (err) => {
                    //catches the errors
                }, () => {
                    storage.ref('takım-basvurular').child(`${applyData.teamName}/${file.name}`).getDownloadURL()
                        .then(fireBaseUrl => {
                            if (fireBaseUrl != null) {
                                ++uploadStatus;
                                if (uploadStatus == 2) {
                                    postReq();

                                }

                            }

                        })
                })

    }

    const onFormSubmit = (e) => {
        const form = e.currentTarget
        if (fadeValidated) {
            if (form.checkValidity() === false) {
                e.preventDefault()
                e.stopPropagation()
                setValidated(true)
            }
            if (form.checkValidity() === true) {
                setOpen(true)
                members["members"].map(m => uploadMemberCv(m.cvFile, applyData.teamName));
                uploadFile(files.teamFile);
                uploadFile(files.materialReqList)
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
    const [isDisable, setDisable] = useState(true);
    const [opened, setOpened] = useState(false);
    const [uni, setUni] = useState("");
    const [insType, setInsType] = useState("0");

    const handleInsType = (e) => {
        e.target.value === "1" ? setDisable(false) : setDisable(true);
        setInsType(e.target.value);
    }

    const members = useContext(MemberContext);
    const { deleteMember } = useContext(MemberContext)
    const { updateTeamIns } = useContext(MemberContext);
    const { updateApplyData } = useContext(MemberContext);

    const [show, setShow] = useState(false);
    const [showEdit, setshowEdit] = useState(false)
    const [memberIndex, setMemberIndex] = useState();

    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true)

    const handleEditClose = () => setshowEdit(false)
    const handleEditOpen = (index) => {
        setMemberIndex(index);
        setshowEdit(true)
    }

    useEffect(() => {
        handleClose();
        handleEditClose();
    }, [members])


    const universities = [];

    universityJSON["data"].map(u => {
        let university = { value: u.name, label: u.name };

        universities.push(university);
    })


    for (let index = 1; index < 23; index++) {
        years.push((new Date().getFullYear() - index) + 1);
    }

    return (
        <div>
            <h4 className="mb-3 pt-3">Takım Bilgileri</h4>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Adı</Form.Label>
                    <Form.Control type="name" name='teamName' onChange={e => updateApplyData(e.target.name, e.target.value)} required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Üye Sayısı <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Danışman Hariç)</small></Form.Label>
                    <Form.Control type="number" name="memberCount" onChange={e => updateApplyData(e.target.name, e.target.value)} required maxLength="2" min="1" />
                    <Form.Control.Feedback type="invalid">
                        Geçerli bir sayı giriniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>Takım Kuruluş Yılı</Form.Label>
                    <Form.Select aria-required="true" name="foundationYear" onChange={e => updateApplyData(e.target.name, e.target.value)} required >
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
                    <Form.Label>Takım Çalışma Alanı</Form.Label>
                    <Form.Select aria-required="true" name="fieldOfProfessionalism" onChange={e => updateApplyData(e.target.name, e.target.value)} required >
                        <option value="">Seçiniz...</option>
                        <option value="2">ELEKTRİKLİ ARAÇLAR</option>
                        <option value="3">ELEKTRONİK</option>
                        <option value="4">HAVACILIK</option>
                        <option value="5">İNSANSIZ HAVA ARACI</option>
                        <option value="6">KODLAMA</option>
                        <option value="7">MEKANİK TASARIM</option>
                        <option value="8">NANOTEKNOLOJİ VE MALZEME BİLİMİ</option>
                        <option value="9">OTONOM SİSTEMLER</option>
                        <option value="10">ROBOTİK</option>
                        <option value="11">SİBER GÜVENLİK</option>
                        <option value="12">ÜRETİM</option>
                        <option value="13">UZAY</option>
                        <option value="14">VERİ BİLİMİ</option>
                        <option value="15">YAPAY ZEKA</option>
                        <option value="16">YAZILIM</option>
                        <option value="1">DİĞER</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
            </Row>
            <Row>
                <Form.Group as={Col} className="mb-3">
                    <Form.Label>İçerisinde Bulunduğunuz Kurum Tipi</Form.Label>
                    <Form.Select name="institutionType" onChange={e => updateApplyData(e.target.name, e.target.value)} aria-required="true" required >
                        <option value="">Seçiniz..</option>
                        <option value="1">Üniversite</option>
                        <option value="2">Lise</option>
                        <option value="4">Diğer</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >


                <Popover
                    opened={opened}
                    onClose={() => setOpened(false)}
                    position="bottom"
                    placement="start"
                    withArrow
                    noFocusTrap
                    noEscape
                    transition="pop-top-left"
                    position="top"
                    width={260}
                    styles={{ body: { pointerEvents: 'none' } }}
                    target={
                        <Form.Group as={Col} className="mb-3">
                            <Form.Label>Takımın Bağlı Olduğu Okul/Kurum</Form.Label>
                            <MultiSelect
                                onFocus={() => setOpened(true)}
                                onBlur={() => setOpened(false)}
                                maxSelectedValues={1}
                                nothingFound="Bulunamadı"
                                data={universities}                               
                                onChange={(v) => updateApplyData("teamSchool", v[0])}
                                placeholder="Seçiniz"
                                searchable
                                creatable
                                name="teamSchool"
                                getCreateLabel={(query) => `${query}`}
                                onCreate={(query) => setUni(query)}
                                onMouseEnter={() => setOpened(true)}
                                onMouseLeave={() => setOpened(false)}
                            />
                            <Form.Control.Feedback type="invalid">
                                Lütfen birini seçiniz.
                            </Form.Control.Feedback>
                        </Form.Group >
                    }
                >
                    <Text size="sm">Üyelerin çoğunlukta olduğu okul/kurum seçiniz yoksa yazınız.</Text>
                </Popover>
            </Row>
            <Row>
            <Form.Group className="mb-3">
                <Form.Label>Takım Seviyesi: <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Takımınızın eğitim seviyesini danışman hoca haricinde takım üyelerinden en yüksek eğitim seviyesine sahip olana göre seçiniz)</small></Form.Label>
                <Form.Select name="teamLevel" onChange={e => updateApplyData(e.target.name, e.target.value)} aria-required="true" required >
                    <option value="">Seçiniz..</option>
                    <option value="3">LİSE</option>
                    <option value="4">ÖN LİSANS</option>
                    <option value="5">LİSANS</option>
                    <option value="6">YÜKSEK LİSANS</option>
                    <option value="7">DOKTORA</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group >
            </Row>
            <Form.Label className="mb-2">Takım Üyeleri</Form.Label>
            {
                members["members"].length > 0 ?
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Ad</th>
                                    <th>Soyad</th>
                                    <th>Görev</th>
                                    <th>İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    members["members"].map((item, index) => {
                                        return <tr key={item.uid}>
                                            <td>{index + 1}</td>
                                            <td>{item["name"]}</td>
                                            <td>{item["surname"]}</td>
                                            <td>{item["assignment"]}</td>
                                            <td className="d-flex justify-content-end">
                                                <Button onClick={() => handleEditOpen(index)} variant="primary" size="sm" className="align-items-center d-flex bg-transparent border-0">
                                                    <FaEdit className="text-primary" size="20px" />
                                                </Button>
                                                <Button onClick={() => { deleteMember(item.uid) }} variant="danger" size="sm" className="align-items-center d-flex bg-transparent border-0">
                                                    <FaTrashAlt size="20px" className="text-danger" />
                                                </Button>

                                            </td>
                                        </tr>
                                    })
                                }
                                {showEdit ? <EditModal showEdit={showEdit} handleEditClose={handleEditClose} member={members["members"][memberIndex]} /> : null}
                            </tbody>
                        </Table>
                    </div> :
                    <div className="member-container">
                        <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> Henüz bir üye bulunmamaktadır...</small>
                    </div>
            }
            <div className="d-flex justify-content-end">
                <Button onClick={handleOpen} style={{ backgroundColor: "#216fb6" }} className="px-3 py-2 my-3 align-items-center d-flex">
                    Üye Ekle
                    <FaUserPlus className="mx-2" />
                </Button>
            </div>
            <AddModal insType={insType} show={show} handleClose={handleClose} />
        </div>
    )
}


const ConsultantInformation = ({ setFile }) => {

    const { updateApplyData } = useContext(MemberContext);
    const { updateFiles } = useContext(MemberContext);


    const [isOther, setOther] = useState(false);
    const NumericOnly = (e) => { //angka only
        const reg = /^[0-9\b]+$/
        let preval = e.target.value
        if (e.target.value === '' || reg.test(e.target.value)) return true
        else e.target.value = preval.substring(0, (preval.length - 1))
    }
    return (
        <div>

            <h4 className="mb-3 pt-3">Takım Danışman Bilgisi</h4>
            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Danışman Adı</Form.Label>
                    <Form.Control type="name" name="consultantName" onChange={e => updateApplyData(e.target.name, e.target.value)} required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col}>
                    <Form.Label>Danışman Soyadı</Form.Label>
                    <Form.Control type="name" name="consultantSurname" onChange={e => updateApplyData(e.target.name, e.target.value)} required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col}>
                    <Form.Label>Danışman Mail Adresi</Form.Label>
                    <Form.Control type="email" name='consultantMail' onChange={e => updateApplyData(e.target.name, e.target.value)} required />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col}>
                    <Form.Label>Danışman Cep Telefonu</Form.Label>
                    <Form.Control
                        name="consultantPhone"
                        onChange={e => { updateApplyData(e.target.name, e.target.value); NumericOnly(e) }}
                        placeholder="05XX-XXX-XXXX"
                        required
                        maxLength="11"
                        minLength="11"
                    />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Danışmanın Bağlı Olduğu Kurum/Kuruluş</Form.Label>
                <Form.Control type="name" name="institutionOfTheConsultant" onChange={e => updateApplyData(e.target.name, e.target.value)} required maxLength="50" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Başvurulan Yarışma</Form.Label>
                <Form.Select name="competition" onChange={(e) => { { e.target.value === challangeJSON["data"].length ? setOther(true) : setOther(false) }; updateApplyData(e.target.name, e.target.value) }} aria-required="true" required >
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
                <Form.Label>Takım Dosyası <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(PDF Formatında)</small></Form.Label>
                <Form.Control name='teamFile' onChange={e => updateFiles(e.target.name, e.target.files[0])} required type="file" accept='.pdf' />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >
            <Form.Group className="mb-3">
                <Form.Label>Malzeme İhtiyaç Listesi <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(Aşağıdaki bağlantıdan şablonu indirerek .xlsx formatında yükleyiniz.)</small></Form.Label>
                <Form.Control name="materialReqList" onChange={e => updateFiles(e.target.name, e.target.files[0])} required type="file" accept='.xlsx' />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
                <Anchor href="http://kapsulkonya.com/static/media/malzeme_listesi_sablon.xlsx" target="_blank">İhtiyaç Listesi Şablon</Anchor>
            </Form.Group >
        </div>

    )
}



