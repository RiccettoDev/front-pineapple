"use client";
import { Box, Button, Flex, Link, Stack, Text, VStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import Image from 'next/image';
import { useContext } from "react";
import * as yup from "yup";

import { ErrorMessages } from "assets/config";
import { MLInput } from "components";
import { AuthContext } from "contexts/auth.context";
import { AuthValuesProps } from "interfaces/pages/auth";

import Panel from "components/atomic/panel";
import Logo from "../../../../public/logo.png";
import googleIcon from "../../../img/auth/devicon_google.png";

const INITIAL_VALUES = {
  email: "",
  password: "",
};

export default function AuthPage() {
  const { sign } = useContext(AuthContext);

  const onSubmit = async (values: AuthValuesProps) => {
    await sign({
      email: values.email,
      password: values.password,
    });

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

  return (
    <Panel w={{ base: '100%', sm: 500 }} h={{base:'100%', sm:'100%'}} zIndex={200} alignItems={"center"} bg={'#0c0c32'}>
      <Flex w={"100%"} justifyContent={"center"} mt={'-3em'} mb={'-2em'} >
        <Image width={300} height={43} src={Logo.src} alt="logo" />
      </Flex>

      <Text
        fontFamily="Montserrat"
        fontSize="39px" 
        fontWeight="600"
        lineHeight={"47px"}
        color="#b9fa3c"
        textAlign={"center"}
      >
        Bem-vindo!
      </Text>
      
      <Text
        mt={"1em"}
        mb={{base:"1em", sm:"2em"}}
        fontFamily="Montserrat"
        fontSize="16px" 
        fontWeight="400"
        lineHeight={"24px"}
        color="#b9fa3c"
        textAlign={"center"}
      >
        Acesse sua conta inserindo seu e-mail e senha. 
      </Text>

      <Stack spacing={4} w={{base:"95%",sm:"80%"}} alignItems={"center"} >
        <MLInput
          name="email"
          value={values.email}
          label="E-mail"
          isRequired={true}
          onChange={(e) => setFieldValue("email", e.target.value)}
          onBlur={handleBlur}
          error={touched.email && errors.email}
          color={"#b9fa3c"}
        />
        <MLInput
          name="password"
          type="password"
          label="Senha"
          isRequired={true}
          onChange={handleChange}
          onBlur={handleBlur}
          color={"#b9fa3c"}
          error={touched.password && errors.password}
        />

        <Link 
          href="auth/passwordRecovery" 
          mt={"0.5em"} 
          w={"100%"} 
          display={"flex"} 
          justifyContent={"center"} 
          alignItems={"center"}
          gap={{base:2, sm:6}}
        >
          <Box w={{base:"10%",sm:"20%"}} h={"1px"} border={"1px solid #E3E3E3"} />
          <Text
            cursor="pointer"
            fontSize="14px"
            textAlign="right"
            color={'#b9fa3c'}
            _hover={{ color: "#FFFFFF" }}
          >
            Esqueceu sua senha?
          </Text>
          <Box w={{base:"10%",sm:"20%"}} h={"1px"} border={"1px solid #E3E3E3"} />
        </Link>

      </Stack>

      <VStack gap={4} w={"100%"}>
        <Button
            mt={{base:"0.8em", sm:"2em"}}
            background={'#b9fa3c'}
            color={'#0c0c32'}
            w={{base:'100%', sm:'80%'}}
            h={'45px'}
            fontWeight="600"
            fontSize="20px"
            isLoading={isSubmitting}
            onClick={() => handleSubmit()}
        >
            <Text fontWeight={"semibold"}>
              Acessar
            </Text>
        </Button>
        <Button
            leftIcon={
              <Box>
                <Image src={googleIcon} alt="logo google" />
              </Box>
            }
            gap={{base:4, sm:10}}
            justifyContent={"start"}
            bg={"#b9fa3c"}
            color={'#0c0c32'}
            border={"1px solid red"}
            w={{base:'100%', sm:'80%'}}
            h={'45px'}
            fontWeight="600"
            fontSize="16px"
            isLoading={isSubmitting}
            onClick={() => handleSubmit()}
        >
            <Text fontWeight={"semibold"}>
              Login com o Google
            </Text>
        </Button>
      </VStack>

      <Link href="register" mt={{base:"0.5em", sm:"2em"}}>
        <Text
          cursor="pointer"
          fontSize="14px"
          textAlign="right"
          color={'#b9fa3c'}
          _hover={{ color: "#FFFFFF" }}
        >
          Não possui conta? Cadastre-se
        </Text>
        <Box mt={"0.5em"} w={"100%"} h={"1px"} border={"1px solid #E3E3E3"} />
      </Link>
    </Panel>
  );
}

const validationSchema = yup.object({
  email: yup.string().email(ErrorMessages.email).required(ErrorMessages.required),
  password: yup.string().required().required(ErrorMessages.required),
});
