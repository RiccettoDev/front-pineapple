import { useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useState } from "react";
import api from "services/api";
import StepOneModalMatches from "./stepOneModalMatches";
import StepTwoModalMatches from "./stepTwoModal";

interface ModalMatchesProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
  selectedEvent: any; // Prop para passar o evento selecionado
  matchId: string
}

export default function ModalMatches({ setModal, setOverlay, selectedEvent, matchId }: ModalMatchesProps) {
  
  const toast = useToast();
  const { user, me } = useAuth();
  const [stepOne, setStepOne] = useState(true);
  const [stepTwo, setStepTwo] = useState(false);

  function closeModal() {
    setModal(false);
    setOverlay(false);
  }

  function confirm() {
    try {

      const payload = {
        user_id: user.id,
        match_id: matchId,
        confirm: true
      }

      console.log('Payload:', payload);

      const response = api.post(`/game-presences`, payload, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        }
      })

      toast({
        title: "Sucesso!",
        description: "Isso aew peladeiro! Presença confirmada com sucesso!",
        status: "success",
        duration: 3500,
        isClosable: true,
        position: "top"
      });

      setModal(false);
      setOverlay(false);  
    } catch (error) {
      console.log('Erro ao tentar confirmar jogador na partida: ', error);
    }
  }
  
  function cancel() {
    try {

      const payload = {
        user_id: user.id,
        match_id: matchId,
        confirm: false
      }

      console.log('Payload:', payload);

      const response = api.post(`/game-presences`, payload, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        }
      })

      toast({
        title: "Ahhh!!!",
        description: "Tá de brincadeira que vai faltar, chinelinho hoje hein!",
        status: "error",
        duration: 3500,
        isClosable: true,
        position: "top"
    });

      setModal(false);
      setOverlay(false);  
    } catch (error) {
      console.log('Erro ao tentar confirmar jogador na partida: ', error);
    }
  }

  const eventDate = selectedEvent?.start ? selectedEvent.start.toLocaleDateString() : "Data não disponível"; // Formata a data do evento

  return (
    <>
      {stepOne && (
        <StepOneModalMatches form = {{
          closeModal,
          selectedEvent,
          eventDate,
          confirm,
          cancel,
          setStepOne,
          setStepTwo,
          matchId
        }}/>
      )}

      {stepTwo && (
        <StepTwoModalMatches form = {{
          matchId,
          setStepOne,
          setStepTwo,
          closeModal
        }}/>
      )}
    </>
  );
}
