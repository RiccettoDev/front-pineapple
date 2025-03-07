import { Button } from "@chakra-ui/react";

interface OverlayProps {
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
  setModal: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
  setModalCreateMatches: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Overlay({ setOverlay, setModal, setModalCreateMatches }: OverlayProps) {

function closeModal() {
    setModal(false)
    setOverlay(false)
    setModalCreateMatches(false)
}
  
return (
    <Button
      position={"absolute"}
      w={'100%'}
      h={'90vh'}
      bg={'rgba(0, 0, 0, 0.7)'} // Adicionando transparência
      onClick={closeModal} // Fecha o overlay ao clicar
      _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }} // Efeito de hover
      zIndex={500}
    />
  );
}
