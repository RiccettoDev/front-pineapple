import { Box, Flex, Image, Text } from "@chakra-ui/react";
import FormEvaluation from "./formEvaluation";

interface StepTwoModalProps {
    closeModal: () => void;
    name: string;
    avatar: string;
    id: string;
    setStepOne: React.Dispatch<React.SetStateAction<boolean>>;
    setStepTwo: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEvent: string
}

export default function StepTwoModal({ closeModal, name, avatar, id, setStepOne, setStepTwo, selectedEvent }: StepTwoModalProps) {
    
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

                <Flex w={'100%'} direction={"column"} justifyContent={"center"} alignItems={"center"} gap={4}>
                    <Box w={'200px'} h={'200px'} rounded={"full"} bg={'#b9fa3c'}>
                        <Image
                            src={avatar}
                            rounded={"full"}
                            alt="avatar"
                            width="100%"
                            height="100%"
                            objectFit="cover"
                        />
                    </Box>
                    <Text fontSize={"lg"} color={"#FFFFFF"}>
                        {name}
                    </Text>

                    <FormEvaluation 
                        id={id} 
                        selectedEvent={selectedEvent}
                        setStepOne={setStepOne}
                        setStepTwo={setStepTwo}
                    />

                </Flex>
                
            </Flex> 
        </>
    )
}