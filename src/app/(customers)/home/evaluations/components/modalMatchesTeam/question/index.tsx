import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface ModalProps {
    closeModal: () => void;
    setQuestion: React.Dispatch<React.SetStateAction<boolean>>;
    setStepOne: React.Dispatch<React.SetStateAction<boolean>>;
    playerConfirm: sortPlayersProps[]; // Agora é um array
    selectedEvent: string;
}

interface sortPlayersProps {
    id: string,
    name: string,
    avatar: string,
}

interface PlayerProps {
    user_name: string
    user_id: string;
    attack: number;
    defense: number;
    dribbling: number;
    heading: number;
    passing: number;
    shooting: number;
    speed: number;
    vigor: number;
}

export default function Question({ closeModal, setQuestion, setStepOne, playerConfirm, selectedEvent }: ModalProps) {

    const toast = useToast();
    const { user, me } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [player, setPlayer] = useState<PlayerProps[]>([]);
    const [vigor, setVigor] = useState(0);
    const [speed, setSpeed] = useState(0);
    const [dribbling, setDribbling] = useState(0);
    const [shooting, setShooting] = useState(0);
    const [attack, setAttack] = useState(0);
    const [defense, setDefense] = useState(0);
    const [passing, setPassing] = useState(0);
    const [heading, setHeading] = useState(0);

    function returnModal() {
        setStepOne(true)
        setQuestion(false)
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Mapeia cada jogador em playerConfirm para fazer a requisição à API
                const attributesResponses = await Promise.all(
                    playerConfirm.map(async (player) => {
                        const response = await api.get(`/player-attributes/${player.id}`, {
                            headers: {
                                Authorization: `Bearer ${user?.access_token}`,
                            },
                        });
    
                        console.log(`Resposta do jogador ${player.id}:`, response.data);
    
                        // Retorna os dados do jogador
                        return response.data; // Ajuste aqui: retorne response.data diretamente
                    })
                );
    
                console.log("Players armazenados no estado:", attributesResponses);
                setPlayer(attributesResponses); // Ajuste aqui: armazena os dados diretamente
            } catch (error) {
                console.error("Erro ao carregar os dados dos usuários:", error);
            }
        };
    
        fetchUser();
    }, [playerConfirm, user]);
    

    async function FinallyEvaluation() {
        setIsLoading(true);
        try {
            console.log("Estado atual do player:", player); // Verifica os dados no estado
    
            if (player.length === 0) {
                console.error("Nenhum jogador carregado! Aguardando atualização do estado.");
                setIsLoading(false);
                return;
            }
    
            // Faz a requisição para obter as avaliações dos jogadores
            const responses = await Promise.all(
                playerConfirm.map(async (player) => {
                    const response = await api.get(
                        `/player-evaluations/evaluator/${player.id}/match/${selectedEvent}`,
                        {
                            headers: {
                                Authorization: `Bearer ${user?.access_token}`,
                            },
                        }
                    );
                    return response.data; // Retorna os dados da avaliação
                })
            );
    
            console.log("Respostas da API:", responses);
    
            // Itera sobre os jogadores para calcular as médias e fazer a requisição PUT
            await Promise.all(
                player.map(async (playerData, index) => {
                    const apiData = responses[index]; // Dados da API para o jogador atual
    
                    // Verifica se os dados da API e do estado existem
                    if (playerData && apiData) {
                        const averageAttributes = {
                            vigor: (playerData.vigor + apiData.vigor) / 2,
                            speed: (playerData.speed + apiData.speed) / 2,
                            dribbling: (playerData.dribbling + apiData.dribbling) / 2,
                            shooting: (playerData.shooting + apiData.shooting) / 2,
                            attack: (playerData.attack + apiData.attack) / 2,
                            defense: (playerData.defense + apiData.defense) / 2,
                            passing: (playerData.passing + apiData.passing) / 2,
                            heading: (playerData.heading + apiData.heading) / 2,
                        };
    
                        // Exibe o log com o id, nome e médias dos atributos
                        console.log(`Jogador: ${playerData.user_name} (ID: ${playerData.user_id})`);
                        console.log("Médias dos atributos:", averageAttributes);
    
                        // Faz a requisição PUT para atualizar os atributos do jogador
                        try {
                            const payload = {
                                user_id: playerData.user_id,
                                ...averageAttributes, // Inclui todas as médias no payload
                            };
    
                            const updateResponse = await api.put(
                                `/player-attributes/${playerData.user_id}`,
                                payload,
                                {
                                    headers: {
                                        Authorization: `Bearer ${user?.access_token}`,
                                    },
                                }
                            );
    
                            console.log(`Atualização do jogador ${playerData.user_id} realizada com sucesso:`, updateResponse.data);
                        } catch (error) {
                            console.error(`Erro ao atualizar o jogador ${playerData.user_id}:`, error);
                        }
                    } else {
                        console.error(`Dados incompletos para o jogador ${playerData?.user_id}`);
                    }
                })
            );
    
            toast({
                title: "Avaliação cadastrada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } catch (error) {
            console.error("Erro ao avaliar jogador:", error);
            toast({
                title: "Erro ao cadastrar avaliação!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <Flex 
                w={{base:'90%', md:'100%'}} 
                h={'70%'} 
                direction={"column"} 
                p={4} 
                bg={'#0c0c32'} 
                zIndex={6000} 
                rounded={'20px'} 
                position={"absolute"}
                overflowY={"scroll"}
                overflowX={"hidden"}
            >
                <Flex w={'100%'} direction={"column"}>
                    <Flex w={'100%'} justifyContent={"center"}>
                        <Text
                            fontSize={"2xl"}
                            color={'#FFFFFF'}
                        >
                            Tem certeza que deseja finalizar as avaliações?
                        </Text> 
                    </Flex>
                    <Flex w={'100%'} justifyContent={"center"}>
                        <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'}/>
                    </Flex>
                    <Flex w={'100%'} justifyContent={"space-between"} mt={'2em'} p={8}>
                        <Button
                            onClick={FinallyEvaluation}
                            isLoading={isLoading} // Desabilita o botão durante o carregamento
                            loadingText="Avaliando..."
                        >
                            Sim
                        </Button>
                    
                        <Button
                            bg={'#b9fa3c'}
                            onClick={() => returnModal()}
                        >
                            Não
                        </Button>
                    </Flex>
                </Flex>
            </Flex>   
        </>
    )
}