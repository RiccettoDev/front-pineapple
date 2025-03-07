import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import FullCalendar from '@fullcalendar/react';
import rrulePlugin from '@fullcalendar/rrule'; // Importando o plugin rrule
import { MLInput } from "components";
import { useAuth } from "contexts/auth.context";
import { format } from "date-fns";
import { useFormik } from "formik";
import { useState } from "react";
import api from "services/api";
import * as yup from "yup";

interface ModalCreateMatchesProps {
    setModal: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
    group_id: string
    onClose: () => void; // Adicionando a prop onClose
  }

interface MatchesProps {
    group_id: string,
    date_time: string,
    location: string,
    status: string,
    maximum_players: number,
    minimum_players: number,
}

const INITIAL_VALUES: MatchesProps = {
    group_id: '',
    date_time: '',
    location: '',
    status: 'ativo',
    maximum_players: 0,
    minimum_players: 0,
  };


export default function ModalCreateMatches({ setModal, setOverlay, group_id, onClose }: ModalCreateMatchesProps) {

    const toast = useToast();
    const { user, me } = useAuth();
    const [fullCalendar, setFullCalendar] = useState(true)
    const [inputCreate, setInputCreate] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const onSubmit = async (values: MatchesProps) => {

        try {
            if (!selectedEvent) {
                console.error("Nenhum evento selecionado.");
                return;
            }
        
            // Pegando a data e formatando para "YYYY-MM-DD"
            const dateTime = selectedEvent.end 
            ? format(selectedEvent.end, "yyyy-MM-dd") 
            : format(selectedEvent.start, "yyyy-MM-dd");
            
            // Pegando a data de término corretamente
            //const dateTime = selectedEvent.end ? selectedEvent.end.toISOString() : selectedEvent.start?.toISOString(); 
    
            const payload = {
                group_id: group_id,
                date_time: dateTime,
                location: values.location,
                status: 'Ativo',
                maximum_players: Number(values.maximum_players),
                minimum_players: Number(values.minimum_players),
            }

            console.log('Payload: ', payload)

            // Enviar a requisição POST para a API com o token no cabeçalho
            const response = await api.post(
                `/matches`,
                payload,
                {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`, // Adiciona o token no cabeçalho Authorization
                },
                }
            );

            toast({
                title: "Cadastrado evento com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
              });

              onClose(); // Fechar o modal após o sucesso

        } catch (error) {
            console.log('não foi possivel cadastrar o evento: ', error);
        }
    }

    const {
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
        values,
      } = useFormik({
        initialValues: INITIAL_VALUES,
        validationSchema,
        onSubmit,
      });

    const events = [
        {
          title: '+ Add', 
          date: '2025-01-01', 
          rrule: {
            freq: 'daily',     // Frequência semanal
            interval: 1,        // Intervalo de uma semana
          }
        },
    ];

    function addEvent(eventInfo: any) {
        setFullCalendar(false)
        setInputCreate(true)
        setSelectedEvent(eventInfo.event); // Armazenando o evento selecionado

    }

    // Função para personalizar o evento como um botão
    const renderEventContent = (eventInfo: any) => {
        return (
            <Flex w={'100%'} h={'100%'} mb={'1em'}>
                <Button

                    bg={'#b9fa3c'}
                    color={'#0c0c32'}
                    onClick={() => addEvent(eventInfo)}
                >
                    {eventInfo.event.title}
                </Button>
            </Flex>
        );
    };

    // Função para lidar com o clique no evento
  const handleEventClick = (info: any) => {
    setOverlay(true); // Abre o overlay
    setModal(true)
  };

  function closeModal() {
    setModal(false)
    setOverlay(false)
  }

  function changeModal() {
    setInputCreate(false)
    setFullCalendar(true)
  }

    return (
        <Flex w={'100%'} p={{base:0, md:8}} mt={'-4em'}>
            {fullCalendar && (
                <Box w={{ base: "100%", sm: '100%' }} h={'500px'} maxWidth="1200px" mt={'2em'} overflowY={'auto'}>
                    <FullCalendar
                        plugins={[dayGridPlugin, rrulePlugin]}
                        initialView="dayGridMonth"
                        events={events}
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
            )}

            {inputCreate && (
                <Flex
                    w={'100%'}
                    justifyContent={"center"}
                    alignItems={"center"}
                    direction={"column"}
                    mt={'2em'}
                >
                    <MLInput
                        mb={'0.5em'}
                        name="location"
                        label="Local da partida"
                        placeholder="Insira o local da partida"
                        isRequired={true}
                        value={values.location}
                        w={"100%"}
                        onChange={(e) => setFieldValue("location", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.location && errors.location}
                    />
                    
                    <Box mt={'2em'} w={'100%'}>
                        <MLInput
                            name="maximum_players"
                            label="Número máximo de jogadores na partida"
                            placeholder="Insira o número de jogadores da partida"
                            isRequired={true}
                            value={values.maximum_players}
                            w={"100%"}
                            onChange={(e) => setFieldValue("maximum_players", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.maximum_players && errors.maximum_players}
                        />
                    </Box>
                    
                    <Box mt={'2em'} w={'100%'}>
                        <MLInput
                            name="minimum_players"
                            label="Número mínimo de jogadores na partida"
                            placeholder="Insira o número mínimo de jogadores na partida"
                            isRequired={true}
                            value={values.minimum_players}
                            w={"100%"}
                            onChange={(e) => setFieldValue("minimum_players", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.minimum_players && errors.minimum_players}
                        />
                    </Box>

                    <Flex w={'100%'} justifyContent={"space-between"} mt={'3em'}>
                        <Button 
                            bg={'none'} 
                            _hover={{opacity:'50%'}} 
                            onClick={() => changeModal()}
                        >
                            <Text
                                fontSize={"14px"}
                                fontWeight={"normal"}
                                color={'#b9fa3c'}
                                >
                                Voltar
                            </Text>

                        </Button>
                        
                        <Button 
                            bg={'#b9fa3c'}
                            onClick={() => handleSubmit()}
                        >
                            <Text
                                fontSize={"14px"}
                                fontWeight={"extrabold"}
                                color={'#0c0c32'}
                                >
                                Salvar
                            </Text>

                        </Button>
                    </Flex>
                </Flex>
            )}
        </Flex>
    )
}

const validationSchema = yup.object({
    location: yup.string().required("Nome do evento é obrigatório"),
    maximum_players: yup.string().required("Número maximo é obrigatório"),
    minimum_players: yup.string().required("Número mínimo é obrigatório"),
  });