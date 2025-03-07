"use client";
import { Button } from "@chakra-ui/react";

import { ATPanel } from "components";
import MyModal from "components/atomic/modal";
import Overlay from "components/atomic/modal/overlay";
import { useState } from "react";

export default function Matches() {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(""); // Estado para armazenar o título
  const [selectedText, setSelectedText] = useState(""); // Estado para armazenar o texto

  function closeModal() {
    setIsOpen(false);
    setSelectedTitle(""); // Reseta o título ao fechar o modal
  }

  function openModal(title: string, text: string ) {
      setSelectedTitle(title); // Define o título com base no card clicado
      setSelectedText(text); // Define o texto com base no card clicado
      setIsOpen(true);
  }

  return (
    <>
      <ATPanel w={'100%'} h={'100%'} bg={'#FFFFFF'}>
        <Button
          onClick={() => openModal(
            "Teste titulo modal padrão",
            "Aqui está um teste para o texto que aparece no nosso novo modal padrão que devrá ser reutilizado em todo o nosso código.",
          )}
        >
          modal
        </Button>

        {/* Modal controlado pelo estado isOpen */}
        <MyModal 
            isOpen={isOpen} 
            onClose={closeModal} 
            title={selectedTitle} 
            text={selectedText}
            justifyContent="right"
        />

        {isOpen && <Overlay closeModal={closeModal} />}
      </ATPanel>
    </>
  );
}
