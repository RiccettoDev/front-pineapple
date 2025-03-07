import {
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";

  interface MyModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    text?: string;
    children?: React.ReactNode; // Alterado para aceitar JSX
    justifyContent?: string;
    size?: string;
  }

  function MyModal({ isOpen, onClose, title, text, children, justifyContent, size }: MyModalProps) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size={size} >
        <ModalOverlay />
        <ModalContent 
            w={{ base: '95%', md: '90%', lg: '80%' }} 
            mt={{base:'2em', md:'4em'}} bg={'#0c0c32'} 
            rounded={'20px'}
            border="2px solid #b9fa3c"
        >
          <Flex w={'100%'} justifyContent={"center"} p={4}>
            <Flex
                bg={'#A234E8'}
                w={'40%'}
                rounded={"full"}
            >
            </Flex>
          </Flex>  
          <ModalHeader flexDirection={"column"}>
            <Flex w={'100%'} justifyContent={justifyContent}>
                <Button 
                    bg={'#b9fa3c'}
                    color={'#0c0c32'}
                    onClick={onClose}
                    rounded={"full"}
                    fontWeight={"extrabold"}
                    fontSize={"16px"}
                >
                    x
                </Button>
            </Flex>
            <Flex w={'100%'} justifyContent={"center"}>
                <Text
                    fontSize={"3xl"}
                    fontWeight={"extrabold"}
                    color={'#b9fa3c'}
                    mt={'1em'}
                    mb={'-1.5em'}
                    textAlign={"center"}
                >
                    {title}
                </Text>
            </Flex>
          </ModalHeader>
          <ModalBody flexDirection={"column"} justifyContent={"center"} alignItems={"center"} >
            <Text
                fontSize={"3xl"}
                fontWeight={"extrabold"}
                color={'red'}
                mt={'1em'}
                mb={'1em'}
            >
                {text}
            </Text>
            <Flex w={'100%'} justifyContent={"center"}>
                {children} {/* Aqui o children será renderizado */}
            </Flex>
          </ModalBody>
          <ModalFooter>
            {/** AQUI o FOOTER  */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  
  export default MyModal;
  