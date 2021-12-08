
import { React, useState } from 'react'
import { Row, Col, Form } from "react-bootstrap";
import "./personal_contact_layout.css";
import LightingTextArea from './lighting_text_area';
import city from "../../store/il.json";
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import university from "../../store/universite.json";
import faculty from "../../store/fakulte.json";
import department from "../../store/bolum.json";
import district from "../../store/ilce.json";
import { storage } from '../../firebase';


const url = "https://kapsulcom.herokuapp.com/individual-form";

export default function ContactLayout({ setOpen }) {

    const [fadeValidated, setfadeValidated] = useState(false)
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {

        const form = event.currentTarget;
        if (fadeValidated) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                setOpen(true)

                storage
                    .ref(
                        `bireysel-basvurular/${form[4].value}/${form[16].files[0].name}`
                    )
                    .put(form[16].files[0])
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
                            storage.ref('bireysel-basvurular').child(`${form[4].value}/${form[16].files[0].name}`).getDownloadURL()
                                .then(fireBaseUrl => {                                  
                                    if (fireBaseUrl != null) {                                        
                                        var applyData = {
                                            "name": form[0].value,
                                            "surname": form[1].value,
                                            "gender": form[2].value,
                                            "dateOfBirth": form[3].value,
                                            "tcNo": form[4].value,
                                            "email": form[5].value,
                                            "school": form[11].value,
                                            "faculty": form[12].value,
                                            "department": form[13].value,
                                            "grade": form[14].value,
                                            "district": form[9].value,
                                            "education_level": form[10].value,
                                            "file": fireBaseUrl,
                                            "country": form[7].value === 1 ? "TÜRKİYE" : "DİĞER",
                                            "city": form[8].value,
                                            "phone": form[6].value,
                                            "dateOfGraduation": form[15].value,
                                            "question1": form[17].value,
                                            "question2": form[18].value,
                                            "question3": form[19].value
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
                                        })
                                            .catch(
                                                err => {
                                                    if (err) {
                                                        toast.error(err)
                                                        setOpen(false)
                                                    }
                                                    setOpen(false)
                                                }
                                            );
                                    }

                                })
                        })
                event.preventDefault();
            }
            setValidated(true);
        }
    };
    return (

        <div className="form-container p-4" >
            <ToastContainer />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <PersonalInformations />
                <ContactInformations />
                <EducationInformations />
                <MemberInformations />
                <LightingTextArea setFadeValidation={setfadeValidated} />
            </Form>
        </div>
    )
}


const PersonalInformations = () => {

    const NumericOnly = (e) => { //angka only
        const reg = /^[0-9\b]+$/
        let preval = e.target.value
        if (e.target.value === '' || reg.test(e.target.value)) return true
        else e.target.value = preval.substring(0, (preval.length - 1))
    }

    return (
        <div>
            <h4 className="mb-3 pt-3">Kişisel Bilgiler</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Adı</Form.Label>
                    <Form.Control type="name" required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label>Soyadı</Form.Label>
                    <Form.Control type="name" required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom03">
                    <Form.Label>Cinsiyet</Form.Label>
                    <Form.Select aria-required="true" required>
                        <option value="">Seçiniz...</option>
                        <option value="0">KADIN</option>
                        <option value="1">ERKEK</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} controlId="validationCustom04">
                    <Form.Label>Doğum Tarihi</Form.Label>
                    <Form.Control
                        type="date"
                        max={"2016-05-19T12:00:00.000Z"}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bir tarih seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Form.Group controlId="validationCustom05" className="mb-3">
                <Form.Label>T.C Kimlik Numarası</Form.Label>
                <Form.Control
                    required
                    onChange={NumericOnly}
                    maxLength="11"
                    minLength="11"
                />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
        </div>
    )
}


