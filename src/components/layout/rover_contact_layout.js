
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
                        `rover-basvuruları/${form[2].value}/${form[15].files[0].name}`
                    )
                    .put(form[15].files[0])
                    .on('state_changed',
                        (snapShot) => {
                            //takes a snap shot of the process as it is happening
                        }, (err) => {
                            //catches the errors
                        }, () => {
                            storage.ref('rover-basvuruları').child(`${form[2].value}/${form[15].files[0].name}`).getDownloadURL()
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
                                                        toast.error("Bir hata oluştu. Tekrar başvurun yada hata ile ilgili bilgiislem@kapsul.com adresine mail atınız.")
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
            <h4 className="mb-3 pt-3">Kişisel Bilgiler</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom01">
                    <Form.Label>Ad</Form.Label>
                    <Form.Control type="name" required />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom02">
                    <Form.Label>Soyad</Form.Label>
                    <Form.Control type="name" required />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
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
            <h4 className="mb-3 pt-3">İletişim Bilgileri</h4>
            <Row>
                <Form.Group as={Col} controlId="validationCustom03" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required maxLength="80" />
                    <Form.Control.Feedback type="invalid">
                        Lütfen bu alanı doldurunuz.
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
                        Lütfen bu alanı doldurunuz.
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
            <h4 className="mb-3 pt-3">Eğitim Bilgileri</h4>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom05">
                    <Form.Label>Üniversite</Form.Label>
                    <Form.Select onChange={(e) => setUniversityID(e.target.value)} aria-required="true" required>
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
                <Form.Group as={Col} controlId="validationCustom06">
                    <Form.Label>Fakülte</Form.Label>
                    <Form.Select onChange={(e) => setFacultyID(e.target.value)} aria-required="true" required>
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
            </Row>

            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom07">
                    <Form.Label>Bölüm</Form.Label>
                    <Form.Select aria-required="true" required >
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
                <Form.Group as={Col} controlId="validationCustom08">
                    <Form.Label>Sınıf</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        <option value="Hazırlık">Hazırlık</option>
                        <option value="1.Sınıf">1.Sınıf</option>
                        <option value="2.Sınıf">2.Sınıf</option>
                        <option value="3.Sınıf">3.Sınıf</option>
                        <option value="4.Sınıf">4.Sınıf</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <Form.Group as={Col} controlId="validationCustom09">
                    <Form.Label>Öğrenim Türü</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        <option value="1.Öğretim">1.Öğretim</option>
                        <option value="2.Öğretim">2.Öğretim</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} controlId="validationCustom10">
                    <Form.Label>İngilizce Seviyeniz</Form.Label>
                    <Form.Select aria-required="true" required >
                        <option value="">Seçiniz...</option>
                        <option value="A1">A1</option>
                        <option value="A2">A2</option>
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                        <option value="C1">C1</option>
                        <option value="C2">C2</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                        Lütfen birini seçiniz.
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
                <Form.Label>Size göre kendinizde öne çıkan özellikleriniz nelerdir?</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom12">
                <Form.Label>3 cümle ile takımımıza niçin katılmak istediğinizi açıklar mısınız?</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom13">
                <Form.Label>Daha önce veya aktif olarak üzerine çalıştığınız bir ekip veya bireysel projeniz var mı? Varsa projeyi
                    ve çalıştığınız konuyu kısaca açıklayınız.</Form.Label>
                <Form.Control type="name" required />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom14" className="mb-3">
                <Form.Label>Haftalık atölye çalışmasına kaç saat ayırabilirsiniz?</Form.Label>
                <Form.Select aria-required="true" required>
                    <option value="">Seçiniz...</option>
                    <option value="1-3">1-3</option>
                    <option value="3-5">3-5</option>
                    <option value="5-7">5-7</option>
                    <option value="7-9">7-9</option>
                    <option value="10+">10+</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId="validationCustom15">
                <Form.Label>LinkedIn hesabınız</Form.Label>
                <Form.Control placeholder="https://www.linkedin.com/in/example/" type="name" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Özgeçmişinizi Yükleyiniz <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(PDF Formatında)</small></Form.Label>
                <Form.Control required type="file" accept='.pdf' />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >
            <h4 className="mb-3 pt-3">Ekip Bilgileri</h4>
            <Form.Group controlId="validationCustom16" className="mb-3">
                <Form.Label>Başvuru Yapmak İstediğiniz Ekip:</Form.Label>
                <Form.Select onChange={(e) => { setOrderNumber(e.target.selectedIndex); resetAnswers() }} aria-required="true" required>
                    <option value="">Seçiniz...</option>
                    <option value="0">Bilim Ekibi</option>
                    <option value="1">Elektronik Ekibi</option>
                    <option value="2">Mekanik Ekibi</option>
                    <option value="4">Yazılım Ekibi</option>
                    <option value="3">Organizasyon Ekibi</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                    Lütfen birini seçiniz.
                </Form.Control.Feedback>
            </Form.Group>
            {
                orderNumber == 1 && <div><h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Bilim Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Bilim Ekibi alınan numunelerde kimyasal, biyolojik ve jeolojik analizler yapmak üzere roverın üzerine
                        kurulacak mini laboratuvar ile ilgilenir.</p>
                    <Form.Group className='mb-3' controlId="validationCustom17">
                        <Form.Label>Kullanmayı bildiğiniz laboratuvar ekipman ve cihazları nelerdir?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} type="name" name='1' required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom18" className="mb-3">
                        <Form.Label>Astrobiyoloji'ye ilginizi 5 üzerinden puanlayınız</Form.Label>
                        <Form.Select onChange={e => addAnswer(e)} aria-required="true" name='2' required>
                            <option value="">Seçiniz...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom19">
                        <Form.Label>Jeolojik haritalama üzerine kullandığınız bir program var mı? Varsa hangilerini kullandığınızı 5
                            üzerinden puanlayınız <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>((Ör: Arcgis 4/5, JMars: 3/5))</small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group></div>
            }
            {
                orderNumber == 2 && <div><h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Elektronik Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Elektronik Ekibi, Rover üzerindeki bütün elektronik sistemler, gömülü yazılımlar, haberleşme
                        sistemleri, motor entegrasyonları ve simülasyonlarını yapmaktadır. Elektronik ekibi olarak kartların
                        tasarımlarının tamamlanıp kullanılacak bölgedeki iyileştirmeler üzerinde çalışmaktadır. Aynı zamanda
                        bu kartların temel yazılımlarını yapılması görevler arasındadır.</p>
                    <Form.Group className='mb-3' controlId="validationCustom20">
                        <Form.Label>Kendinizi geliştirmek istediğiniz elektronik alan nedir ve neden?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom21">
                        <Form.Label>Kullandığınız bir elektronik design programı var mı? Varsa nelerdir ve bunları 5 üzerinden
                            puanlayınız <small style={{ fontStyle: "italic", color: "#7f8c8d" }}>(Proteus 4/5 vs.)</small>
                        </Form.Label>
                        <Form.Control  onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationCustom22" className="mb-3">
                        <Form.Label>C/C++ dillerine ne kadar hakimsiniz.</Form.Label>
                        <Form.Select onChange={e => addAnswer(e)} name='3' aria-required="true" required>
                            <option value="">Seçiniz...</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Lütfen birini seçiniz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom23">
                        <Form.Label>Daha önce robotik çalışmalarınız oldu mu. Oldu ise kısaca açıklayınız.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='4' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group></div>
            }
            {
                orderNumber == 3 && <div>
                    <h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Mekanik Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Mekanik Ekibi çalışma prensibi olarak yürür sistem, robot kol ve bilim laboratuvarı olmak üzere üç
                        ana dala ayrılır. Rover üzerinde kullanılacak bütün sistemlerin tasarımı, üretimi, analiz edilmesi ve
                        montaj işlemlerinin tümü mekanik ekibinin sorumluluğundadır..</p>
                    <Form.Group className='mb-3' controlId="validationCustom24">
                        <Form.Label>Kullanmayı bildiğiniz tasarım programları nelerdir. 5 üzerinden puanlayınız. <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Ör: Solid 4/5, Autocad
                            3/5 vs.)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom25">
                        <Form.Label>Daha önce tasarladığınız hareketli sistemler veya mekanizmalar var mı varsa açıklayınız?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
            {
                orderNumber == 4 && <div>
                    <h4 className="mb-1 pt-3" style={{ fontStyle: "italic" }}>Yazılım Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Yazılım ekibi Rover aracının otonom sürüş, robot kol kontrolü, çeşitli görüntü işleme algoritmaları ile
                        farklı görevleri yerine getirilmesi üzerine çalışmaktadır. Bunların yanında bilim ekibi için geliştirilen
                        çeşitli cihazların yazılımları ile roverın haberleşmesi de yazılım ekibinin görevleri arasındadır.
                    </p>
                    <Form.Group className='mb-3' controlId="validationCustom26">
                        <Form.Label>Hakim olduğunuz programlama dilleri ve teknolojilerini 5 üzerinden puanlayarak yazınız <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Örnek:
                            Python 5/5, Java 4/5, ROS 4/5, Arduino 3/5)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom27">
                        <Form.Label>İlgilendiğiniz konular <small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Ör: Yapay zeka, Robotik, IoT, Oyun Programlama, Görüntü İşleme vs.)
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom28">
                        <Form.Label>Üzerine en son çalıştığınız yazılım projesi nedir. Varsa kısaca bahsediniz.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
            {
                orderNumber == 5 && <div>
                    <h4 className="mb-3 pt-3" style={{ fontStyle: "italic" }}>Organizasyon Ekibi</h4>
                    <p style={{ fontStyle: "italic", color: "#7f8c8d" }} className="mb-4">Organizasyon Ekibi olarak diğer ekiplerin ihtiyaçlarının giderilmesini, takım içi iletişim sağlar. Aynı zamanda takımın sosyal medya hesaplarını yönetir.
                    </p>
                    <Form.Group className='mb-3' controlId="validationCustom29">
                        <Form.Label>Kullanmayı bildiğiniz bir tasarım programı var mı?<small style={{ fontStyle: "italic", color: "#7f8c8d" }}> (Ör: Canva, Photoshop, Illustrator) Varsa 5
                            üzerinden puanlayınız. (Ör: Canva 4/5, Photoshop 1/5 vs.
                        </small>
                        </Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='1' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom30">
                        <Form.Label>Sizin için en büyük girişim nedir, neden?</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='2' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className='mb-3' controlId="validationCustom31">
                        <Form.Label>Gönüllü olarak katıldığınız organizasyon veya ekipler var mı? Varsa bu ekipteki rolünüzü kısaca
                            açıklayınız.</Form.Label>
                        <Form.Control onChange={e => addAnswer(e)} name='3' type="name" required />
                        <Form.Control.Feedback type="invalid">
                            Lütfen bu alanı doldurunuz.
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            }
        </div>
    )
}