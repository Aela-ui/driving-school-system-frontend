import React from 'react';
import { useState, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { findAllRoles } from '../../api/apiRole';
import { createUser } from '../../api/apiUser';
import {
    NativeBaseProvider,
    Box,
    Center,
    Heading,
    Input,
    FormControl,
    Button,
    VStack,
    Select,
    WarningOutlineIcon,
    CheckIcon,
    AlertDialog,
} from 'native-base';

export const SignUp=({ navigation })=> {
    const [email, setEmail] = useState('');
    const [cpf, setCpf] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [funcao, setFuncao] = useState(0);
    const [roles, setRoles] = useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenError, setIsOpenError] = React.useState(false);
    const onClose = () => setIsOpen(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createUser({email, nome, cpf, telefone, funcao});

            let{message, payload} = response.data;

            if(response.status !== 201){
                setIsOpenError(true);
            }else{
                setIsOpen(true)
            }  
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const callApiFindAllRoles = async () =>{
            const response = await findAllRoles();
            let{message, payload} = response.data;

            if(response.status !== 200) throw Error(message);
            setRoles(payload);
        }
        try {
            callApiFindAllRoles();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handleChangeEmail = text => setEmail(text);
    const handleChangeCpf = text => setCpf(text);
    const handleChangeNome = text => setNome(text);
    const handleChangeTelefone = text => setTelefone(text);

    return(
        <NativeBaseProvider>
           <LinearGradient colors={['#8991DC', '#494C73']} > 
                <Center
                    height="full"
                >

                    <Heading mr={225} color="white" fontSize="3xl" m="6">
                        Cadastro
                    </Heading>
                    <VStack  width="80" backgroundColor="white" borderRadius={3} shadow={4}>
                        <Box p="8" >

                            <FormControl isRequired>
                                <FormControl.Label>E-mail</FormControl.Label>
                                <Input
                                    onChangeText={handleChangeEmail}
                                    variant="underlined"
                                >     
                                </Input>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                        Usuário inválido
                                    </FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label mt={5}>Nome</FormControl.Label>
                                <Input
                                    onChangeText={handleChangeNome}
                                    variant="underlined"
                                >     
                                </Input>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                        Inválido
                                    </FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl isRequired>
                                <FormControl.Label mt={5}>CPF</FormControl.Label>
                                <Input
                                    onChangeText={handleChangeCpf}
                                    placeholder="000.000.000-00"
                                    variant="underlined"
                                >     
                                </Input>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                        Inválido
                                    </FormControl.ErrorMessage>
                            </FormControl>


                            <FormControl isRequired>
                                <FormControl.Label mt={5}>Telefone</FormControl.Label>
                                <Input
                                    onChangeText={handleChangeTelefone}
                                    placeholder="00 0000-0000"
                                    variant="underlined"
                                >     
                                </Input>
                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                        Inválido
                                    </FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl w="3/4" maxW="300" isRequired isInvalid>
                                <FormControl.Label>Função</FormControl.Label>
                                    <Select onValueChange={itemValue=>setFuncao(itemValue)} minWidth="200" accessibilityLabel="Escolha a Função" placeholder="Função" _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size={5} />
                                }} mt="1">
                                        {roles.map(role=>(
                                            <Select.Item key={role.roleId} label={role.name} value={role.roleId} /> 
                                        ))}
                                    </Select>

                                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                        Por favor selecione uma função!
                                    </FormControl.ErrorMessage>
                            </FormControl>

                        </Box>
                        <Button onPress={handleSubmit}
                            p="5"
                            borderRadius={3}
                            colorScheme="violet">
                            Cadastrar
                        </Button>

                        <AlertDialog isOpen={isOpen} onClose={onClose}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Cadastro de Usuário</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Cadastro realizado com sucesso!
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                        <Button colorScheme="success" onPress={onClose}>
                                            Ok
                                        </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>

                        <AlertDialog isOpen={isOpenError} onClose={onClose}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Cadastro de Usuário</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Dados inválidos.
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="unstyled" colorScheme="danger" onPress={onClose}>
                                            Ok
                                        </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>

                    </VStack>

                </Center>

            </LinearGradient>
        </NativeBaseProvider>
    );
}