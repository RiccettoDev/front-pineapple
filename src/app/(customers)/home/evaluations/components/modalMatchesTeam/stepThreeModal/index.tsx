import { Box, Flex, Text } from "@chakra-ui/react";

interface ModalProps {
    closeModal: () => void;
}

export default function StepThreeModal({ closeModal }: ModalProps) {
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
                            Foi mal peladeiro, as avaliações desta partida foram encerradas
                        </Text> 
                    </Flex>
                    <Flex w={'100%'} justifyContent={"center"}>
                        <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'}/>
                    </Flex>
                </Flex>
            </Flex>   
        </>
    )
}