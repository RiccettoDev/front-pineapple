"use client";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { ATPanel } from "components";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

// Define a interface para os dados do jogador (ajuste conforme necessário)
interface Player {
  id: string;
  email: string;
  role: string;
  name: string;
  birth_date: string;
  avatar?: string;
  // Adicione outras propriedades conforme necessário
}

export default function Players() {
  const { user, me } = useAuth();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users`, {
          headers: {
            Authorization: `Bearer ${user?.access_token}`, // Adiciona o token no cabeçalho Authorization
          },
        });
        
        setPlayers(response.data.records); // Ajuste conforme necessário se a resposta for um array de jogadores
        
      } catch (error) {
        console.log('Erro ao carregar lista de jogadores');
      }
    };

    fetchUserData();
  }, [me, user?.access_token]); // Adicionando user?.access_token para garantir a dependência do token

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
    <>
      <ATPanel
        w={"100%"}
        h={"100%"}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"start"}
        alignItems={{base:'center', sm:"start"}}
      >
        <Text
          mt={'1em'}
          mb={'1em'}
          ml={'1em'}
          fontWeight={"extrabold"}
          fontSize={"2xl"}
          color={'#b9fa3c'}
        >
          Jogadores
        </Text>

        {/* Verifique se players tem dados e mapeie */}
        {players.length > 0 ? (
          players.map((player) => (
            <Flex key={player.id} bg="#b9fa3c" p={4} m={2} borderRadius="md" width={{base:"100%", sm:'80%'}} gap={{base:2,sm:10}} direction={{base:"column", sm:'row'}}>
              <Box 
                bg={'#FFD700'}
                w={100}
                h={100}
                rounded={"full"}
                overflow="hidden" // Impede que o conteúdo saia do contêiner
                display="flex" // Garante o alinhamento correto da imagem no centro
                justifyContent="center"
                alignItems="center"
              >
                {player.avatar ? (
                  <Image
                    src={player.avatar}
                    alt="avatar"
                    width="100%"
                    height="100%"
                    objectFit="cover" // Garante que a imagem preencha o contêiner sem distorcer
                  />
                ) : (
                  <Text color={'#000000'}>Sem avatar</Text>
                )}
              </Box>
              <Flex direction={"column"} justifyContent={"center"}>
                <Flex gap={2}>
                  <Text fontWeight="bold" color={'#1f6027'}>Nome:</Text>
                  <Text fontWeight="bold" color={'#0c0c32'}>{player.name}</Text>
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" color={'#1f6027'}>E-mail:</Text>
                  <Text fontWeight="bold" color={'#0c0c32'}>{player.email}</Text>
                </Flex>
                <Flex gap={2}>
                  <Text fontWeight="bold" color={'#1f6027'}>Idade:</Text>
                  <Text fontWeight="bold" color={'#0c0c32'}>{calculateAge(player.birth_date)}</Text>
                </Flex>
              </Flex>
            </Flex>
          ))
        ) : (
          <Text>Nenhum jogador encontrado.</Text>
        )}
      </ATPanel>
    </>
  );
}
