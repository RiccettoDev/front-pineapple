"use client"

import { ATPanel } from "components";
import { useAuth } from "contexts/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import imgHome from "../../../img/home/home.jpg";

export default function HomePage() {
  const { user, me } = useAuth();
  const router = useRouter();

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

  // // tivemos um problema de tipagem em relação ao ROLE do Admin aqui
  // function changeRole() {
  //   if (typeof user.role === "string" && user.role === "admin") {
  //     router.push("/dashboard");
  //   } else if (typeof user.role === "number" && user.role === 9) {
  //     router.push("/dashboard");
  //   } else {
  //     alert(`Você não tem permissão, pois tem role: ${user.role}`);
  //   }
  // }
  

  return (
    <Flex direction={"column"} display={'flex'} alignItems={"center"} bg={'#0c0c32'} >
      <Box zIndex={10}>
        <Image src={imgHome} alt="image home" />
      </Box>
      <ATPanel zIndex={20} position={"absolute"} mt={'2em'} bg={'transparent'}>
        <Text fontSize={"2xl"} color={'#1f6027'} fontWeight={"extrabold"}>Home</Text>
        <Text fontSize={"2xl"} color={'#1f6027'} fontWeight={"extrabold"}>Welcome, {user?.name || "Guest"}</Text>
      </ATPanel>
    </Flex>
  );
}
