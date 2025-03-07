import { Box, Button, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text, useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";


interface ModalProps {
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
    setModalMatchTeam: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEvent: string;
    selectedGroupId: string;
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

interface sortPlayersProps {
    id: string,
    name: string,
    avatar: string,
}

interface TeamProps {
    id: number,
    group_id: string,
    name: string,
    victories: number,
    defeats: number,
    goals_scored: number,
    goals_against: number
}

interface PlayerMatchProps {
    match_id: string,
    user_id: string,
    team_id: number,
}

export default function ModalMatchesTeam({ setModalMatchTeam, setOverlay, selectedEvent, selectedGroupId }: ModalProps) {
    
    const { user, me } = useAuth();
    const toast = useToast();
    const [gamePresence, setGamePresence] = useState<gamePresenceProps[]>([]);
    const [sortPlayers, setSortPlayers] = useState<sortPlayersProps[][]>([]);
    const [stepOneTeams, setStepOneTeams] = useState(true);
    const [stepTwoTeams, setStepTworTeams] = useState(false);
    const [stepThree, setStepThree] = useState(false);
    const [contTeams, setContTeams] = useState(0);
    const [teams, setTeams] = useState<TeamProps[]>([]);
    const [teamsConfirm, setTeamsConfirm] = useState<TeamProps[]>([]);
    const [playerConfirm, setPlayersConfirm] = useState<sortPlayersProps[]>([]);
    const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchUserData = async () => {
            console.log('ID do Grupo: ', selectedGroupId);
            
            try {
                const response = await api.get(`/teams/group/${selectedGroupId}`, {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                });
    
                console.log('Times: ', response.data.records);
    
                // Filtrando times distintos
                const uniqueTeams = response.data.records.reduce((acc: TeamProps[], team: TeamProps) => {
                    if (!acc.find(t => t.id === team.id)) {
                        acc.push(team);
                    }
                    return acc;
                }, []);
    
                setTeams(uniqueTeams);
    
                const responseTeamConfirm = await api.get(`/player-matches/match/${selectedEvent}`, {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                });
    
                console.log('===========================');
                console.log('Times escalados: ', responseTeamConfirm.data);
                console.log('===========================');
    
                setTeamsConfirm(responseTeamConfirm.data.teams);
                setPlayersConfirm(responseTeamConfirm.data.users);
                
            } catch (error) {
                console.log('Erro ao carregar lista de times');
            }
        };
    
        fetchUserData();
    }, [me, user?.access_token]);
    


    useEffect(() => {
        const fetchGamePresenceData = async () => {
          if (!user?.id || !selectedEvent) return;
    
          try {
            const response = await api.get(`/game-presences/match-confirm/${selectedEvent}`, {
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
    }, [user?.access_token, selectedEvent]); // Adicionado matchId para garantir que busca os dados corretos

    function closeModal() {
        setModalMatchTeam(false)
        setOverlay(false)
    }

    function decrease() {
        if(contTeams > 0) {
            setContTeams(contTeams - 1)
        } 
    }

    function increment() {
        setContTeams (contTeams + 1)
    }

    async function onSort() {
        try {
            const response = await api.get(`/game-presences/match-sort/${selectedEvent}/qtd/${contTeams}`, {
              headers: {
                Authorization: `Bearer ${user?.access_token}`,
              },
            });
    
            console.log(response.data);
            setSortPlayers(response.data);
            setStepOneTeams(false);
            setStepTworTeams(true);
    
          } catch (error) {
            console.log('Erro ao sorteio de jogadores');
        }
    }

    const handleTeamSelection = (teamName: string, teamIndex: number) => {
        // Atualiza o time selecionado no índice correto
        setSelectedTeams(prev => {
            const newSelection = [...prev];
            newSelection[teamIndex] = teamName;
            return newSelection;
        });
    };

    async function postPlayerMatches() {
        try {
            // Itera sobre cada time
            for (let teamIndex = 0; teamIndex < sortPlayers.length; teamIndex++) {
                const team = sortPlayers[teamIndex];
                const teamName = selectedTeams[teamIndex];
    
                // Encontra o objeto do time correspondente ao nome selecionado
                const teamInfo = teams.find(t => t.name === teamName);
    
                if (!teamInfo) {
                    console.error(`Time ${teamName} não encontrado.`);
                    continue;
                }
    
                // Itera sobre cada jogador do time
                for (let playerIndex = 0; playerIndex < team.length; playerIndex++) {
                    const player = team[playerIndex];
    
                    // Cria o objeto de dados para a requisição POST
                    const playerMatchData: PlayerMatchProps = {
                        match_id: selectedEvent,
                        user_id: player.id,
                        team_id: teamInfo.id,
                    };
    
                    // Realiza a requisição POST
                    await api.post('/player-matches', playerMatchData, {
                        headers: {
                            Authorization: `Bearer ${user?.access_token}`,
                        },
                    });
    
                    console.log(`Jogador ${player.name} do time ${teamName} adicionado com sucesso.`);
                }
            }
    
            toast({
                title: "Todos os jogadores foram adicionados com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
              });
            
        } catch (error) {
            console.error('Erro ao adicionar jogadores:', error);
            toast({
                title: "Ocorreu um erro ao adicionar os jogadores.",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
              });
        }
    }

    function goForStepThree() {
        setStepOneTeams(false)
        setStepTworTeams(false)
        setStepThree(true)
        console.log('Partida: ', selectedEvent);
        console.log('times esclados: ', teamsConfirm);
        console.log('Jogadores esclados: ', playerConfirm);
        
    }

    return (
        <Flex 
            w={{base:'90%', md:'100%'}} 
            h={'70%'} 
            direction={"column"} 
            p={2} 
            bg={'#0c0c32'} 
            zIndex={6000} 
            rounded={'20px'} 
            position={"absolute"}
            overflowY={"scroll"}
        >
            <Flex w={'100%'} direction={"column"} >
                <Flex w={'100%'} justifyContent={"center"}>
                    <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} />
                </Flex>
            </Flex>
            <Flex w={'100%'} p={2} direction={"column"} >
            {stepOneTeams && (
                <Flex w={'100%'} direction={"column"} justifyContent={"center"} alignItems={"center"} >
                    {gamePresence && gamePresence.length > 0 ? (
                        gamePresence.map((player, index) => (
                            <Flex 
                                key={player.id} 
                                w={'100%'}
                                alignItems={"normal"}
                                mt={'1em'}
                                gap={4}
                                pl={12}
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
                        <Text>Esta partida não possui jogadores confirmados</Text>    
                    )}

                    {user.role === 9 || user.role === 'admin' && (
                        <Flex direction={"column"} w={'100%'}>
                            <Text
                                mt={'2em'} 
                                textAlign={"center"} 
                                fontSize={"20px"} 
                                fontWeight={"extrabold"}
                            >
                                Quantos times serão?
                            </Text>
                            <Flex w={'100%'} gap={4} justifyContent={"center"} p={4}>
                                <Button
                                    onClick={decrease}
                                >
                                    -
                                </Button>
                                <Flex border={'1px solid #b9fa3c'} w={'50px'} justifyContent={"center"} p={2}>
                                <Text
                                    textAlign={"center"} 
                                    fontSize={"20px"} 
                                    fontWeight={"extrabold"}
                                >
                                    {contTeams}
                                </Text>
                                </Flex>
                                <Button
                                    onClick={increment}
                                >
                                    +
                                </Button>
                            </Flex>

                            <Flex w={'100%'} justifyContent={"center"}>
                                <Button
                                    w={{base:'100%', md:'70%'}}
                                    mt={'2em'}
                                    bg={"#b9fa3c"}
                                    color={"#0c0c32"}
                                    p={1}
                                    onClick={() => onSort()}
                                >
                                    Sortear
                                </Button>
                            </Flex>

                        </Flex>    
                    )}

                    <Flex w={'100%'} justifyContent={"center"}>
                        <Button
                            w={{base:'100%', md:'70%'}}
                            mt={'1em'}
                            onClick={() => goForStepThree()}
                        >
                            Ver Escalação
                        </Button>
                    </Flex>

                </Flex>
            )}
                {/* Exibição dos times sorteados */}
                {stepTwoTeams && (
                    <Flex w={'100%'} direction={"column"}>
                            {sortPlayers.length > 0 && (
                                <Flex direction="column" mt={8} gap={6}>
                                    {sortPlayers.map((team, teamIndex) => (
                                        <Flex key={teamIndex} direction="column" gap={4}>
                                            <Flex gap={4}>
                                                <Text
                                                    w={'100px'}
                                                    fontSize="xl"
                                                    fontWeight="bold"
                                                    color="#b9fa3c"
                                                >
                                                    Time {teamIndex + 1}
                                                </Text>
                                                <Flex w={'100%'} wrap={"wrap"}>
                                                    <Menu>
                                                        <MenuButton as={Button} bg="#FFFFFF" color="#0c0c32" _hover={{ bg: "#b9fa3c", color: "#0c0c32" }}>
                                                            {selectedTeams[teamIndex] || "Selecione um time"}
                                                        </MenuButton>
                                                        <MenuList bg="#0c0c32" border="1px solid #b9fa3c">
                                                        {teams.map((team, index) => (
                                                            <MenuItem
                                                                key={index}
                                                                bg="#0c0c32"
                                                                color="white"
                                                                fontWeight={"bold"}
                                                                _hover={{ bg: "#b9fa3c", color: "#0c0c32" }}
                                                                onClick={() => handleTeamSelection(team.name, teamIndex)}
                                                            >
                                                                {team.name}
                                                            </MenuItem>                                                        
                                                        ))}
                                                        </MenuList>
                                                    </Menu>
                                                </Flex>
                                            </Flex>
                                            <Box w={'100%'} h={'1px'} bg={'#b9fa3c'} />
                                            {team.map((player, playerIndex) => (
                                                <Flex 
                                                    key={player.id} 
                                                    w={'100%'}
                                                    alignItems={"normal"}
                                                    mt={'1em'}
                                                    gap={4}
                                                    >
                                                    <Text
                                                        mt={'2em'} 
                                                        textAlign={"center"} 
                                                        fontSize={"20px"} 
                                                        fontWeight={"extrabold"}
                                                    >
                                                        {playerIndex + 1}
                                                    </Text>
                                                    <Box w={'100px'} h={'100px'} rounded={"full"} bg={'#b9fa3c'}>
                                                        <Image
                                                            src={player.avatar}
                                                            rounded={"full"}
                                                            alt="avatar"
                                                            width="100%"
                                                            height="100%"
                                                            objectFit="cover"
                                                        />
                                                    </Box>
                                                    <Text
                                                        mt={'2em'} 
                                                        textAlign={"center"} 
                                                        fontSize={"20px"} 
                                                        fontWeight={"extrabold"}
                                                    >
                                                        {player.name}
                                                    </Text>
                                                </Flex>
                                            ))}
                                        </Flex>
                                    ))}
                                </Flex>
                            )}
                        <Button
                            mt={'2em'}
                            bg={"#b9fa3c"}
                            color={"#0c0c32"}
                            p={1}
                            onClick={postPlayerMatches}
                        >
                            Confirmar Escalação
                        </Button>
                    </Flex>
                )}

                {stepThree && (
                    <Flex direction={"column"} w={'100%'}>
                        {playerConfirm.map((player, playerIndex) => (
                            <Flex key={player.id} w={'100%'} direction={"column"} alignItems={"center"} gap={4} mt={'1em'}>
                                {/* Linha separadora vermelha se o time for diferente do anterior */}
                                {playerIndex > 0 && teamsConfirm[playerIndex].name !== teamsConfirm[playerIndex - 1].name && (
                                    <Box w={'100%'} h={'1px'} bg={'#b9fa3c'} mt={2} />
                                )}
                                
                                <Flex w={'100%'} alignItems={"center"} gap={4}>
                                    <Box w={'50px'} h={'50px'} rounded={"full"} bg={'#b9fa3c'}>
                                        <Image
                                            src={player.avatar}
                                            rounded={"full"}
                                            alt="avatar"
                                            width="100%"
                                            height="100%"
                                            objectFit="cover"
                                        />
                                    </Box>
                                    <Text fontSize={"lg"} color={"#FFFFFF"}>
                                        {player.name}
                                    </Text>
                                    <Text fontSize={"lg"} color={"#FFFFFF"}>
                                        ( {teamsConfirm[playerIndex].name} )
                                    </Text>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                )}
                
            </Flex>
        </Flex>
    )
}