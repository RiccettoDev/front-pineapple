import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";

interface StepOneModalProps {
teamsConfirm: TeamProps[]; // Agora é um array
playerConfirm: sortPlayersProps[]; // Agora é um array
clickEvaluation: (id: string, name: string, avatar: string) => void;
closeModal: () => void;
setStepOne: React.Dispatch<React.SetStateAction<boolean>>;
setStepTwo: React.Dispatch<React.SetStateAction<boolean>>;
setStepThree: React.Dispatch<React.SetStateAction<boolean>>;
setQuestion: React.Dispatch<React.SetStateAction<boolean>>;
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

export default function StepOneModal({ clickEvaluation, playerConfirm, teamsConfirm, closeModal, setStepOne, setStepTwo, setStepThree, setQuestion }: StepOneModalProps) {

    function Question() {
        setStepOne(false)
        setStepTwo(false)
        setQuestion(true)
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
                        <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'}/>
                    </Flex>
                </Flex>
                <Flex w={'100%'} p={8} direction={"column"} >
    
                    <Flex direction={"column"} w={'100%'}>
                        {playerConfirm.map((player, playerIndex) => (
                            <Flex key={player.id} w={'100%'} direction={"column"} alignItems={"center"} gap={4} mt={'1em'}>
                                {/* Linha separadora vermelha se o time for diferente do anterior */}
                                {playerIndex > 0 && teamsConfirm[playerIndex].name !== teamsConfirm[playerIndex - 1].name && (
                                    <Box w={'100%'} h={'1px'} bg={'#b9fa3c'} mt={2} />
                                )}
                                
                                <Flex w={'100%'} alignItems={"center"} gap={4} direction={{base:"column", md:"row"}}>
                                    <Flex w={'100%'} justifyContent={{base:"space-between", md:"start"}} gap={4}>
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
                                    </Flex>

                                    <Flex w={'100%'} justifyContent={"space-between"}>
                                        <Text fontSize={"lg"} color={"#FFFFFF"}>
                                            ( {teamsConfirm[playerIndex].name} )
                                        </Text>
                                        <Button
                                            onClick={() => clickEvaluation(
                                                player.id,
                                                player.name,
                                                player.avatar,
                                            )}
                                        >
                                            Avaliar
                                        </Button>
                                    </Flex>
                                </Flex>
                                <Box w={'100%'} h={'1px'} bg={'#b9fa3c'} mt={2} />
                            </Flex>
                        ))}
                    </Flex>

                    <Button
                        bg={'#b9fa3c'}
                        mt={'2em'}
                        onClick={() => Question()}
                    >
                        Finalizar Avaliações
                    </Button>
                
                </Flex>
            </Flex> 
        </>
    )
}