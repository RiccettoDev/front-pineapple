import { Button } from "@chakra-ui/react";

interface OverlayProps {
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
  setModalMatchTeam: React.Dispatch<React.SetStateAction<boolean>>;
  setModalCreateTeam: React.Dispatch<React.SetStateAction<boolean>>;
  setModalExistingTeam: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Overlay({ setOverlay, setModalMatchTeam, setModalCreateTeam, setModalExistingTeam }: OverlayProps) {

function closeModal() {
  setModalMatchTeam(false)
  setModalCreateTeam(false)
  setModalExistingTeam(false)
    setOverlay(false)
}
  
return (
    <Button
      position={"absolute"}
      w={{base:'100%', sm:'87.5vw'}}
      h={'90vh'}
      bg={'rgba(0, 0, 0, 0.7)'} // Adicionando transparência
      onClick={closeModal} // Fecha o overlay ao clicar
      _hover={{ bg: 'rgba(0, 0, 0, 0.8)' }} // Efeito de hover
      zIndex={500}
      overflowX={"hidden"}
    />
  );
}
