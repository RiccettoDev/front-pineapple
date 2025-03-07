import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface StepTwoProps {
    form: any;
}

interface gamePresenceProps {
    id: number,
    match_id: string,
    user_id: string,
    confirm: boolean,
    user: {
        avatar: string,
        name: string,
    }
}

export default function StepTwoModalMatches({ form }: StepTwoProps) {

    const {
        matchId,
        setStepOne,
        setStepTwo,
        closeModal
    } = form;

    const { user, me } = useAuth();
    const [gamePresence, setGamePresence] = useState<gamePresenceProps[]>([])

    useEffect(() => {
        const fetchGamePresenceData = async () => {
          if (!user?.id || !matchId) return;
    
          try {
            const response = await api.get(`/game-presences/match-confirm/${matchId}`, {
              headers: {
                Authorization: `Bearer ${user?.access_token}`,
              },
            });
    
            console.log(response.data);
            setGamePresence(response.data.records); // Corrigido aqui
    
          } catch (error) {
            console.log('Erro ao carregar lista de jogadores com presença confirmada');
          }
        };
    
        fetchGamePresenceData();
    }, [user?.access_token, matchId]); // Adicionado matchId para garantir que busca os dados corretos
    
    function returnModal() {
        setStepOne(true)
        setStepTwo(false)
    }

    return (
        <Flex
            position={"absolute"}
            w={{ base: '90%', sm: '90%' }}
            maxH={{base: '90%', sm: '100%'}}
            bg={'#0c0c32'}
            zIndex={600}
            rounded={"2xl"}
            direction={"column"}
            p={6}
        >

            <Flex w={'100%'} direction={"column"}>
                <Text
                    mt={'1em'} 
                    textAlign={"center"} 
                    fontSize={"20px"} 
                    fontWeight={"extrabold"}
                >
                    Jogadores Confirmados para a partida:
                </Text>   
                <Box w={'100%'} h={'1px'} bg={'#FFFFFF'} mt={'2em'} mb={'2em'} />
            </Flex>

            <Flex w={'100%'} border={'1px solid #b9fa3c'} rounded={'8px'} mb={'2em'} pb={4} justifyContent={"center"} alignItems={"center"}>
                <Text
                    mt={'1em'} 
                    textAlign={"center"} 
                    fontSize={"20px"} 
                    fontWeight={"extrabold"}
                    color={'#FFFFFF'}
                >
                    Quantidade presente: <span style={{color: '#b9fa3c'}}>{gamePresence.length}</span>
                </Text>
            </Flex>


            {gamePresence.length > 0 ? ( 
                gamePresence.map((player, index) => (
                    <Flex 
                        key={player.id} 
                        w={'100%'}
                        alignItems={"normal"}
                        mt={'1em'}
                        gap={4}
                        pl={8}
                    >
                        <Text
                            mt={'2em'} 
                            textAlign={"center"} 
                            fontSize={"20px"} 
                            fontWeight={"extrabold"}
                        >
                            {index + 1}
                        </Text>

                        <Box w={'100px'} h={'100px'} rounded={"full"} bg={'#b9fa3c'}>
                            <Image
                                src={player.user.avatar}
                                rounded={"full"}
                                alt="avatar"
                                width="100%"
                                height="100%"
                                objectFit="cover" // Garante que a imagem preencha o contêiner sem distorcer
                            />
                        </Box>
                        
                        <Text
                            mt={'2em'} 
                            textAlign={"center"} 
                            fontSize={"20px"} 
                            fontWeight={"extrabold"}
                        >
                            {player.user.name}
                        </Text>
                    </Flex>
                ))
            ) : ( 
                <Text
                    mt={'1em'} 
                    textAlign={"center"} 
                    fontSize={"13px"} 
                    fontWeight={"normal"}
                >
                    Não existe jogadores confirmados para esta partida até o momento.
                </Text>   
            )}

            <Flex w={'100%'} justifyContent={"center"} mb={'3em'} >
                <Button
                    w={'100%'}
                    mt={'2em'}
                    bg={'#b9fa3c'}
                    onClick={() => returnModal()}
                >
                    Voltar
                </Button>
            </Flex>
        </Flex>
    )
}