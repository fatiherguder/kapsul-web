import React from 'react';
import { Form, Button } from "react-bootstrap";
import "./lighting_text_area.css"

export default function LightingTextArea({setFadeValidation}) {


    const KVKKText = "Kişisel Verilerin Korunması Kanunu gereğince, yukarıda belirttiğim/tarafımdan vakfınıza açıklanmış, kişisel verilerimizin vakfınız tarafından işlenmesine ilişkin olarak tarafıma açıklanan ve gösterilen işbu metni,okuduğumu, incelediğimi, değerlendirdiğimi, bilerek, anlayarak kabul ettiğimi; kişisel bilgilerimin vakfın amaç ve faaliyetlerini doğrultusunda paylaşılmasına herhangi bir itirazım olmadığını beyan ile bu bilgilerin her türlü paylaşım mecralarında açıklanmasına özgür iradem sonucu bu *Bilgilendirme ve Muvafakatname'de belirtilen amaç ve nedenlerle, KVKK'da tanımı yapılmış olan ve yukarıda da gerek içeriği gerekse toplanma yeri ve yöntemi belirtilen kişisel verilerimin KVKK'nda tanımlanan kapsamda işlenmesine muvafakat ettiğimi kabul beyan ve taahhüt ederim.";


    return (
        <div>
            <h4 className="mb-2 pt-3">Bilgilendirme ve Muvafakatname</h4>
            <p className="mb-4 soft">{KVKKText}</p>
            <div>
                <Form.Group>
                    <Form.Check
                        required
                        className="soft"
                        label={'Kişisel Verilerin Korunumuna İlişkin Muvafakatnameyi okudum, anladım ve kabul ediyorum'}
                        feedback="Göndermeden önce kabul etmeniz gerekmektedir."
                        feedbackType="invalid"
                    />
                </Form.Group>
                <Button onClick={e => setFadeValidation(true)} type="submit" style={{backgroundColor:"#216fb6"}} className="my-3 px-4" size="lg">Başvuru Yap!</Button>
            </div>
            <p className="mb-4 soft" style={{ fontStyle: "italic"}}>Başvuru sisteminde karşılaştığınız hata ve sorunlarla ilgili <strong>bilgiislem@kapsul.com</strong> e-posta adresi üzerinden iletişime geçebilirsiniz.</p>
        </div>
    )
}