const ContactInformations = () => {
    const NumericOnly = (e) => { //angka only
        const reg = /^[0-9\b]+$/
        let preval = e.target.value
        if (e.target.value === '' || reg.test(e.target.value)) return true
        else e.target.value = preval.substring(0, (preval.length - 1))
    }

    var sortedCity = city["data"].sort(function (a, b) {
        return a["id"] - b["id"];
    })

    const [cityID, setCityID] = useState(31);
    const [isDisable, setDisable] = useState(false);

    var filterDistrict = district["data"].filter(function (item) {
        return item["il_id"] === cityID.toString();
    })

    return (
        <div>
            <h4 className="mb-3 pt-3">İletişim Bilgileri</h4>
            <Form.Group as={Col} controlId="validationCustom06" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" required maxLength="80" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom07" className="mb-3">
                <Form.Label>Cep Telefonu</Form.Label>
                <Form.Control
                    placeholder="+05"
                    onChange={NumericOnly}
                    required
                    maxLength="11"
                    minLength="11"
                />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom08">
                    <Form.Label>Ülke</Form.Label>
                    <Form.Select onChange={(e) => e.target.value === "2" ? setDisable(true) : setDisable(false)} aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        <option value="1">TÜRKİYE</option>
                        <option value="2">DİĞER</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} controlId="validationCustom09">
                    <Form.Label>Şehir</Form.Label>
                    <Form.Select onChange={(e) => setCityID(e.target.value)} aria-required="true" required disabled={isDisable} >
                        <option value="">Seçiniz..</option>
                        {

                            isDisable ? null :
                                sortedCity.map(function (city) {
                                    return <option key={city["id"]} value={city["id"]}>{city["name"]}</option>
                                })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
                <Form.Group as={Col} controlId="validationCustom10">
                    <Form.Label>İlçe</Form.Label>
                    <Form.Select aria-required="true" required disabled={isDisable} >
                        <option value="">Seçiniz...</option>
                        {
                            isDisable ? null :
                                filterDistrict.map(function (districtItem) {
                                    return <option key={districtItem["id"]} value={districtItem["id"]}>{districtItem["name"]}</option>
                                })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group >
            </Row>
        </div>
    )
}


const EducationInformations = () => {
    const [isDisable, setIsDisable] = useState(true)
    const [universityID, setUniversityID] = useState(0);
    const [facultyID, setFacultyID] = useState(0);

    var filterFaculity = faculty["universite_fakulte"].filter(function (item) {
        return item["universite_id"] === universityID;
    })

    var filterDepartment = department["universite_bolum"].filter(function (item) {
        return item["fakulte_id"] === facultyID;
    })

    return (
        <div>
            <h4 className="mb-3 pt-3">Eğitim Bilgileri</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom11">
                    <Form.Label>Eğitim Seviyesi</Form.Label>
                    <Form.Select aria-required="true" required onChange={(e) => e.target.value > 4 ? setIsDisable(false) : setIsDisable(true)}>
                        <option value="">Seçiniz..</option>
                        <option value="1">YOK</option>
                        <option value="2">İLKOKUL</option>
                        <option value="3">ORTAOKUL</option>
                        <option value="4">LİSE</option>
                        <option value="5">ÖN LİSANS</option>
                        <option value="6">LİSANS</option>
                        <option value="7">YÜKSEK LİSANS</option>
                        <option value="8">DOKTORA</option>
                        <option value="9">MEZUN</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom12">
                    <Form.Label>Okul</Form.Label>
                    <Form.Select onChange={(e) => setUniversityID(e.target.value)} aria-required="true" required disabled={isDisable}>
                        <option value="">Seçiniz...</option>
                        {
                            university["data"].map(function (item) {
                                return <option key={item["universite_id"]} value={item["universite_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom13">
                    <Form.Label>Fakülte / Enstitü</Form.Label>
                    <Form.Select onChange={(e) => setFacultyID(e.target.value)} aria-required="true" required disabled={isDisable}>
                        <option value="">Seçiniz...</option>
                        {
                            filterFaculity.map(function (item) {
                                return <option key={item["fakulte_id"]} value={item["fakulte_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom14">
                    <Form.Label>Bölüm</Form.Label>
                    <Form.Select aria-required="true" required disabled={isDisable} >
                        <option value="">Seçiniz...</option>
                        {
                            filterDepartment.map(function (item) {
                                return <option key={item["bolum_id"]} value={item["bolum_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom15">
                    <Form.Label>Sınıf</Form.Label>
                    <Form.Select aria-required="true" required disabled={isDisable} >
                        <option value="">Seçiniz...</option>
                        <option value="1">Hazırlık</option>
                        <option value="2">1.Sınıf</option>
                        <option value="3">2.Sınıf</option>
                        <option value="4">3.Sınıf</option>
                        <option value="5">4.Sınıf</option>
                        <option value="6">5.Sınıf</option>
                        <option value="7">6.Sınıf</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom16">
                    <Form.Label>Mezuniyet Tarihi</Form.Label>
                    <Form.Control type="date" name="date" required />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bir tarih seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Özgeçmişinizi Yükleyiniz</Form.Label>
                <Form.Control required type="file" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >
        </div>
    )
}


const MemberInformations = () => {
    return (
        <div>
            <h4 className="mb-3 pt-3">Üyelik Bilgileri</h4>
            <Form.Group controlId="validationCustom17" className="mb-3">
                <Form.Label>Bizden Nasıl Haberdar oldunuz?</Form.Label>
                <Form.Select aria-required="true" required>
                    <option value="">Seçiniz...</option>
                    <option value="1">Sosyal Medya</option>
                    <option value="2">Kapsül Web</option>
                    <option value="3">Fuar/Etkinlik</option>
                    <option value="4">Arkadaş/Çevre</option>
                    <option value="5">Reklam/Duyuru</option>
                    <option value="6">Haber/Blog</option>
                    <option value="7">E-Posta</option>
                    <option value="8">Diğer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom18" className="mb-3">
                <Form.Label>İlgi Alanlarınız Nelerdir?</Form.Label>
                <Form.Select aria-required="true" required >
                    <option value="">Seçiniz...</option>
                    <option value="1">Araştırma</option>
                    <option value="2">Elektirkli Araçlar</option>
                    <option value="3">Elektronik</option>
                    <option value="4">Havacılık</option>
                    <option value="5">İnsansız Hava Araçları</option>
                    <option value="6">İnsansız Kara Araçları</option>
                    <option value="7">İnsansız Sualtı Araçları</option>
                    <option value="8">Kodlama</option>
                    <option value="9">Makine Öğrenmesi</option>
                    <option value="10">Mekanik Tasarım</option>
                    <option value="11">Otonom Sistemler</option>
                    <option value="12">Robotik</option>
                    <option value="13">Siber Güvenlik</option>
                    <option value="14">Uzay</option>
                    <option value="15">Veri Bilimi</option>
                    <option value="16">Yapay Zeka</option>
                    <option value="17">Yazılım</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom19" className="mb-3">
                <Form.Label>Bize Hangi Alanlarda Katkı Sağlayabilirsiniz?</Form.Label>
                <Form.Select aria-required="true" required >
                    <option value="">Seçiniz...</option>
                    <option value="1">Elektronik Devre Tasarımı</option>
                    <option value="2">Nesnelerin İnterneti</option>
                    <option value="3">Elektronik Programlama</option>
                    <option value="4">Enerji Teknolojileri</option>
                    <option value="5">Havacılık ve Uzay Teknolojileri</option>
                    <option value="6">İleri Robotik</option>
                    <option value="7">Kodlama</option>
                    <option value="8">Malzeme Bilimi ve Nanoteknoloji</option>
                    <option value="9">Mobil Uygulama</option>
                    <option value="10">Otonom Sistemler</option>
                    <option value="11">Rapor Hazırlama</option>
                    <option value="12">Robotik ve Kodlama</option>
                    <option value="13">Siber GÜvenlik</option>
                    <option value="14">Tasarım ve Üretim</option>
                    <option value="15">Veri Bilimi</option>
                    <option value="16">Yapay Zeka</option>
                    <option value="17">Yazılım Teknolojileri</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
        </div>
    )
}