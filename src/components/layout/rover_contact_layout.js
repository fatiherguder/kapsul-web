
import { React, useState, useContext } from 'react'
import { Row, Col, Form } from "react-bootstrap";
import "./rover_contact_layout.css";
import LightingTextArea from './lighting_text_area';
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import university from "../../store/universite.json";
import faculty from "../../store/fakulte.json";
import department from "../../store/bolum.json";
import { storage } from '../../firebase';

const url = "https://kapsulcom.herokuapp.com/rover-form/";


export default function RoverContactLayout({ setOpen }) {
    const [fadeValidated, setfadeValidated] = useState(false)
    const [validated, setValidated] = useState(false);
    const [answare, setAnswer] = useState({})


    const addAnswer = (e) => {
        setAnswer({...answare,
            [e.target.name] : e.target.value
        })
    }

    const resetAnswers = () => {
        setAnswer({})
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        console.log(answare)
        if (fadeValidated) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (form.checkValidity() === true) {
                setOpen(true)

                storage
                    .ref(
                        `rover-basvurular─▒/${form[2].value}/${form[15].files[0].name}`
                    )
                    .put(form[15].files[0])
                    .on('state_changed',
                        (snapShot) => {
                            //takes a snap shot of the process as it is happening
                        }, (err) => {
                            //catches the errors
                        }, () => {
                            storage.ref('rover-basvurular─▒').child(`${form[2].value}/${form[15].files[0].name}`).getDownloadURL()
                                .then(fireBaseUrl => {
                                    if (fireBaseUrl != null) {
                                        var applyData = {
                                            "name": form[0].value,
                                            "surname": form[1].value,
                                            "phone": form[3].value,
                                            "email": form[2].value,
                                            "faculty": form[5].value,
                                            "department": form[6].value,
                                            "school": form[4].value,
                                            "team": form[16].value,
                                            "grade": form[7].value,
                                            "education_type": form[8].value,
                                            "english_level": form[9].value,
                                            "answer_one" :form[10].value,
                                            "answer_two" :form[11].value,
                                            "answer_three" :form[12].value,
                                            "answer_four" :form[13].value,
                                            "answer_five" :form[14].value,
                                            "answers": answare
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
                                                        toast.error("Bir hata olu┼čtu. Tekrar ba┼čvurun yada hata ile ilgili bilgiislem@kapsul.com adresine mail at─▒n─▒z.")
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
                <FieldInformations addAnswer={addAnswer} resetAnswers={resetAnswers}/>
                <LightingTextArea setFadeValidation={setfadeValidated} />
            </Form>
        </div>
    )
}


const PersonalInformations = () => {
    return (
        <div>
            <h4 className="mb-3 pt-3">Ki┼čisel Bilgiler</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Ad</Form.Label>
                    <Form.Control type="name" required />
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen bu alan─▒ doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control type="name" required />
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen bu alan─▒ doldurunuz.
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

    return (
        <div>
            <h4 className="mb-3 pt-3">─░leti┼čim Bilgileri</h4>
            <Row>
                <Form.Group as={Col} controlId="validationCustom03" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required maxLength="80" />
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen bu alan─▒ doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom04" className="mb-3">
                    <Form.Label>Cep Telefonu</Form.Label>
                    <Form.Control
                        placeholder="05XX-XXX-XXXX"
                        onChange={e => NumericOnly(e)}
                        maxLength={11}
                        minLength={11}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen bu alan─▒ doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
        </div>
    )
}


const EducationInformations = () => {
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
            <h4 className="mb-3 pt-3">E─čitim Bilgileri</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom05">
                    <Form.Label>├ťniversite</Form.Label>
                    <Form.Select onChange={(e) => setUniversityID(e.target.value)} aria-required="true" required>
                        <option value="">Se├žiniz...</option>
                        {
                            university["data"].map(function (item) {
                                return <option key={item["universite_id"]} value={item["universite_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom06">
                    <Form.Label>Fak├╝lte</Form.Label>
                    <Form.Select onChange={(e) => setFacultyID(e.target.value)} aria-required="true" required>
                        <option value="">Se├žiniz...</option>
                        {
                            filterFaculity.map(function (item) {
                                return <option key={item["fakulte_id"]} value={item["fakulte_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom07">
                    <Form.Label>B├Âl├╝m</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Se├žiniz...</option>
                        {
                            filterDepartment.map(function (item) {
                                return <option key={item["bolum_id"]} value={item["bolum_id"]}>{item["name"]}</option>
                            })
                        }
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom08">
                    <Form.Label>S─▒n─▒f</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Se├žiniz...</option>
                        <option value="Haz─▒rl─▒k">Haz─▒rl─▒k</option>
                        <option value="1.S─▒n─▒f">1.S─▒n─▒f</option>
                        <option value="2.S─▒n─▒f">2.S─▒n─▒f</option>
                        <option value="3.S─▒n─▒f">3.S─▒n─▒f</option>
                        <option value="4.S─▒n─▒f">4.S─▒n─▒f</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom09">
                    <Form.Label>├ľ─črenim T├╝r├╝</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Se├žiniz...</option>
                        <option value="1.├ľ─čretim">1.├ľ─čretim</option>
                        <option value="2.├ľ─čretim">2.├ľ─čretim</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom10">
                    <Form.Label>─░ngilizce Seviyeniz</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Se├žiniz...</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        L├╝tfen birini se├žiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
        </div>
    )
}


const FieldInformations = ({addAnswer,resetAnswers}) => {

    const [orderNumber, setOrderNumber] = useState(0)

    return (
        <div>
            <h4 className="mb-3 pt-3">Alan Bilgileri</h4>
            <Form.Group className='mb-3' controlId="validationCustom11">
                <Form.Label>Size g├Âre kendinizde ├Âne ├ž─▒kan ├Âzellikleriniz nelerdir?</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    L├╝tfen bu alan─▒ doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom12">
                <Form.Label>3 c├╝mle ile tak─▒m─▒m─▒za ni├žin kat─▒lmak istedi─činizi a├ž─▒klar m─▒s─▒n─▒z?</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    L├╝tfen bu alan─▒ doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom13">
                <Form.Label>Daha ├Ânce veya aktif olarak ├╝zerine ├žal─▒┼čt─▒─č─▒n─▒z bir ekip veya bireysel projeniz var m─▒? Varsa projeyi
                    ve ├žal─▒┼čt─▒─č─▒n─▒z konuyu k─▒saca a├ž─▒klay─▒n─▒z.</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    L├╝tfen bu alan─▒ doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom14" className="mb-3">
                <Form.Label>Haftal─▒k at├Âlye ├žal─▒┼čmas─▒na ka├ž saat ay─▒rabilirsiniz?</Form.Label>
                <Form.Select aria-required="true" required>
                    <option value="">Se├žiniz...</option>
                    <option value="1-3">1-3</option>
                    <option value="3-5">3-5</option>
                    <option value="5-7">5-7</option>
                    <option value="7-9">7-9</option>
                    <option value="10+">10+</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    L├╝tfen birini se├žiniz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom15">
                <Form.Label>LinkedIn hesab─▒n─▒z</Form.Label>
                <Form.Control placeholder="https://www.linkedin.com/in/example/" type="name" />
                <Form.Control.Feedback type="invalid">
                    L├╝tfen bu alan─▒ doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>├ľzge├žmi┼činizi Y├╝kleyiniz <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(PDF Format─▒nda)</small></Form.Label>
                <Form.Control required type="file" accept='.pdf' />
                <Form.Control.Feedback type="invalid">
                    L├╝tfen bir dosya y├╝kleyin.
                </Form.Control.Feedback>
            </Form.Group >
            <h4 className="mb-3 pt-3">Ekip Bilgileri</h4>
            <Form.Group controlId="validationCustom16" className="mb-3">
                <Form.Label>Ba┼čvuru Yapmak ─░stedi─činiz Ekip:</Form.Label>
                <Form.Select onChange={(e) => { setOrderNumber(e.target.selectedIndex); resetAnswers() }} aria-required="true" required>
                    <option value="">Se├žiniz...</option>
                    <option value="0">Bilim Ekibi</option>
                    <option value="1">Elektronik Ekibi</option>
                    <option value="2">Mekanik Ekibi</option>
                    <option value="4">Yaz─▒l─▒m Ekibi</option>
                    <option value="3">Organizasyon Ekibi</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    L├╝tfen birini se├žiniz.
                </Form.Control.Feedback>
            </Form.Group>
            {
                orderNumber == 1 && <div><h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Bilim Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Bilim Ekibi al─▒nan numunelerde kimyasal, biyolojik ve jeolojik analizler yapmak ├╝zere rover─▒n ├╝zerine
                        kurulacak mini laboratuvar ile ilgilenir.</p>
                    <Form.Group className='mb-3' controlId="validationCustom17">
                        <Form.Label>Kullanmay─▒ bildi─činiz laboratuvar ekipman ve cihazlar─▒ nelerdir?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} type="name" name='1' required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom18" className="mb-3">
                        <Form.Label>Astrobiyoloji'ye ilginizi 5 ├╝zerinden puanlay─▒n─▒z</Form.Label>
                        <Form.Select onChange={e => addAnswer(e)} aria-required="true" name='2' required>
                            <option value="">Se├žiniz...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen birini se├žiniz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom19">
                        <Form.Label>Jeolojik haritalama ├╝zerine kulland─▒─č─▒n─▒z bir program var m─▒? Varsa hangilerini kulland─▒─č─▒n─▒z─▒ 5
                            ├╝zerinden puanlay─▒n─▒z <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>((├ľr: Arcgis 4/5, JMars: 3/5))</small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group></div>
            }
            {
                orderNumber == 2 && <div><h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Elektronik Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Elektronik Ekibi, Rover ├╝zerindeki b├╝t├╝n elektronik sistemler, g├Âm├╝l├╝ yaz─▒l─▒mlar, haberle┼čme
                        sistemleri, motor entegrasyonlar─▒ ve sim├╝lasyonlar─▒n─▒ yapmaktad─▒r. Elektronik ekibi olarak kartlar─▒n
                        tasar─▒mlar─▒n─▒n tamamlan─▒p kullan─▒lacak b├Âlgedeki iyile┼čtirmeler ├╝zerinde ├žal─▒┼čmaktad─▒r. Ayn─▒ zamanda
                        bu kartlar─▒n temel yaz─▒l─▒mlar─▒n─▒ yap─▒lmas─▒ g├Ârevler aras─▒ndad─▒r.</p>
                    <Form.Group className='mb-3' controlId="validationCustom20">
                        <Form.Label>Kendinizi geli┼čtirmek istedi─činiz elektronik alan nedir ve neden?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom21">
                        <Form.Label>Kulland─▒─č─▒n─▒z bir elektronik design program─▒ var m─▒? Varsa nelerdir ve bunlar─▒ 5 ├╝zerinden
                            puanlay─▒n─▒z <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(Proteus 4/5 vs.)</small>
                        </Form.Label>
                        <Form.Control  onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom22" className="mb-3">
                        <Form.Label>C/C++ dillerine ne kadar hakimsiniz.</Form.Label>
                        <Form.Select onChange={e => addAnswer(e)} name='3' aria-required="true" required>
                            <option value="">Se├žiniz...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen birini se├žiniz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom23">
                        <Form.Label>Daha ├Ânce robotik ├žal─▒┼čmalar─▒n─▒z oldu mu. Oldu ise k─▒saca a├ž─▒klay─▒n─▒z.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='4' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group></div>
            }
            {
                orderNumber == 3 && <div>
                    <h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Mekanik Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Mekanik Ekibi ├žal─▒┼čma prensibi olarak y├╝r├╝r sistem, robot kol ve bilim laboratuvar─▒ olmak ├╝zere ├╝├ž
                        ana dala ayr─▒l─▒r. Rover ├╝zerinde kullan─▒lacak b├╝t├╝n sistemlerin tasar─▒m─▒, ├╝retimi, analiz edilmesi ve
                        montaj i┼člemlerinin t├╝m├╝ mekanik ekibinin sorumlulu─čundad─▒r..</p>
                    <Form.Group className='mb-3' controlId="validationCustom24">
                        <Form.Label>Kullanmay─▒ bildi─činiz tasar─▒m programlar─▒ nelerdir. 5 ├╝zerinden puanlay─▒n─▒z. <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (├ľr: Solid 4/5, Autocad
                            3/5 vs.)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom25">
                        <Form.Label>Daha ├Ânce tasarlad─▒─č─▒n─▒z hareketli sistemler veya mekanizmalar var m─▒ varsa a├ž─▒klay─▒n─▒z?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
            {
                orderNumber == 4 && <div>
                    <h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Yaz─▒l─▒m Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Yaz─▒l─▒m ekibi Rover arac─▒n─▒n otonom s├╝r├╝┼č, robot kol kontrol├╝, ├že┼čitli g├Âr├╝nt├╝ i┼čleme algoritmalar─▒ ile
                        farkl─▒ g├Ârevleri yerine getirilmesi ├╝zerine ├žal─▒┼čmaktad─▒r. Bunlar─▒n yan─▒nda bilim ekibi i├žin geli┼čtirilen
                        ├že┼čitli cihazlar─▒n yaz─▒l─▒mlar─▒ ile rover─▒n haberle┼čmesi de yaz─▒l─▒m ekibinin g├Ârevleri aras─▒ndad─▒r.
                    </p>
                    <Form.Group className='mb-3' controlId="validationCustom26">
                        <Form.Label>Hakim oldu─čunuz programlama dilleri ve teknolojilerini 5 ├╝zerinden puanlayarak yaz─▒n─▒z <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (├ľrnek:
                            Python 5/5, Java 4/5, ROS 4/5, Arduino 3/5)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom27">
                        <Form.Label>─░lgilendi─činiz konular <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (├ľr: Yapay zeka, Robotik, IoT, Oyun Programlama, G├Âr├╝nt├╝ ─░┼čleme vs.)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom28">
                        <Form.Label>├ťzerine en son ├žal─▒┼čt─▒─č─▒n─▒z yaz─▒l─▒m projesi nedir. Varsa k─▒saca bahsediniz.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
            {
                orderNumber == 5 && <div>
                    <h4 className="mb-3 pt-3" style={{ fontStyle: "italic" }}>Organizasyon Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Organizasyon Ekibi olarak di─čer ekiplerin ihtiya├žlar─▒n─▒n giderilmesini, tak─▒m i├ži ileti┼čim sa─člar. Ayn─▒ zamanda tak─▒m─▒n sosyal medya hesaplar─▒n─▒ y├Ânetir.
                    </p>
                    <Form.Group className='mb-3' controlId="validationCustom29">
                        <Form.Label>Kullanmay─▒ bildi─činiz bir tasar─▒m program─▒ var m─▒?<small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (├ľr: Canva, Photoshop, Illustrator) Varsa 5
                            ├╝zerinden puanlay─▒n─▒z. (├ľr: Canva 4/5, Photoshop 1/5 vs.
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom30">
                        <Form.Label>Sizin i├žin en b├╝y├╝k giri┼čim nedir, neden?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom31">
                        <Form.Label>G├Ân├╝ll├╝ olarak kat─▒ld─▒─č─▒n─▒z organizasyon veya ekipler var m─▒? Varsa bu ekipteki rol├╝n├╝z├╝ k─▒saca
                            a├ž─▒klay─▒n─▒z.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            L├╝tfen bu alan─▒ doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
        </div>
    )
}