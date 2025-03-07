import { Button, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface StepOneProps {
    form: any;
}

interface MatchProps {
    id: string;
    group_id: string;
    date_time: string;
    location: string;
    status: string,
    maximum_players: number,
    minimum_players: number,
}

export default function StepOneModalMatches({ form }: StepOneProps) {

    const { user, me } = useAuth();
    const [match, setMatch] = useState<MatchProps>();
    
    useEffect(() => {
        const fetchUserData = async () => {
            
          try {
            const response = await api.get(`/matches/${matchId}`, {
              headers: {
                Authorization: `Bearer ${user?.access_token}`, // Adiciona o token no cabeçalho Authorization
              },
            });
            
            console.log('Data:',response.data);
            
            setMatch(response.data);
            
          } catch (error) {
            console.log('Erro ao carregar partida');
          }
        };
    
        fetchUserData();
      }, [me, user?.access_token]); // Adicionando user?.access_token para garantir a dependência do token

    const {
        closeModal,
        selectedEvent,
        eventDate,
        confirm,
        cancel,
        setStepOne,
        setStepTwo,
        matchId
    } = form;
    
    function showPlayers() {
        setStepOne(false)
        setStepTwo(true)
    }

    return (
        <Flex
            position={"absolute"}
            w={{ base: '90%', md: '75%' }}
            h={{base: 'auto', md: '60%'}}
            bg={'#0c0c32'}
            zIndex={600}
            rounded={"2xl"}
            direction={"column"}
            p={4}
            >
            <Flex p={2} gap={4} w={'100%'} justifyContent={"center"} direction={{base:'column', sm:'row'}}>
                <Flex gap={2}>
                    <Text color="#b9fa3c" fontSize={"20px"} fontWeight={"extrabold"}>Evento:</Text>
                    <Text color="white" fontSize={"20px"} fontWeight={"extrabold"}>{selectedEvent?.title}</Text>
                </Flex>
                <Flex gap={2}>
                    <Text color="#b9fa3c" fontSize={"20px"} fontWeight={"extrabold"}>Data:</Text> {/* Exibe a data do evento */}
                    <Text color="white" fontSize={"20px"} fontWeight={"extrabold"}>{eventDate}</Text> {/* Exibe a data do evento */}
                </Flex>
            </Flex>
            <Flex p={2} gap={4} w={'100%'} justifyContent={"center"} direction={{base:'column', sm:'row'}}>
                <Flex gap={2}>
                    <Text color="#b9fa3c" fontSize={"20px"} fontWeight={"extrabold"}>Máx de jogadores:</Text>
                    <Text color="white" fontSize={"20px"} fontWeight={"extrabold"}>{match?.maximum_players}</Text>
                </Flex>
                <Flex gap={2}>
                    <Text color="#b9fa3c" fontSize={"20px"} fontWeight={"extrabold"}>Mín de jogadores:</Text>
                    <Text color="white" fontSize={"20px"} fontWeight={"extrabold"}>{match?.minimum_players}</Text>
                </Flex>
            </Flex>
            <Flex p={2} direction={"column"} w={'100%'} justifyContent={"center"} gap={4} mt={'2em'}>
                <Flex w={'100%'} justifyContent={"center"} gap={2} direction={{base:'column', sm:'row'}}>
                    <Text textAlign={"center"} fontSize={"20px"} fontWeight={"extrabold"}>
                        Fala aew
                    </Text>
                    <Text textAlign={"center"} fontSize={"20px"} fontWeight={"extrabold"} color={'#b9fa3c'}>
                        peladeiro! 
                    </Text>
                    <Text textAlign={"center"} fontSize={"20px"} fontWeight={"extrabold"}>
                        Você foi convocado.
                    </Text>

                </Flex>
                <Text textAlign={"center"} fontSize={"20px"} fontWeight={"extrabold"}>
                    Bora confirmar sua presença...
                </Text>
            </Flex>
            <Flex w={'100%'} justifyContent={"center"} mt={'2em'} gap={10}>
                <Button bg={'#b9fa3c'} onClick={confirm}>SIM</Button>
                <Button bg={'#FFFFFF'} _hover={{background:'#b9fa3c'}} onClick={cancel}>NÃO</Button>
            </Flex>
            <Button
                mt={'4em'}
                bg={'#b9fa3c'}
                onClick={() => showPlayers()}
            >
                Ver lista de confirmados
            </Button>
        </Flex>
    )
}