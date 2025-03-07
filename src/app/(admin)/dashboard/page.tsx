"use client"

import { ATPanel } from "components";
import { useAuth } from "contexts/auth.context";
import { useEffect } from "react";

import { Flex, Text } from "@chakra-ui/react";

export default function Dashboard() {
  const { user, me } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await me(); // Carrega os dados do usuário
      } catch (error) {
        console.error("Erro ao carregar os dados do usuário:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <Flex direction={"column"} display={'flex'} alignItems={"center"} bg={'#0c0c32'} >
      <ATPanel zIndex={20} position={"absolute"} mt={'2em'} bg={'transparent'}>
        <Text fontSize={"2xl"} color={'#1f6027'} fontWeight={"extrabold"}>Administrativo</Text>
        <Text fontSize={"2xl"} color={'#1f6027'} fontWeight={"extrabold"}>Welcome, {user?.name || "Guest"}</Text>
      </ATPanel>
    </Flex>
  );
}
