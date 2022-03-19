import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { Button, Input, Label, TextArea } from "../Inputs";
import Modal from "../Modal";
import { ModalBody, ModalHeader, ModalTitle } from "../Modal";
import { FloatingButton } from "./styles";
import { v4 as uuidv4 } from "uuid";
import api from "../../config/api";
export default function FloatingDonateButton() {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(20);
  const [message, setMessage] = useState(null);
  return (
    <>
      <Modal size="sm" show={show} onClose={() => setShow(false)}>
        <ModalHeader>
          <ModalTitle>¡Doná con MercadoPago!</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <TextArea
            placeholder={"Escribe tu Dedicatoria aquí (opcional)"}
            onChange={(e) => setMessage(e?.target?.value)}
          />
          <Label>Introduce tu monto a donar</Label>
          <Input
            type={"number"}
            defaultValue={20}
            onChange={(e) => {
              e.target.value <= 300000 && e?.target?.value >= 15
                ? setValue(e.target.value)
                : e.target.value >= 300000
                ? setValue(300000)
                : e.target.value >= 15
                ? setValue(e?.target?.value)
                : e?.target?.value < 15
                ? setValue(15)
                : setValue(e?.target?.value);
            }}
          />
          <Button
            onClick={async () => {
              let uuid = uuidv4();
              const { data: donar } = await api.post(
                `/payment/new?uuid=${uuid}&value=${value}&message=${
                  message ? message.toString() : null
                }`
              );
              donar?.urlId && window.location.replace(donar?.urlId);
            }}
            style={{
              alignSelf: "end",
              margin: "1rem 0 0 0",
              background: "#009ee3",
            }}
          >
            <b>Donar</b>
          </Button>
        </ModalBody>
      </Modal>
      <FloatingButton
        onClick={() => {
          setShow(true);
        }}
      >
        <FaDollarSign />
      </FloatingButton>
    </>
  );
}
