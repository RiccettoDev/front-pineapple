"use client";
import { Flex, Text, useToast } from "@chakra-ui/react";
import { ATPanel } from "components";
import SelectGroup from "components/selectGroup";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";
import CardPlayer from "./components/cardPlayer";

interface Member {
  user: {
    id: string;
    avatar: string;
    name: string;
    birth_date: string;
  };
  function: string;
}

export default function Players() {
  const toast = useToast();
  const { user, me } = useAuth();
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [members, setMembers] = useState<Member[]>([]); // 🔹 Inicializa como array vazio

  useEffect(() => {
    if (!selectedGroupId) return; // 🔹 Evita chamadas desnecessárias à API

    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(`/groups/${selectedGroupId}`, {
          headers: {
            Authorization: `Bearer ${user?.access_token}`,
          },
        });

        // 🔹 Garante que `members` seja sempre um array antes de setar no estado
        setMembers(Array.isArray(response.data.members) ? response.data.members : []);
      } catch (error) {
        toast({
          title: "Erro ao carregar os membros do grupo.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top"
        });

        setMembers([]); // 🔹 Evita estado indefinido caso a requisição falhe
      }
    };

    fetchGroupMembers();
  }, [selectedGroupId, user?.access_token, toast]);

  const handleEventClick = (groupId: string) => {
    console.log("ID do grupo selecionado:", groupId);
    setSelectedGroupId(groupId);
  };

  return (
    <>
      <ATPanel
        w={"100%"}
        h={"100%"}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"start"}
        alignItems={{ base: 'center', sm: "start" }}
      >
        
        <SelectGroup
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
        />

        <Text mt={'1em'} mb={'1em'} ml={'1em'} fontWeight={"extrabold"} fontSize={"2xl"} color={'#b9fa3c'}>
          Jogadores:
        </Text>

        <Flex 
          w={'100%'} 
          wrap="wrap" // Adiciona wrap para os cards se ajustarem em várias linhas
          gap={4} // Adiciona espaçamento entre os cards
        >
          {Array.isArray(members) && members.length > 0 ? (
            members.map((member, index) => (
              <Flex 
                key={index} 
                alignItems={"center"} 
                justifyContent={"center"} 
                w={{ base: "100%", sm: "32%" }} // Ajuste do tamanho para telas maiores
              >
                <CardPlayer
                  id={member.user.id}
                  avatar={member.user.avatar} 
                  name={member.user.name}
                  birth_date={member.user.birth_date}
                />
              </Flex>
            ))
          ) : (
            <Text fontSize={"lg"} color={"#FFFFFF"} mt={4}>
              Não há jogadores
            </Text>
          )}
        </Flex>

      </ATPanel>
    </>
  );
}