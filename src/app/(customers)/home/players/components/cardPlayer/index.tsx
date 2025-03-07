import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface AttributesProps {
    attack: number;
    defense: number;
    passing: number;
    shooting: number;
    speed: number;
    dribbling: number;
    heading: number;
    vigor: number;
}

interface UserProps {
    id: string;
    avatar: string;
    name: string;
    birth_date: string;
}

export default function CardPlayer({ 
    id,
    avatar, 
    name, 
    birth_date, 
}: UserProps) {

    const { user, me } = useAuth();
    const [userData, setUserData] = useState<UserProps | null>(null);
    const [attributesData, setAttributesData] = useState<AttributesProps | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
          if (!user?.id) return;
    
          try {
            const response = await api.get(`/player-attributes/${id}`, {
              headers: {
                Authorization: `Bearer ${user?.access_token}`,
              },
            });
            
            // Atualizando o estado de atributos, não userData
            setAttributesData(response.data);        
            
          } catch (error) {
            console.log('Erro ao carregar atributos dos jogadores');
          }
        };
    
        fetchUserData();
      }, [me, user?.access_token, id]); // Adicionei 'id' para garantir que a requisição é feita sempre que o id mudar

      function calculateAge(birthDate: string): number {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();
      
        // Ajuste a idade se o aniversário ainda não ocorreu no ano atual
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
      
        return age;
      }

    return (
        <Flex 
            w={"400px"}
            h={"640px"}
            bg={"#0c0c32"}
            position={"relative"}
            direction={"column"}
            alignItems={"center"}
            clipPath="polygon(50% 7%, 100% 10%, 100% 90%, 50% 100%, 0% 90%, 0% 10%)"
            border={"5px solid #b9fa3c"}
        >   
            <Box w={300} h={300} mt={'4em'} rounded={'full'} border={'3px solid #b9fa3c'} >
                <Image 
                    src={avatar} 
                    alt="Imagem do jogador" 
                    borderRadius="full" 
                    w="100%" 
                    h="100%" 
                    objectFit="cover" 
                />
            </Box>

            <Box bg={'#b9fa3c'} w={'90%'} h={'2px'} mt={'1.5em'} />
            <Box bg={'#b9fa3c'} w={'90%'} h={'2px'} mt={'0.5em'} />

            <Text
                color={"#b9fa3c"}
                fontWeight={"extrabold"}
                fontSize={"2xl"}
                textAlign={"center"}
                mt={4}
            >
                {name}
            </Text>

            <Flex w={'100%'} mt={'0.5em'}>
                <Flex direction={"column"} w={'50%'} alignItems={"center"} ml={'1em'} mr={'-0.5em'}>
                    {/* Verificando se 'attributesData' está carregado */}
                    <Flex w={'80%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            ataque:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.attack ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'80%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            defesa:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.defense ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'80%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            passando:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.passing ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'80%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            finalização:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.shooting ?? 'N/A'}
                        </Text>
                    </Flex>
                </Flex>

                <Box w={'2px'} h={'100%'} bg={'#b9fa3c'}/>

                <Flex direction={"column"} w={'50%'} alignItems={"center"} ml={'1.1em'}>
                    <Flex w={'100%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            velocidade:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.speed ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'100%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            drible:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.dribbling ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'100%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            cabeçada:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.heading ?? 'N/A'}
                        </Text>
                    </Flex>
                    <Flex w={'100%'} justifyContent={"start"} gap={2}>
                        <Text
                            fontSize={"lg"}
                            color={'#FFD700'}
                            fontWeight={"bold"}
                        >
                            vigor:
                        </Text>
                        <Text
                            fontSize={"lg"}
                            color={'#b9fa3c'}
                            fontWeight={"bold"}
                        >
                            {attributesData?.vigor ?? 'N/A'}
                        </Text>
                    </Flex>
                </Flex>
                <Flex 
                    w={"60px"}
                    h={"60px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    position={"absolute"}
                    top={'4em'}
                    left={'0.5em'}
                    bg={'#b9fa3c'}
                    color={'#0c0c32'}
                    clipPath="polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                >
                    <Text
                        fontSize={"lg"}
                        color={'#0c0c32'}
                        fontWeight={"bold"}
                    >
                        7
                    </Text>
                </Flex>
                <Flex 
                    w={"60px"}
                    h={"60px"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    position={"absolute"}
                    top={'21em'}
                    right={'2em'}
                    gap={2}
                >
                    <Text
                        fontSize={"lg"}
                        color={'#b9fa3c'}
                        fontWeight={"bold"}
                    >
                        Age:
                    </Text>
                    <Text
                        fontSize={"lg"}
                        color={'#FFD700'}
                        fontWeight={"bold"}
                    >
                        {calculateAge(birth_date)}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}
