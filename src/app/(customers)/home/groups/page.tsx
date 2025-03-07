"use client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ATPanel } from "components";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";
import ModalGroups from "./components/ModalGroups";

import MyModal from "components/atomic/modal";
import { FaPlus } from "react-icons/fa";
import ModalCreate from "./components/ModalCreate";

interface UserProps {
  email: string;
  password: string;
  role: 1 | 9 | 'admin' | 'user';
  name: string;
  phone: string;
  birth_date: string;
  avatar?: string;
  memberships?: MembershipProps[];
}

interface MembershipProps {
  group: GroupProps;
}

interface GroupProps {
  id: string;
  name: string;
}


export default function Groups() {

  const { user, me } = useAuth();
  const [userData, setUserData] = useState<UserProps | null>(null);
  const [overlay, setOverlay] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalCreate, setModalCreate] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');

  // 1. Carrega os dados do usuário
  useEffect(() => {
    const fetchUserData = async () => {
      if(!user) {
        try {
          await me(); // Garante que o usuário seja carregado no contexto
        } catch (error) {
          console.error("Erro ao carregar os dados do usuário:", error);
        }
      }
    };

    fetchUserData();
  }, [me]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return; // Garante que só executa se o ID do usuário existir

      try {
        const response = await api.get(`/users/${user.id}`)
        setUserData(response.data)
        console.log(response.data);
        

      } catch (error) {
        console.error("Erro ao carregar os dados dos grupos:", error);
      }
    };

    fetchUser();
  }, [user?.id]);

  // Função para lidar com o clique no evento
  const handleEventClick = (groupId: string) => {
    console.log("ID do grupo selecionado:", groupId);
    setSelectedGroupId(groupId); // Armazena o ID do grupo
    setOverlay(true); // Abre o overlay
    setModal(true); // Abre o modal
  };
  
  function activeButton() {
    setModalCreate(true)
    setOverlay(true)
  }

  return (
    <>
      <ATPanel
        w={"100%"}
        h={{base:'auto', sm:"100%"}}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"start"}
        alignItems={{base:'center', sm:"start"}}
      >
        <Flex w={'100%'} justifyContent={"center"} alignItems={"center"} direction={"column"}>
          <Text
            mt={'1em'}
            mb={'1em'}
            ml={'1em'}
            fontWeight={"extrabold"}
            fontSize={"2xl"}
            color={'#b9fa3c'}
            textAlign={"center"}
          >
            Grupos
          </Text>
          <Text
            mt={'1em'}
            mb={'1em'}
            ml={'1em'}
            fontWeight={"extrabold"}
            fontSize={"2xl"}
            color={'#b9fa3c'}
            textAlign={"center"}
          >
            {userData?.role === 'admin' ? 
              'Aqui você pode criar e visualizar seus grupos de pelada com a galera.' : 
              'Aqui você pode visualizar seus grupos de pelada com a galera.'
            }
          </Text>
          <Box width={'90%'} h={'1px'} bg={'#FFFFFF'} mb={'2em'}/>
          {user.role === 9 || user.role === 'admin' && (
            <Button onClick={activeButton} gap={2}>
              Criar grupo
              <FaPlus />
            </Button>
          )}
        </Flex>
        {userData?.memberships && userData.memberships.length > 0 ? (
          userData.memberships.map((membership, index) => (
            <Button 
            key={index} 
            w={'auto'}
            h={'auto'}
            mt={4} 
            p={4} 
            gap={4}
            bg={'#FFD700'}
            rounded={"2xl"}
            transition={"all 0.3s ease-in-out"}
            _hover={{
              transform: "scale(1.05)", // Aumenta 10% no hover
              opacity: 0.5,           // Reduz a opacidade no hover
            }}
            onClick={() => handleEventClick(membership.group.id)} // Passa o ID do grupo
          >
            <Flex direction={{base:"column", sm:"row"}} gap={4}>
              <Text fontSize={"lg"} color={"#1f6027"} fontWeight={"extrabold"}>
                Nome do Grupo:
              </Text>
              <Text fontSize={"lg"} color={"#0c0c32"} fontWeight={"semibold"} textAlign={"center"}>
                {membership.group.name}
              </Text>
            </Flex>
          </Button>

          ))
        ) : (
          <Text fontSize={"lg"} color={"#FFFFFF"} mt={4}>
            Usuário não possui nenhum grupo cadastrado
          </Text>
        )}
      </ATPanel>

      {modal && (
        <MyModal
          isOpen={modal}
          onClose={() => {
            setModal(false);
            setOverlay(false);
          }}
          title={"Detalhes do Grupo"}
          justifyContent="right"
          size="full"
        >
          <ModalGroups
            setModal={setModal}
            setOverlay={setOverlay}
            groupId={selectedGroupId}
            token={user.access_token}
            userRole={user.role}
            id={user.id}
            setUserData={setUserData}
          />
        </MyModal>
      )}

      {modalCreate && (
        <MyModal
          isOpen={modalCreate}
          onClose={() => {
            setModalCreate(false);
            setOverlay(false);
          }}
          title={"Criar Grupo"}
          justifyContent="right"
        >
          <ModalCreate
            setModalCreate={setModalCreate}
            setOverlay={setOverlay}
            token={user.access_token}
            id={user.id}
            setUserData={setUserData}
          />
        </MyModal>
      )}
    </>
  );
}
