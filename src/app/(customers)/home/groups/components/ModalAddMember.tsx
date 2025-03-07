import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import MLInput from "components/molecule/input";
import { useFormik } from "formik";
import api from "services/api";
import * as yup from "yup";

interface ModalAddMemberProps {
  setModalCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  setModalPrevious: React.Dispatch<React.SetStateAction<boolean>>; // Novo: modal anterior
  groupId: string;
  token: string;
}

export default function ModalAddMember({
  setModalCreate,
  setOverlay,
  setModalPrevious, // Recebido como prop
  groupId,
  token,
}: ModalAddMemberProps) {
  const {
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    errors,
    touched,
    values,
  } = useFormik({
    initialValues: { user_id: "", function: "user" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post(
          `/group-members`,
          { group_id: groupId, ...values },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast({
          title: "Cadastrado membro com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
        resetForm();

        // Fechar o modal atual e o modal anterior
        setModalCreate(false);
        setOverlay(false);
        setModalPrevious(false); // Fechar o modal anterior
      } catch (error) {
        toast({
          title: "Erro ao adicionar membro ao grupo!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top"
        });
      }
    },
  });

  const toast = useToast();

  function closeModal() {
    setModalCreate(false);
    setOverlay(false);
    setModalPrevious(false); // Fechar o modal anterior ao cancelar também
  }

  return (
    <Flex
      position={"absolute"}
      w={{ base: "100%", sm: "95%" }}
      h={{ base: "90%", sm: "77%" }}
      bg={"#0c0c32"}
      left={0}
      zIndex={600}
      rounded={"2xl"}
      direction={"column"}
    >
      <Flex justifyContent={"center"} alignItems={"center"} direction={"column"} gap={4} mt={4}>
        <Text fontSize={"2xl"} fontWeight={"semibold"} color={"#b9fa3c"} textAlign={"center"}>
          Adicione um novo membro ao grupo
        </Text>

        <Box w={{ base: "90%", sm: "80%" }} mt={"2em"}>
          <MLInput
            name="user_id"
            label="ID do usuário"
            placeholder="Insira o ID do usuário"
            isRequired={true}
            value={values.user_id}
            w={"100%"}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.user_id && errors.user_id}
            color={"#b9fa3c"}
          />
        </Box>

        <Box w={{ base: "90%", sm: "80%" }}>
          <MLInput
            name="function"
            label="Função do usuário"
            placeholder="Insira a função do membro (ex: user)"
            isRequired={true}
            value={values.function}
            w={"100%"}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.function && errors.function}
            color={"#b9fa3c"}
          />
        </Box>

        <Button
          mt={"2em"}
          bg={"#b9fa3c"}
          onClick={() => handleSubmit()}
          isLoading={isSubmitting}
        >
          Adicionar
        </Button>
      </Flex>
    </Flex>
  );
}

const validationSchema = yup.object({
  user_id: yup.string().required("O ID do usuário é obrigatório"),
  function: yup.string().required("A função é obrigatória"),
});
