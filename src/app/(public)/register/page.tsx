"use client";

import { Box, Button, Flex, FormControl, FormLabel, Link, Select, Text, useToast } from "@chakra-ui/react";
import { MLInput } from "components";
import Panel from "components/atomic/panel";
import { useFormik } from "formik";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import InputMask from 'react-input-mask'; // Importa o InputMask
import api from "services/api";
import * as yup from "yup";


import logo from "../../../../public/logo.png";

interface FormValues {
    email: string;
    password: string;
    role: string;
    name: string;
    phone: string;
}

const INITIAL_VALUES: FormValues = {
    email: "",
    password: "",
    role: "",
    name: "",
    phone: "",
};

export default function Register() {
    const toast = useToast();
    const router = useRouter();

    const onSubmit = async (values: FormValues) => {
        const sanitizedValues = {
          ...values,
          phone: values.phone.replace(/\D/g, ""), // Remove todos os caracteres não numéricos do telefone
        };
        console.log("Dados que serão enviados para a API:", sanitizedValues);
    
        try {
          // Envia os dados para a API via POST
          const response = await api.post("http://localhost:8080/users", sanitizedValues);
          console.log("Resposta da API:", response.data);
          toast({
            title: "Cadastrado com sucesso!",
            description: "Seu cadastro foi realizado com sucesso.",
            status: "success",
            duration: 3000,
            isClosable: true,
            position: "top"
          });
          // Aqui você pode adicionar um redirect ou uma mensagem de sucesso, dependendo da resposta da API
          router.push("/auth");
        } catch (error) {
          console.error("Erro ao enviar dados para a API:", error);
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

    // Usamos InputMask para aplicar a máscara no campo telefone
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue("phone", e.target.value); // Atualiza o valor mascarado no formulário
    };

    return (
        <Panel w={{ base: '95%', md: "70%" }} minHeight={{ base: "100vh", sm: "90%" }} mt={"2em"} zIndex={200} p={6} bg={'#0c0c32'}>
            <Flex w={"100%"} mt={'-2em'} mb={'-4em'} direction={{ base: "column", sm: "row" }} justifyContent={"center"} alignItems={"center"}>
                <Image width={300} src={logo} alt="logo" />
                <Flex direction={"column"} justifyContent={"center"} w={{md:"50%"}} mb={{base:"2em", sm:"0"}}>
                    <Box>
                        <Text
                            fontFamily="Montserrat"
                            fontSize="39px" 
                            fontWeight="600"
                            lineHeight={"47px"}
                            color="#b9fa3c"
                            textAlign={"center"}
                        >
                            Registre sua conta
                        </Text>
                        
                        <Text
                            mt={"1em"}
                            fontFamily="Montserrat"
                            fontSize="13px" 
                            fontWeight="400"
                            lineHeight={"15.85px"}
                            color="#b9fa3c"
                            textAlign={"center"}
                        >
                            Insira as informações solicitadas abaixo, para registrar uma nova conta. 
                        </Text>
                    </Box>
                </Flex>
            </Flex>

            <Flex mt={{base:'2em', sm:"0.5em"}} direction={"column"} justifyContent={"start"} gap={2}>
                <Text
                    mt={"1.5em"}
                    fontFamily="Montserrat"
                    fontSize="16px" 
                    fontWeight="400"
                    lineHeight={"24px"}
                    color="#FFFFFF"
                >
                    Dados de usuário
                </Text>
                <Box w={"100%"} h={"1px"} border={"1px solid #E3E3E3"} mb={"0.5em"} />

                <Flex gap={8} direction={{ base: "column", sm: "row" }}>
                    <Box w={{ base: '100%', sm: '30%' }}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="role" color={'#b9fa3c'}>Tipo de usuário</FormLabel>
                            <Select
                                name="role"
                                id="role"
                                placeholder="Selecione o tipo de usuário"
                                value={values.role}
                                onChange={(e) => setFieldValue("role", e.target.value)}
                                onBlur={handleBlur}
                                bg="#0c0c32"
                                color="white"
                                _hover={{ bg: "#40407a" }}
                                _focus={{ bg: "#3c40c6", borderColor: "#b9fa3c" }}
                                _placeholder={{ color: "#d2dae2" }}
                                sx={{
                                    option: {
                                        background: "#2c2c54",
                                        color: "#ffffff",
                                    },
                                }}
                            >
                                <option value="admin">Administrador</option>
                                <option value="user">Usuário</option>
                            </Select>

                            {touched.role && errors.role && (
                                <Text color="red.500" fontSize="sm">{errors.role}</Text>
                            )}
                        </FormControl>
                    </Box>
                </Flex>
                
                <Text
                    mt={"1.5em"}
                    fontFamily="Montserrat"
                    fontSize="16px" 
                    fontWeight="400"
                    lineHeight={"24px"}
                    color="#FFFFFF"
                >
                    Dados pessoais
                </Text>
                <Box w={"100%"} h={"1px"} border={"1px solid #E3E3E3"} mb={"0.5em"} />

                <Flex gap={8} direction={{ base: "column", sm: "row" }}>
                    <Box w={{ base: '100%', sm: '30%' }}>
                        <MLInput
                            name="text"
                            label="nome"
                            placeholder="Insira seu nome completo"
                            isRequired={true}
                            value={values.name}
                            w={"100%"}
                            onChange={(e) => setFieldValue("name", e.target.value)}
                            onBlur={handleBlur}
                            error={touched.name && errors.name}
                        />
                    </Box>
                    <Box w={{ base: '100%', sm: '30%' }}>
                        <FormControl isRequired>
                            <FormLabel htmlFor="phone" color={'#b9fa3c'}>Telefone</FormLabel>
                            {/* Usando InputMask para máscara */}
                            <InputMask
                                mask="(99) 99999-9999"
                                value={values.phone}
                                onChange={handlePhoneChange}
                            >
                                {(inputProps: any) => <MLInput {...inputProps} />}
                            </InputMask>
                            {touched.phone && errors.phone && (
                                <Text color="red.500" fontSize="sm">{errors.phone}</Text>
                            )}
                        </FormControl>
                    </Box>
                </Flex>
                
                <Text
                    mt={"1.5em"}
                    fontFamily="Montserrat"
                    fontSize="16px" 
                    fontWeight="400"
                    lineHeight={"24px"}
                    color="#FFFFFF"
                >
                    Dados de acesso
                </Text>
                <Box w={"100%"} h={"1px"} border={"1px solid #E3E3E3"} mb={"0.5em"} />

                <Flex gap={8} direction={{ base: "column", sm: "row" }}>
                    <Box w={{ base: '100%', sm: '30%' }}>
                        <MLInput
                            name="text"
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
                    <Box w={{ base: '100%', sm: '30%' }}>
                        <MLInput
                            name="password"
                            type="password"
                            label="Senha"
                            isRequired={true}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.password && errors.password}
                        />
                    </Box>
                </Flex>

                <Flex direction={{base: "column-reverse", sm: "row"}} justifyContent={"space-between"}>
                    <Link href="auth/" mt={{ base: "1em", sm: "2em" }} w={{base:'100%', sm:'10%'}} display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'}>
                        <Text
                            cursor="pointer"
                            fontSize="14px"
                            textAlign="left"
                            color={'#b9fa3c'}
                            _hover={{ color: "#FFFFFF" }}
                        >
                            voltar
                        </Text>
                        <Box mt={"0.5em"} w={"100%"} h={"1px"} border={"1px solid #E3E3E3"} />
                    </Link>

                    <Button
                        mt={{base:"2em", sm:"2em"}}
                        background={'#b9fa3c'}
                        color={'#0c0c32'}
                        w={{base:'100%', sm:'20%'}}
                        h={'45px'}
                        fontWeight="600"
                        fontSize="16px"
                        isLoading={isSubmitting}
                        onClick={() => handleSubmit()}
                    >
                        Avançar
                    </Button>
                </Flex>
            </Flex>
        </Panel>
    );
}

const validationSchema = yup.object({
    email: yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
    password: yup.string().required("Senha é obrigatória"),
    role: yup.string().required("Tipo de usuário é obrigatório"),
    name: yup.string().required("Nome é obrigatório"),
    phone: yup.string().required("Telefone é obrigatório"),
});
