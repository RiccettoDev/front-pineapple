"use client";
import { Flex, Text } from "@chakra-ui/react";
import { ATPanel } from "components";
import { useAuth } from "contexts/auth.context";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import MyModal from "components/atomic/modal";
import SelectGroup from "components/selectGroup";
import api from "services/api";
import ModalMatchesTeam from "./components/modalMatchesTeam";
import Overlay from "./components/overlay/Overlay";

interface EventProps {
  id: string;
  title: string;
  date: string;
  rrule?: {
    freq: string;
    interval: number;
    byweekday: string;
  };
}

const INITIAL_VALUES = {
  id: '',
  name: '',
}

export default function Evaluations() {

  const { user, me } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [events, setEvents] = useState<EventProps[]>([]); // Estado para armazenar os eventos
  const [overlay, setOverlay] = useState(false)
  const [modalMatchTeam, setModalMatchTeam] = useState(false)  

  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedGroupId) {
        console.log('Nenhum grupo selecionado!');
        return; // Não faz a requisição se o grupo não estiver selecionado
      }
  
      try {
        const response = await api.get(`/matches/group/${selectedGroupId}`, {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        });

        console.log('AAAAAAAAAAqui: ', response);
  
        // Verifica se a chave "records" existe e é um array
        if (Array.isArray(response.data.records)) {
        
          const eventsData = response.data.records.map((match: any, index: number) => {
            console.log(`Partida ${index + 1}:`, match); // Loga cada item individualmente
        
            return {
              id: match.id,
              title: match.location, // Ajuste conforme a estrutura do evento
              date: match.date_time, // Ajuste conforme a estrutura do evento
            };
          });

          console.log("OOOOOUUUUUU: ", eventsData);
        
          setEvents(eventsData); // Atualiza o estado com os eventos recebidos
        } else {
          console.error('A chave "records" não é um array válido', response.data.records);
        }
        
      } catch (error: any) {
        console.error('Erro ao carregar eventos:', error); // Exibe o erro completo
      }
    };
  
    fetchEvents();
  }, [user?.access_token, selectedGroupId]);  // O efeito depende de selectedGroupId e user.access_token

  function openModalMatch(id: string) {
    setModalMatchTeam(true)
    setOverlay(true)
    setSelectedEvent(id)
  }
  
  return (
    <>
      <ATPanel
        w={"100%"}
        h={"100%"}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"start"}
        alignItems={{base:'center', sm:"start"}}
        overflowX={"hidden"}
      >
        <Flex w={'100%'} justifyContent={"space-between"} direction={{base:"column", md:"row"}}>
          
          <SelectGroup
              selectedGroupId={selectedGroupId}
              setSelectedGroupId={setSelectedGroupId}
          />

        </Flex>


        <Text mt={'1em'} mb={'1em'} ml={'1em'} fontWeight={"extrabold"} fontSize={"2xl"} color={'#b9fa3c'}>
          Partidas:
        </Text>

        <Flex w={'100%'} wrap={"wrap"} gap={6}>
          {events && events.length > 0 ? (
            // Ordena os eventos por data antes de mapeá-los
            //events
              //.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) -----> assim para ordenar no mais antigo 
            events // assim para ordenar do mais rescente
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((matches, index) => (
                <Flex 
                  key={index}
                  as={'button'}
                  cursor={"pointer"}
                  _hover={{transform:'scale(1.08)'}} 
                  w={{base:'46%', md:'25%'}} 
                  bg={'#0c0c32'}
                  justifyContent={"center"}
                  alignItems={"center"}
                  p={4}
                  direction={"column"}
                  rounded={'20px'}
                  onClick={() => openModalMatch(matches.id)}
                >
                  <Text fontSize={"lg"} color={"#FFFFFF"} mt={4}>
                    {matches.title}
                  </Text>
                  <Text fontSize={"lg"} color={"#FFFFFF"} mt={4}>
                    {dayjs(matches.date).format('DD/MM/YYYY')}
                  </Text>
                </Flex>
              ))
          ) : (
            <Flex>
              {/* Mensagem ou componente para quando não há eventos */}
              <Text fontSize={"lg"} color={"#FFFFFF"} mt={4}>
                Não existem eventos...
              </Text>
            </Flex>
          )}
        </Flex>
          
          {modalMatchTeam && 
            <MyModal 
              isOpen={modalMatchTeam} 
              onClose={() => {
                setModalMatchTeam(false);
                setOverlay(false);
              }} 
              title={"Escalação"} 
              justifyContent="right"
              size="full"
            >
              <ModalMatchesTeam 
                setModalMatchTeam={setModalMatchTeam} 
                setOverlay={setOverlay} 
                selectedEvent={selectedEvent}
                selectedGroupId={selectedGroupId}
              />
            </MyModal>
          }

      </ATPanel>
      {overlay && <Overlay 
        setModalMatchTeam={setModalMatchTeam} 
        setOverlay={setOverlay} 
      />}
    </>
  );
}