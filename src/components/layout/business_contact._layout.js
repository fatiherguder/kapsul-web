import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Row, Col, Form } from "react-bootstrap";
import LightingTextArea from './lighting_text_area';
import "./business_contact_layout.css"
import axios from "axios"
import { storage } from '../../firebase';

export default function BusinessContactLayout({ setOpen, fileFolder, URL }) {

    const [fadeValidated, setfadeValidated] = useState(false)
    const [validated, setValidated] = useState(false);

    const url = URL;
    console.log(fileFolder)

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
                        `${fileFolder}/${form[4].value}/${form[6].files[0].name}`
                    )
                    .put(form[6].files[0])
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
                            storage.ref(`${fileFolder}`).child(`${form[4].value}/${form[6].files[0].name}`).getDownloadURL()
                                .then(fireBaseUrl => {
                                    if (fireBaseUrl != null) {
                                        var applyData = {
                                            "name": form[0].value,
                                            "surname": form[1].value,
                                            "email": form[2].value,
                                            "phone": form[3].value,
                                            "projectName": form[4].value,
                                            "projectSummary": form[5].value,
                                            "file": fireBaseUrl,
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
        <div className="form-container p-4">
            <ToastContainer />
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <BusinessField />
                <LightingTextArea setFadeValidation={setfadeValidated} />
            </Form>
        </div>
    )
}

const BusinessField = () => {

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
            <Form.Group as={Col} controlId="validationCustom03" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" required maxLength="80" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom04" className="mb-3">
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
            <h4 className="mb-3 pt-3">Proje Bilgiler</h4>
            <Form.Group controlId="validationCustom05" className="mb-3">
                <Form.Label>Proje Adı</Form.Label>
                <Form.Control type="name" required maxLength="50" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1" className="mb-3">
                <Form.Label>Proje Özeti</Form.Label>
                <Form.Control required as="textarea" rows={3} />
                <Form.Control.Feedback type="invalid">
                    Lütfen bu alanı doldurunuz.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Proje Dosyası</Form.Label>
                <Form.Control required type="file" />
                <Form.Control.Feedback type="invalid">
                    Lütfen bir dosya yükleyin.
                </Form.Control.Feedback>
            </Form.Group >
        </div>
    )
}