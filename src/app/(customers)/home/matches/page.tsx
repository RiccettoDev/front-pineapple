"use client"
import { Box, Button, Flex } from '@chakra-ui/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule'; // Importando o plugin rrule
import { ATPanel } from "components";
import MyModal from 'components/atomic/modal';
import Overlay from 'components/atomic/modal/overlay';
import SelectGroup from 'components/selectGroup';
import { useAuth } from 'contexts/auth.context';
import { useEffect, useState } from 'react';
import api from 'services/api';
import ModalCreateMatches from './components/modalCreateMatches';
import ModalMatches from './components/modalMatches/ModalMatches';

interface EventProps {
  title: string;
  date: string;
  rrule?: {
    freq: string;
    interval: number;
    byweekday: string;
  };
  maximum_players: number,
  minimum_players: number,
}

export default function Matches() {

  const { user, me } = useAuth();
  const [overlay, setOverlay] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalCreateMatches, setModalCreateMatches] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [events, setEvents] = useState<EventProps[]>([]); // Estado para armazenar os eventos
  const [matchId, setMatchId] = useState("");

  const [isOpen, setIsOpen] = useState(false);

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
  
  // Função para lidar com o clique no evento
  const handleEventClick = (info: any) => {
    setOverlay(true); // Abre o overlay
    setModal(true)
    setSelectedEvent(info.event); // Armazenando o evento selecionado

    console.log('ID da partida clicada: ', info.event.id);
    setMatchId(info.event.id)
  };

  const handleSelectGroup = (groupId: string) => {
    console.log("ID do grupo selecionado:", groupId);
    setSelectedGroupId(groupId);
  };

  const openModalCreateMatches = () => {
    setModalCreateMatches(true);
    setOverlay(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
      setIsOpen(true);
  }

  // Função para personalizar o evento como um botão
  const renderEventContent = (eventInfo: any) => {
    
    return (
      <Flex w={"100%"} h={"100%"} mb={"1em"}>
        <Button bg={"#b9fa3c"} color={"#0c0c32"}>
          {eventInfo.event.title}
        </Button>
      </Flex>
    );
  };  
  

  return (
    <>
      <ATPanel
        overflowX={'hidden'}
        w={"100%"}
        h={"100vh"}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        p={4}
        pb={'4em'}
      >
        <Flex
          w={'100%'}
          p={8}
          direction={{base:'column', sm:'row'}}
        >
          <SelectGroup
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
          />

          {user.role === 9 || user.role === 'admin' && (
            <Flex w={'100%'} justifyContent={'end'}>
              <Button
                bg={"#b9fa3c"} 
                fontWeight={'bold'} 
                onClick={() => openModal()}
              >
                Criar
              </Button>
            </Flex>
          )}
        </Flex>

        <Box w={{ base: "100%", sm: '90%' }} h={'80%'} maxWidth="1200px" mt={'2em'}>
          <FullCalendar
            plugins={[dayGridPlugin, rrulePlugin]}
            initialView="dayGridMonth"
            events={events}  // Passando os eventos para o calendário
            eventContent={renderEventContent}
            eventColor="#b9fa3c"
            eventTextColor="white"
            headerToolbar={{
              left: 'prev,next',
              center: 'title',
              right: '',
            }}
            height="100%" // Ajusta a altura do FullCalendar
            contentHeight="100%" // Ajusta a altura do conteúdo
            eventBorderColor='#0c0c32'
            eventBackgroundColor='#0c0c32'
            eventClick={handleEventClick} // Abre o overlay ao clicar no evento
          />
        </Box>

        {/* Renderiza o Overlay condicionalmente */}
        {modal && (
          <MyModal 
            isOpen={modal} 
            onClose={() => {
              setModal(false);
              setOverlay(false);
            }} 
            title={"Detalhes da Partida"} 
            justifyContent="right"
            size='full'
          >
            <ModalMatches 
              setModal={setModal} 
              setOverlay={setOverlay} 
              selectedEvent={selectedEvent} 
              matchId={matchId} 
            />
          </MyModal>
        )}

        {/* Modal controlado pelo estado isOpen */}
        <MyModal 
            isOpen={isOpen} 
            onClose={closeModal} 
            title={"Cadastrar nova partida"} 
            justifyContent="right"
            size='full'
        >
          <ModalCreateMatches 
            setModal={setModalCreateMatches} 
            setOverlay={setOverlay} 
            group_id={selectedGroupId}
            onClose={closeModal} // Passando a função onClose
          />
        </MyModal>

        {isOpen && <Overlay closeModal={closeModal} />}
      </ATPanel>
    </>
  );
}
