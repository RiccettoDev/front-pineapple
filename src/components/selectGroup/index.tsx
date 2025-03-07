import { Button, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

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

interface SelectGroupProps {
    selectedGroupId: string;
    setSelectedGroupId: (groupId: string) => void;
}

export default function SelectGroup({ selectedGroupId, setSelectedGroupId }: SelectGroupProps) {

    const { user, me } = useAuth();
    const [userData, setUserData] = useState<UserProps | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
          if (!user?.id) return;
    
          try {
            const response = await api.get(`/users/${user?.id}`, {
              headers: {
                Authorization: `Bearer ${user?.access_token}`,
              },
            });
    
            setUserData(response.data);        
            // 🔹 Garante que o grupo existe antes de definir o estado
            if (response.data.memberships?.length > 0) {
              setSelectedGroupId(response.data.memberships[0].group.id);
            }
          } catch (error) {
            console.log('Erro ao carregar lista de jogadores');
          }
        };
    
        fetchUserData();
    }, [me, user?.access_token]);

    return (
        <Flex gap={4} >
            <Text mb={'1em'} ml={'1em'} fontWeight={"extrabold"} fontSize={"2xl"} color={'#b9fa3c'}>
                Grupo:
            </Text>
            <Flex w={'100%'} wrap={"wrap"}>
                <Menu>
                    <MenuButton as={Button} bg="#0c0c32" color="white" _hover={{ bg: "#b9fa3c", color: "#0c0c32" }}>
                    Selecione um grupo
                    </MenuButton>
                    <MenuList bg="#0c0c32" border="1px solid #b9fa3c">
                    {userData?.memberships?.map((membership, index) => (
                        <MenuItem
                        key={index}
                        bg="#0c0c32"
                        color="white"
                        fontWeight={"bold"}
                        _hover={{ bg: "#b9fa3c", color: "#0c0c32" }}
                        onClick={() => setSelectedGroupId(membership.group.id)}
                        >
                        {membership.group.name}
                        </MenuItem>
                    ))}
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}