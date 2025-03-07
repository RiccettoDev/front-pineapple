import { useToast } from "@chakra-ui/react";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";
import Question from "./question";
import StepOneModal from "./stepOneModal";
import StepThreeModal from "./stepThreeModal";
import StepTwoModal from "./stepTwoModal";


interface ModalProps {
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>; // Tipo para atualizar o estado de overlay
    setModalMatchTeam: React.Dispatch<React.SetStateAction<boolean>>;
    selectedEvent: string;
    selectedGroupId: string;
}

interface sortPlayersProps {
    id: string,
    name: string,
    avatar: string,
}

interface TeamProps {
    id: number,
    group_id: string,
    name: string,
    victories: number,
    defeats: number,
    goals_scored: number,
    goals_against: number
}

export default function ModalMatchesTeam({ setModalMatchTeam, setOverlay, selectedEvent, selectedGroupId }: ModalProps) {
    
    const { user, me } = useAuth();
    const toast = useToast();
    const [teamsConfirm, setTeamsConfirm] = useState<TeamProps[]>([]);
    const [playerConfirm, setPlayersConfirm] = useState<sortPlayersProps[]>([]);
    const [stepOne, setStepOne] = useState(true);
    const [stepTwo, setStepTwo] = useState(false);
    const [stepThree, setStepThree] = useState(false);
    const [question, setQuestion] = useState(false);
    const [avatar, setAvatar] = useState('');
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    
    useEffect(() => {
        const fetchUserData = async () => {
            console.log('ID do Grupo: ', selectedGroupId);
            
            try {
                const response = await api.get(`/teams/group/${selectedGroupId}`, {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                });
    
                console.log('Times: ', response.data.records);
    
                // Filtrando times distintos
                const uniqueTeams = response.data.records.reduce((acc: TeamProps[], team: TeamProps) => {
                    if (!acc.find(t => t.id === team.id)) {
                        acc.push(team);
                    }
                    return acc;
                }, []);
    
                const responseTeamConfirm = await api.get(`/player-matches/match/${selectedEvent}`, {
                    headers: {
                        Authorization: `Bearer ${user?.access_token}`,
                    },
                });
    
                console.log('===========================');
                console.log('Times escalados: ', responseTeamConfirm.data);
                console.log('===========================');
    
                setTeamsConfirm(responseTeamConfirm.data.teams);
                setPlayersConfirm(responseTeamConfirm.data.users);
                
            } catch (error) {
                console.log('Erro ao carregar lista de times');
            }
        };
    
        fetchUserData();
    }, [me, user?.access_token]);

    function closeModal() {
        setModalMatchTeam(false)
        setOverlay(false)
    }

    function clickEvaluation(id: string, name: string, avatar: string) {
        setStepOne(false)
        setStepTwo(true)
        setId(id)
        setAvatar(avatar)
        setName(name)
    }

    return (
        <>
            {stepOne && (
                <StepOneModal 
                    teamsConfirm={teamsConfirm}
                    playerConfirm={playerConfirm}
                    clickEvaluation={clickEvaluation}
                    closeModal={closeModal}
                    setStepOne={setStepOne}
                    setStepTwo={setStepTwo} 
                    setStepThree={setStepThree}
                    setQuestion={setQuestion}
                />               
            )}

            {stepTwo && (
                <StepTwoModal
                    closeModal={closeModal}
                    name={name}
                    avatar={avatar}
                    setStepOne={setStepOne}
                    setStepTwo={setStepTwo} 
                    id={id} 
                    selectedEvent={selectedEvent}
                />     
            )}
            {stepThree && (
                <StepThreeModal closeModal={closeModal} />  
            )}

            {question && (
                <Question 
                    closeModal={closeModal} 
                    setStepOne={setStepOne}
                    setQuestion={setQuestion}
                    playerConfirm={playerConfirm}
                    selectedEvent={selectedEvent}
                />
            )}
        </>
        
    )
}