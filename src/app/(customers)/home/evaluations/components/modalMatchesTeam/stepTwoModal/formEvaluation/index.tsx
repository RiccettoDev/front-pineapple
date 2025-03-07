import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { MLInput } from "components";
import { useAuth } from "contexts/auth.context";
import { useFormik } from "formik";
import api from "services/api";
import * as yup from "yup";

interface ModalProps {
    id: string;
    selectedEvent: string;
    setStepOne: React.Dispatch<React.SetStateAction<boolean>>;
    setStepTwo: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormValues {
    match_id: string,
    evaluator_id: string,
    evaluated_id: string,
    vigor: number,
    speed: number,
    dribbling: number,
    shooting: number,
    attack: number,
    defense: number,
    passing: number,
    heading: number
}

const INITIAL_VALUES = {
    match_id: '',
    evaluator_id: '',
    evaluated_id: '',
    vigor: 0,
    speed: 0,
    dribbling: 0,
    shooting: 0,
    attack: 0,
    defense: 0,
    passing: 0,
    heading: 0   
}

export default function FormEvaluation({ id, selectedEvent, setStepOne, setStepTwo }: ModalProps) {

    const toast = useToast();
    const { user, me } = useAuth();
    const idUser = user.id

    const onSubmit = async (values: FormValues) => {
        try {
            // Preparar o payload com os dados que você quer atualizar
            const payload = {
                match_id: selectedEvent,
                evaluator_id: id,
                evaluated_id: idUser,
                vigor: Number(values.vigor),
                speed: Number(values.speed),
                dribbling: Number(values.dribbling),
                shooting: Number(values.shooting),
                attack: Number(values.attack),
                defense: Number(values.defense),
                passing: Number(values.passing),
                heading: Number(values.heading)  
            };
        
            // Enviar a requisição POST para a API com o token no cabeçalho
            const response = await api.post(
              `/player-evaluations`,
              payload,
              {
                headers: {
                  Authorization: `Bearer ${user?.access_token}`, // Adiciona o token no cabeçalho Authorization
                },
              }
            );
        
            // Se a requisição for bem-sucedida, você pode fazer algo, como mostrar uma mensagem de sucesso
            console.log("Jogador avaliado com sucesso:", response.data);

            setStepOne(true)
            setStepTwo(false)

            toast({
                title: "Avaliação cadastrada com sucesso!",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "top"
              });
            
          } catch (error) {
            console.error("Erro ao avaliar jogador:", error);
            toast({
                title: "Erro ao cadastrar avaliação!",
                status: "error",
                duration: 3000,
                isClosable: true,
                position: "top"
              });
            // Caso ocorra algum erro, você pode exibir uma mensagem de erro ou tomar alguma ação
          }
    }

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

    function returnStep() {
        setStepOne(true); // Torna o StepOne visível
        setStepTwo(false); // Oculta o StepTwo
    }

    return (
        <Flex w={'100%'} direction={"column"} justifyContent={"center"} alignItems={"center"}>
            <Flex direction={{base:"column", md:"row"}} gap={10} w={'80%'} mt={'1em'}>
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="vigor"
                        label="vigor"
                        placeholder="Insira o valor do vigor"
                        isRequired={true}
                        value={values.vigor}
                        w={"100%"}
                        onChange={(e) => setFieldValue("vigor", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.vigor && errors.vigor}
                    />
                </Box>
                
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="speed"
                        label="speed"
                        placeholder="Insira o valor do speed"
                        isRequired={true}
                        value={values.speed}
                        w={"100%"}
                        onChange={(e) => setFieldValue("speed", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.speed && errors.speed}
                    />
                </Box>
            </Flex>
            
            <Flex direction={{base:"column", md:"row"}} gap={10} w={'80%'} mt={'1em'}>
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="dribbling"
                        label="dribbling"
                        placeholder="Insira o valor do dribbling"
                        isRequired={true}
                        value={values.dribbling}
                        w={"100%"}
                        onChange={(e) => setFieldValue("dribbling", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.dribbling && errors.dribbling}
                    />
                </Box>
                
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="shooting"
                        label="shooting"
                        placeholder="Insira o valor do shooting"
                        isRequired={true}
                        value={values.shooting}
                        w={"100%"}
                        onChange={(e) => setFieldValue("shooting", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.shooting && errors.shooting}
                    />
                </Box>
            </Flex>
            
            <Flex direction={{base:"column", md:"row"}} gap={10} w={'80%'} mt={'1em'}>
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="attack"
                        label="attack"
                        placeholder="Insira o valor do attack"
                        isRequired={true}
                        value={values.attack}
                        w={"100%"}
                        onChange={(e) => setFieldValue("attack", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.attack && errors.attack}
                    />
                </Box>
                
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="defense"
                        label="defense"
                        placeholder="Insira o valor do defense"
                        isRequired={true}
                        value={values.defense}
                        w={"100%"}
                        onChange={(e) => setFieldValue("defense", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.defense && errors.defense}
                    />
                </Box>
            </Flex>
            
            <Flex direction={{base:"column", md:"row"}} gap={10} w={'80%'} mt={'1em'}>
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="passing"
                        label="passing"
                        placeholder="Insira o valor do passing"
                        isRequired={true}
                        value={values.passing}
                        w={"100%"}
                        onChange={(e) => setFieldValue("passing", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.passing && errors.passing}
                    />
                </Box>
                
                <Box w={{ base: "100%", sm: "100%" }}>
                    <MLInput
                        name="heading"
                        label="heading"
                        placeholder="Insira o valor do heading"
                        isRequired={true}
                        value={values.heading}
                        w={"100%"}
                        onChange={(e) => setFieldValue("heading", e.target.value)}
                        onBlur={handleBlur}
                        error={touched.heading && errors.heading}
                    />
                </Box>
            </Flex>
            <Flex w={'100%'} justifyContent={"space-between"} p={4} mt={'2em'}> 
                <Button
                    bg={'#b9fa3c'}
                    onClick={() => returnStep()}
                >
                    Voltar
                </Button>
                
                <Button
                    bg={'#b9fa3c'}
                    onClick={() => handleSubmit()}
                >
                    Salvar
                </Button>
            </Flex>
        </Flex>
    )
}

const validationSchema = yup.object({
    vigor: yup.string().required("campo obrigatório"),
    speed: yup.string().required("campo obrigatório"),
    dribbling: yup.string().required("campo obrigatório"),
    shooting: yup.string().required("campo obrigatório"),
    attack: yup.string().required("campo obrigatório"),
    defense: yup.string().required("campo obrigatório"),
    passing: yup.string().required("campo obrigatório"),
    heading: yup.string().required("campo obrigatório"),
  });