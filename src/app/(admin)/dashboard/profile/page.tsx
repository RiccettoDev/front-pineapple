"use client";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useFormik } from "formik";
import InputMask from "react-input-mask";
import * as yup from "yup";

import { ATPanel, MLInput } from "components";
import { useAuth } from "contexts/auth.context";
import { useEffect, useState } from "react";
import api from "services/api";

interface FormValues {
  email: string;
  password: string;
  role: string;
  name: string;
  phone: string;
  birth_date: string;
  avatar?: string;
}

const INITIAL_VALUES: FormValues = {
  email: "",
  password: "",
  role: "",
  name: "",
  phone: "",
  birth_date: "",
  avatar: "",
};

export default function Profile() {
  const { user, me } = useAuth();
  const [userData, setUserData] = useState<FormValues | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      // Preparar o payload com os dados que você quer atualizar
      const payload = {
        email: values.email,
        password: values.password,
        role: values.role,
        name: values.name,
        phone: values.phone,
        birth_date: values.birth_date,
      };
  
      // Enviar a requisição PUT para a API com o token no cabeçalho
      const response = await api.put(
        `/users/${user?.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.access_token}`, // Adiciona o token no cabeçalho Authorization
          },
        }
      );
  
      // Se a requisição for bem-sucedida, você pode fazer algo, como mostrar uma mensagem de sucesso
      console.log("Usuário atualizado com sucesso:", response.data);
      
      // Se você precisar atualizar o estado ou recarregar os dados do usuário
      setUserData(response.data);
    } catch (error) {
      console.error("Erro ao atualizar o usuário:", error);
      // Caso ocorra algum erro, você pode exibir uma mensagem de erro ou tomar alguma ação
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

  // 2. Busca os detalhes do usuário da API quando o user.id estiver disponível
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.id) return; // Garante que só executa se o ID do usuário existir

      try {
        const response = await api.get(`/users/${user.id}`); // Requisição GET para a API com o ID

        // Salva os dados no estado
        setUserData(response.data);

        // Preenche os campos do formulário com os dados do usuário
        setFieldValue("name", response.data.name);
        setFieldValue("email", response.data.email);
        setFieldValue("phone", response.data.phone);
        setFieldValue("birth_date", response.data.birth_date);
        setFieldValue("role", response.data.role);

        setAvatar(response.data.avatar);

      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserDetails();
  }, [user?.id, setFieldValue]); // Observa `user?.id` para garantir que a requisição só ocorre quando o ID do usuário está disponível
  
  return (
    <>
      <ATPanel
        w={"100%"}
        h={"100%"}
        bg={"#1f6027"}
        direction={"column"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex
          w={250}
          h={250}
          bg={"yellow"}
          rounded={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          overflow="hidden" // Garante que qualquer parte da imagem que ultrapasse o contêiner seja escondida
        >
          {avatar ? (
            <img
              src={avatar}
              alt="avatar"
              width="100%" // Faz a imagem ocupar toda a largura do contêiner
              height="100%" // Faz a imagem ocupar toda a altura do contêiner
              style={{ objectFit: "cover" }} // Garantindo que a imagem preencha o contêiner sem distorcer
            />
          ) : (
            <Text color={'#000000'}>No avatar available</Text>
          )}
        </Flex>

        {/* Formulário */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent={"center"}
          alignItems={"end"}
          w={"100%"}
          mt={"2em"}
          gap={10}
        >
          <Box w={{ base: "100%", sm: "30%" }}>
            <MLInput
              name="name"
              label="Nome"
              placeholder="Insira seu nome completo"
              isRequired={true}
              value={values.name}
              w={"100%"}
              onChange={(e) => setFieldValue("name", e.target.value)}
              onBlur={handleBlur}
              error={touched.name && errors.name}
            />
          </Box>

          <Box w={{ base: "100%", sm: "30%" }}>
            <Text color={'#b9fa3c'} mb={1}>Nascimento</Text> {/* Substituindo o label do MLInput por um Text */}
            <InputMask
              mask="9999-99-99" // Máscara no formato AAAA-MM-DD
              value={values.birth_date}
              onChange={(e) => setFieldValue("birth_date", e.target.value)}
            >
              {(inputProps: any) => (
                <MLInput
                  {...inputProps} // Passa as propriedades do InputMask para o MLInput
                  name="birth_date"
                  placeholder="Insira sua data de nascimento"
                  isRequired={false}
                  error={touched.birth_date && errors.birth_date}
                  // O onBlur será tratado pelo InputMask, então removemos aqui
                />
              )}
            </InputMask>
          </Box>

        </Flex>

        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent={"center"}
          mt={"2em"}
          w={"100%"}
          gap={10}
        >
          <Box w={{ base: "100%", sm: "30%" }}>
            <MLInput
              name="email"
              label="E-mail"
              placeholder="Insira seu e-mail"
              isRequired={true}
              value={values.email}
              w={"100%"}
              onChange={(e) => setFieldValue("email", e.target.value)}
              onBlur={handleBlur}
              error={touched.email && errors.email}
            />
          </Box>
          <Box w={{ base: "100%", sm: "30%" }}>
            <MLInput
              name="phone"
              label="Celular"
              placeholder="Insira seu número de celular"
              isRequired={true}
              value={values.phone}
              w={"100%"}
              onChange={(e) => setFieldValue("phone", e.target.value)}
              onBlur={handleBlur}
              error={touched.phone && errors.phone}
            />
          </Box>
        </Flex>

        <Flex
          direction={{ base: "column", sm: "row" }}
          justifyContent={"center"}
          alignItems={"end"}
          w={"100%"}
          mt={"2em"}
          gap={10}
        >
          <Box w={{ base: "100%", sm: "30%" }}>
            <MLInput
              name="password"
              label="Senha"
              placeholder="Insira sua senha"
              isRequired={true}
              value={values.password}
              w={"100%"}
              onChange={(e) => setFieldValue("password", e.target.value)}
              onBlur={handleBlur}
              error={touched.password && errors.password}
            />
          </Box>

          <Box w={{ base: "100%", sm: "30%" }}>
            <Button
              w={"100%"}
              h={'45px'}
              bg={'#b9fa3c'}
              color={'#0c0c32'}
              fontWeight={'bold'}
              isLoading={isSubmitting}
              onClick={() => handleSubmit()}
            >
              Enviar
            </Button>
          </Box>
        </Flex>
      </ATPanel>
    </>
  );
}

const validationSchema = yup.object({
  email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
  role: yup.string().required("Tipo de usuário é obrigatório"),
  name: yup.string().required("Nome é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
});
