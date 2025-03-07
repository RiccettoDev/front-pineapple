import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { ErrorMessages } from "assets/config";
import { MLInput } from "components";
import { useAuth } from "contexts/auth.context";
import { useFormik } from "formik";
import api from "services/api";
import * as yup from "yup";

interface ModalProps {
    setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    setModalCreateTeam: React.Dispatch<React.SetStateAction<boolean>>;
    selectedGroupId: string;
}

interface TeamProps {
    group_id: string;
    name: string;
    max_members: string;
}

const INITIAL_VALUES = {
    group_id: '',
    name: '',
    max_members: 0,
};

export default function ModalCreateTeam({ setModalCreateTeam, setOverlay, selectedGroupId }: ModalProps) {
    const toast = useToast();
    const { user, me } = useAuth();

    const onSubmit = async (values: typeof INITIAL_VALUES) => {
        try {
            const payload = {
                group_id: selectedGroupId,
                name: values.name,
                max_members: Number(values.max_members),
            };

            const response = await api.post(`/teams`, payload, {
                headers: {
                    Authorization: `Bearer ${user?.access_token}`,
                },
            });

            toast({
                title: "Time cadastrado com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top",
            });

            closeModal();
        } catch (error) {
            toast({
                title: "Erro ao adicionar membro ao grupo!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top",
            });
        }
    };

    const {
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        errors,
        touched,
        values,
    } = useFormik({
        initialValues: INITIAL_VALUES,
        validationSchema,
        onSubmit,
    });

    function closeModal() {
        setModalCreateTeam(false);
        setOverlay(false);
    }

    return (
        <>
            <Flex w={'100%'} direction={"column"} mt={'-3em'}>
                <Flex w={'100%'} justifyContent={"center"}>
                    <Box w={'90%'} h={'1px'} bg={'#b9fa3c'} mt={'1em'} />
                </Flex>

                <Flex w={{ base: "100%", sm: "100%" }} direction={"column"} justifyContent={"center"} alignItems={"center"} mt={'2em'} p={10} gap={6}>
                    <MLInput
                        name="name"
                        label="Nome"
                        placeholder="Insira o nome do time"
                        isRequired={true}
                        value={values.name}
                        w={"100%"}
                        onChange={(e) => setFieldValue("name", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.name && errors.name}
                    />

                    <MLInput
                        name="max_members"
                        label="Quantidade máxima de membros do time"
                        placeholder="Insira a quantidade de jogadores"
                        isRequired={true}
                        value={values.max_members}
                        w={"100%"}
                        onChange={(e) => setFieldValue("max_members", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.max_members && errors.max_members}
                    />

                    <Button
                        mt={'2em'}
                        w={'80%'}
                        bg={'#b9fa3c'}
                        color={'#0c0c32'}
                        fontWeight={"bold"}
                        onClick={() => handleSubmit()}
                    >
                        Salvar
                    </Button>
                </Flex>
            </Flex>
        </>
    );
}

const validationSchema = yup.object({
    name: yup.string().required(ErrorMessages.required),
    max_members: yup.string().required(ErrorMessages.required),
});