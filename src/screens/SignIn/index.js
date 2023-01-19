import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useContext } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { login } from '../../api/api';
import { AppLoader } from '../../Components/AppLoader/index.js'
import { authContext } from '../../contexts/authContext';

import {
    NativeBaseProvider,
    Box,
    Center,
    Heading,
    Input,
    FormControl,
    Icon,
    Button,
    VStack,
    WarningOutlineIcon,
    AlertDialog
} from 'native-base';
import { set } from 'date-fns';

export const SignIn=({ navigation })=> {
    const { auth, setAuthData, setAuthDataLogged } = useContext(authContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const onClose = () => setIsOpen(false);

    async function handleSubmit(event) {
        event.preventDefault();
        try {
            const response = await login(email, password);
            if (response.token){
                await AsyncStorage.setItem('@token', response.token);
                await AsyncStorage.setItem('@roleId', response.data.roleId.toString());
                await AsyncStorage.setItem('@name', response.data.name);
                navigation.navigate("MenuUser");
                setAuthData({
                    data: response.data
                });
            }else{
                setIsOpen(true);
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const getToken = async() => {
            const value = await AsyncStorage.getItem('@token')
            if(value !== null) {
                setAuthDataLogged(value);
                navigation.navigate("MenuUser");
            }
        }
        try {
            getToken();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const handlePressModal = () => {
        navigation.navigate("ModalBase");
    }

    const handleChangeEmail = text => setEmail(text);
    const handleChangePassword = text => setPassword(text);
    return(
        <NativeBaseProvider>
           <LinearGradient colors={['#8991DC', '#494C73']} > 
            <Center
                height="full"
            >
                <Heading mr={250} color="white" fontSize="4xl" m="30">
                    Log In
                </Heading>
                <VStack mt="10" width="80" backgroundColor="white" borderRadius={3} shadow={4}>
                    <Box p="10" >
                        <FormControl isRequired>
                            <FormControl.Label>E-mail</FormControl.Label>
                            <Input
                                onChangeText={handleChangeEmail}
                                placeholder="email"
                                type="email"
                                variant="underlined"
                                InputLeftElement={
                                    <Icon
                                    as={<MaterialIcons name="person" />}
                                    size={5}
                                    ml={2}
                                    />
                                }>     
                            </Input>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                    Usuário inválido
                                </FormControl.ErrorMessage>
                        </FormControl>

                        <FormControl isRequired>
                            <FormControl.Label mt={5}>Senha</FormControl.Label>
                            <Input
                                onChangeText={handleChangePassword}
                                placeholder="password"
                                type="password"
                                variant="underlined"
                                InputLeftElement={
                                    <Icon
                                    as={<MaterialIcons name="lock" />}
                                    size={5}
                                    ml={2}
                                    />
                                }> 
                            </Input>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs"/>}>
                                    Senha inválida
                                </FormControl.ErrorMessage>
                        </FormControl>

                    </Box>
                    <Button onPress={handleSubmit}
                        p="5"
                        colorScheme="violet"
                        borderRadius={3}
                    >Get Started
                    </Button>
                </VStack>


                <AlertDialog isOpen={isOpen} onClose={onClose}>
                    <AlertDialog.Content>
                        <AlertDialog.CloseButton />
                        <AlertDialog.Header>Login</AlertDialog.Header>
                        <AlertDialog.Body>
                            Login inválido
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                            <Button.Group space={2}>
                                <Button colorScheme="violet" onPress={onClose}>
                                    Ok
                                </Button>
                            </Button.Group>
                        </AlertDialog.Footer>
                    </AlertDialog.Content>
                </AlertDialog>

            </Center>
            </LinearGradient>
        </NativeBaseProvider>
    );
}
