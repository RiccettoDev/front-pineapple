import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";
import ModalAddMember from "./ModalAddMember";

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

interface ModalGroupsProps {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  groupId: string;
  token: string;
  userRole: string | number;
  id: string;
  setUserData: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

interface Member {
  user: {
    id: string;
    avatar: string;
    name: string;
  };
  function: string;
}

export default function ModalGroups({
  setModal,
  setOverlay,
  groupId,
  token,
  userRole,
  id,
  setUserData,
}: ModalGroupsProps) {
  const toast = useToast();
  const { user, me } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [isAddMemberOpen, setAddMemberOpen] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [stepOne, setSetpOne] = useState(true)

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(`/groups/${groupId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMembers(response.data.members);
      } catch (error) {
        toast({
          title: "Erro ao carregar os membros do grupo.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
      }
    };

    fetchGroupMembers();
  }, [groupId, token, toast]);

  async function deleteGroup() {
    try {
      await api.delete(`/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Grupo deletado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      clickNoDelete();
      closeModal();

      const updatedUserData = await api.get(`/users/${id}`);
      setUserData(updatedUserData.data);
    } catch (error) {
      toast({
        title: "Erro ao deletar grupo.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  async function deleteUser(userId: string) {
    try {
      await api.delete(`/group-members/${groupId}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Usuário removido com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setMembers((prevMembers) => prevMembers.filter(member => member.user.id !== userId));
    } catch (error) {
      toast({
        title: "Erro ao remover usuário do grupo.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  }

  function closeModal() {
    setModal(false);
    setOverlay(false);
  }

  function openAddMemberModal() {
    setAddMemberOpen(true);
  }

  function openDeleteModal() {
    setModalDelete(true);
    setSetpOne(false)
  }

  function clickNoDelete() {
    setModalDelete(false);
  }

  return (
    <Flex w={'100%'} justifyContent={"center"} direction={"column"}>
      {stepOne && (
        <Flex direction={"column"} gap={4} justifyContent={"center"} w={"100%"} >
          {userRole === 'admin' && (
            <Flex w={"80%"} pl={8} pb={8}>
              <Button bg={"#b9fa3c"} color={"#0c0c32"} onClick={openAddMemberModal}>
                Adicionar membro
              </Button>
            </Flex>
          )}

          <Flex w={'100%'} pl={12} direction={"column"}>
            <Text fontSize={"2xl"} fontWeight={"semibold"} color={'#b9fa3c'}>
              Jogadores do grupo
            </Text>
            <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'} mb={'2em'} />
          </Flex>
          {members.map((member, index) => (
            <Flex key={index} alignItems={"center"} justifyContent={"center"} w={"100%"} mt={'1em'}>
              <Flex border={"1px solid #FFFFFF"} p={2} w={{base:'35%', sm:"20%"}} h={'100%'} justifyContent={"center"} bg={"#FFD700"}>
                <img
                  src={member.user.avatar}
                  alt={member.user.name}
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </Flex>

              <Flex direction={{base:"column", sm:"row"}} w={'70%'} h={'100%'}>
                <Flex border={"1px solid #FFFFFF"} h={"100%"} w={{base:'100%', sm:"50%"}} justifyContent={"center"} alignItems={"center"} p={4}>
                  <Text color={"#FFFFFF"} fontWeight={"bold"} fontSize={{base:'16px', sm:"3xl"}}>
                    {member.user.name}
                  </Text>
                </Flex>
                <Flex border={"1px solid #FFFFFF"} h={"100%"} w={{base:'100%', sm:"20%"}} justifyContent={"center"} alignItems={"center"} p={4} position={"relative"}>
                  <Text color={"#FFFFFF"} fontWeight={"bold"} fontSize={{base:'16px', sm:"3xl"}}>
                    {member.function}
                  </Text>
                  {user.role === 9 || user.role === 'admin' && (
                    <Button position={"absolute"} bottom={-3} right={-3} bg={'red'} rounded={"full"} color={"#FFFFFF"} onClick={() => deleteUser(member.user.id)}>
                      x
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          ))}
        </Flex>
      )}

      {userRole === 'admin' && (
        <Flex w={"100%"} justifyContent={"center"} alignItems={"center"} mt={'4em'} mb={'2em'}>
          <Button bg={"red"} color={"#FFFFFF"} onClick={openDeleteModal}>
            Deletar grupo
          </Button>
        </Flex>
      )}

      {isAddMemberOpen && (
        <ModalAddMember
          setModalCreate={setAddMemberOpen}
          setOverlay={setOverlay}
          groupId={groupId}
          token={token}
          setModalPrevious={setModal}
        />
      )}

      {modalDelete && (
          <Flex 
            bg={'#b9fa3c'} 
            w={{base:'90%', md:'70%'}} 
            h={'350px'} 
            rounded={"2xl"} 
            p={2}
            position={"absolute"}
            left={{md:'15%'}}
            mt={{base:'6em'}} 
            direction={"column"} 
            justifyContent={"center"} 
            alignItems={"center"}
          >
            <Flex w={'100%'} p={6}>
              <Text
                fontSize={"2xl"}
                fontWeight={"semibold"}
                color={'#0c0c32'}
              >
                Tem certeza que deseja deletar o grupo?
              </Text>
            </Flex>

            <Flex w={'100%'} justifyContent={"center"} gap={16} mt={'2em'}>
              <Button 
                bg={'#0c0c32'} 
                color={'#FFFFFF'}
                onClick={() => deleteGroup()}
              >
                SIM
              </Button>
              
              <Button 
                bg={'#0c0c32'} 
                color={'#FFFFFF'}
                onClick={() => clickNoDelete()}
              >
                NÃO
              </Button>
            </Flex>
          </Flex>
      )}

    </Flex>
  );
}