import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface ModalProps {
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    setModalExistingTeam: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGroupId: string;
}

interface TeamProps {
    id: number;
    group_id: string;
    name: string;
    victories: number;
    defeats: number;
    goals_scored: number;
    goals_against: number;
}

export default function ModalExistingTeam({ setOverlay, setModalExistingTeam, selectedGroupId }: ModalProps) {
    const { user, me } = useAuth();
    const [teams, setTeams] = useState<TeamProps[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get(`/teams/group/${selectedGroupId}`, {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                });

                setTeams(response.data.records);
            } catch (error) {
                console.log('Erro ao carregar lista de times');
            }
        };

        fetchUserData();
    }, [me, user?.access_token]);

    function closeModal() {
        setModalExistingTeam(false);
        setOverlay(false);
    }

    return (
        <>
            <Flex w={'100%'} direction={"column"} mt={'-3em'}>
                <Flex w={'100%'} justifyContent={"center"}>
                    <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'} />
                </Flex>

                <Flex w={'100%'} wrap={"wrap"} justifyContent={"space-between"} gap={4} mt={'2em'}>
                    {teams && teams.length > 0 ? (
                        teams.map((team, index) => (
                            <Button
                                key={index}
                                w={'47%'}
                                bg={'#b9fa3c'}
                                color={'#0c0c32'}
                                fontWeight={"bold"}
                                justifyContent={"center"}
                            >
                                {team.name}
                            </Button>
                        ))
                    ) : (
                        <Text>Este grupo não possui times cadastrados</Text>
                    )}
                </Flex>
            </Flex>
        </>
    );
}