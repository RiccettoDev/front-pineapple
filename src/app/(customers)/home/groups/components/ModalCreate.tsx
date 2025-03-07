import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import MLInput from "components/molecule/input";
import { useFormik } from "formik";
import api from "services/api";
import * as yup from "yup";

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

interface ModalCreateProps {
  setModalCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setOverlay: React.Dispatch<React.SetStateAction<boolean>>;
  token: string;
  id: string;
  setUserData: React.Dispatch<React.SetStateAction<UserProps | null>>;
}

interface FormValues {
  name: string;
  logo?: string;
  admin_id: string;
}

const INITIAL_VALUES: FormValues = {
  name: "",
  logo: "",
  admin_id: "",
};

export default function ModalCreate({
  setModalCreate,
  setOverlay,
  token,
  id,
  setUserData,
}: ModalCreateProps) {
  const toast = useToast();

  const onSubmit = async (values: FormValues) => {
    values.admin_id = id;
    try {
      const response = await api.post(`/groups`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const groupId = response.data.id;

      const PayloadGroupMembers = {
        group_id: groupId,
        user_id: values.admin_id,
        function: "admin",
      };

      await api.post('group-members', PayloadGroupMembers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: "Grupo cadastrado com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      setModalCreate(false);
      setOverlay(false);

      const updatedUserData = await api.get(`/users/${id}`);
      setUserData(updatedUserData.data);
    } catch (error) {
      toast({
        title: "Erro ao cadastrar grupo.",
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
    isSubmitting,
    errors,
    touched,
    values,
  } = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    onSubmit,
  });

  function closeModal() {
    setModalCreate(false);
    setOverlay(false);
  }

  return (
    <>
      <Flex justifyContent={"center"} alignItems={"center"} direction={"column"} gap={4} mt={4}>
        <Text fontSize={"2xl"} fontWeight={"semibold"} color={'#b9fa3c'} textAlign={"center"}>
          Crie aqui o seu grupo de peladeiros!
        </Text>

        <Box w={{ base: '100%', sm: '80%' }} mt={'2em'}>
          <MLInput
            name="text"
            label="nome"
            placeholder="Insira o nome do grupo"
            isRequired={true}
            value={values.name}
            w={"100%"}
            onChange={(e) => setFieldValue("name", e.target.value)}
            onBlur={handleBlur}
            error={touched.name && errors.name}
            color={'#b9fa3c'}
          />
        </Box>

        <Button mt={'2em'} bg={'#b9fa3c'} onClick={() => handleSubmit()}>
          Criar
        </Button>
      </Flex>
    </>
  );
}

const validationSchema = yup.object({
  name: yup.string().required("Nome é obrigatório"),
});