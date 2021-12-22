
import { React, useState, useContext } from 'react'
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
import { MultiSelect } from '@mantine/core';
import { PersonalApplyContext } from '../../context/PersonalApplyContext';

const url = "https://kapsulcom.herokuapp.com/individual-form";


export default function ContactLayout({ setOpen }) {
    const { interests } = useContext(PersonalApplyContext);
    const { contributions } = useContext(PersonalApplyContext);

    const [fadeValidated, setfadeValidated] = useState(false)
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        var question1 = [];
        question1.push(form[16].value);

        if (fadeValidated) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                setOpen(true)

                storage
                    .ref(
                        `bireysel-basvurular/${form[4].value}/${form[15].files[0].name}`
                    )
                    .put(form[15].files[0])
                    .on('state_changed',
                        (snapShot) => {
                            //takes a snap shot of the process as it is happening
                        }, (err) => {
                            //catches the errors
                        }, () => {
                            // gets the functions from storage refences the image storage in firebase by the children
                            // gets the download url then sets the image from firebase as the value for the imgUrl key:
                            storage.ref('bireysel-basvurular').child(`${form[4].value}/${form[15].files[0].name}`).getDownloadURL()
                                .then(fireBaseUrl => {
                                    if (fireBaseUrl != null) {
                                        var applyData = {
                                            "name": form[0].value,
                                            "surname": form[1].value,
                                            "gender": form[2].value,
                                            "dateOfBirth": form[3].value,
                                            "email": form[4].value,
                                            "school": form[10].value,
                                            "faculty": form[11].value,
                                            "department": form[12].value,
                                            "grade": form[13].value,
                                            "district": form[8].value,
                                            "education_level": form[9].value,
                                            "country": form[6].value,
                                            "city": form[7].value,
                                            "phone": form[5].value,
                                            "dateOfGraduation": form[14].value,
                                            "question1": question1,
                                            "question2": interests,
                                            "question3": contributions
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
                    <Form.Label>Ad</Form.Label>
                    <Form.Control type="name" required maxLength="50" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label>Soyad</Form.Label>
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
                    placeholder="05XX-XXX-XXXX"
                    onChange={e => NumericOnly(e)}
                    maxLength={11}
                    minLength={11}
                    required                
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
                        <option value="TÜRKİYE">TÜRKİYE</option>
                        <option value="DİĞER">DİĞER</option>
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
                    <Form.Label>Mezuniyet Tarihi<small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Mezun değilseniz tahmini mezuniyet tarihini giriniz)</small></Form.Label>
                    <Form.Control type="date" name="date" required />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bir tarih seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Özgeçmişinizi Yükleyiniz <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(PDF Formatında)</small></Form.Label>
                <Form.Control required type="file" accept='.pdf' />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >
        </div>
    )
}


const MemberInformations = () => {

    const personalApplyContext = useContext(PersonalApplyContext);
    const { addInterests } = useContext(PersonalApplyContext);
    const { addContributions } = useContext(PersonalApplyContext)




    const ilgiAlanlari = [
        { value: 'Araştırma', label: 'Araştırma' },
        { value: 'Elektrikli Araçlar', label: 'Elektrikli Araçlar' },
        { value: 'Elektronik', label: 'Elektronik' },
        { value: 'Havacılık', label: 'Havacılık' },
        { value: 'İnsansız Hava Araçları', label: 'İnsansız Hava Araçları' },
        { value: 'İnsansız Kara Araçları', label: 'İnsansız Kara Araçları' },
        { value: 'İnsansız Sualtı Araçları', label: 'İnsansız Sualtı Araçları' },
        { value: 'Kodlama', label: 'Kodlama' },
        { value: 'Makine Öğrenmesi', label: 'Makine Öğrenmesi' },
        { value: 'Mekanik Tasarım', label: 'Mekanik Tasarım' },
        { value: 'Otonom Sistemler', label: 'Otonom Sistemler' },
        { value: 'Robotik', label: 'Robotik' },
        { value: 'Siber Güvenlik', label: 'Siber Güvenlik' },
        { value: 'Uzay', label: 'Uzay' },
        { value: 'Veri Bilimi', label: 'Veri Bilimi' },
        { value: 'Yapay Zeka', label: 'Yapay Zeka' },
        { value: 'Yazılım', label: 'Yazılım' },
        { value: 'Blockchain', label: 'Blockchain' },
        { value: 'IoT', label: 'IoT' },
    ];

    const katkiAlanlari = [
        { value: 'Elektronik Devre Tasarımı', label: 'Elektronik Devre Tasarımı' },
        { value: 'Nesnelerin İnterneti', label: 'Nesnelerin İnterneti' },
        { value: 'Elektronik Programlama', label: 'Elektronik Programlama' },
        { value: 'Enerji Teknolojileri', label: 'Enerji Teknolojileri' },
        { value: 'Havacılık ve Uzay Teknolojileri', label: 'Havacılık ve Uzay Teknolojileri' },
        { value: 'İleri Robotik', label: 'İleri Robotik' },
        { value: 'Kodlama', label: 'Kodlama' },
        { value: 'Malzeme Bilimi ve Nanoteknoloji', label: 'Malzeme Bilimi ve Nanoteknoloji' },
        { value: 'Mobil Uygulama', label: 'Mobil Uygulama' },
        { value: 'Otonom Sistemler', label: 'Otonom Sistemler' },
        { value: 'Rapor Hazırlama', label: 'Rapor Hazırlama' },
        { value: 'Robotik ve Kodlama', label: 'Robotik ve Kodlama' },
        { value: 'Siber Güvenlik', label: 'Siber Güvenlik' },
        { value: 'Tasarım ve Üretim', label: 'Tasarım ve Üretim' },
        { value: 'Veri Bilimi', label: 'Veri Bilimi' },
        { value: 'Yapay Zeka', label: 'Yapay Zeka' },
        { value: 'Yazılım Teknolojileri', label: 'Yazılım Teknolojileri' },  
    ]
    return (
        <div>
            <h4 className="mb-3 pt-3">Üyelik Bilgileri</h4>
            <Form.Group controlId="validationCustom17" className="mb-3">
                <Form.Label>Bizden Nasıl Haberdar oldunuz?</Form.Label>
                <Form.Select aria-required="true" required>
                    <option value="">Seçiniz...</option>
                    <option value="Sosyal Medya">Sosyal Medya</option>
                    <option value="Kapsül Web">Kapsül Web</option>
                    <option value="Fuar/Etkinlik">Fuar/Etkinlik</option>
                    <option value="Arkadaş/Çevre">Arkadaş/Çevre</option>
                    <option value="Reklam/Duyuru">Reklam/Duyuru</option>
                    <option value="Haber/Blog">Haber/Blog</option>
                    <option value="E-Posta">E-Posta</option>
                    <option value="Diğer">Diğer</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="validationCustom18" className="mb-3">
                <Form.Label>İlgi Alanlarınız Nelerdir? <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Seçeneklerden farklı eklemek istediğiniz bir alan varsa yazınız)</small> </Form.Label>


                <MultiSelect
                    maxSelectedValues={4}
                    data={ilgiAlanlari}
                    onChange={addInterests}
                    placeholder="Seçiniz"
                    searchable
                    creatable
                    getCreateLabel={(query) => `${query} ilgi alanını ekle`}
                    onCreate={null}
                />

                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom19" className="mb-3">
                <Form.Label>Bize Hangi Alanlarda Katkı Sağlayabilirsiniz?<small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Seçeneklerden farklı eklemek istediğiniz bir alan varsa yazınız)</small></Form.Label>
                <MultiSelect
                    maxSelectedValues={4}
                    data={katkiAlanlari}
                    onChange={addContributions}
                    placeholder="Seçiniz"
                    searchable
                    creatable
                    getCreateLabel={(query) => `${query} ilgi alanını ekle`}
                    onCreate={null}
                />
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
        </div>
    )
}