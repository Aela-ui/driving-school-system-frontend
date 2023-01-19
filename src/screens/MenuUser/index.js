import React, { useContext, useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
    NativeBaseProvider,
    Text,
    VStack,
    Image,
    Button,
    Center,
} from 'native-base';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View, Animated, TouchableOpacity } from 'react-native';
import { authContext } from '../../contexts/authContext';
import { findPermissionsFromRole } from '../../api/apiRole';
import getPermission from '../../utils/getPermission';


function ExampleImage() {
    return <Image size={60} alt="fallback text" borderRadius={10} source={{
        uri: "https://-page-icon.png"
    }} fallbackSource={{
        uri: "https://www.w3schools.com/css/img_lights.jpg"
    }} />;
}

function ExampleImage2() {
    return <Image size={300} alt="fallback text" borderRadius={10} source={{
        uri: "https://-page-icon.png"
    }} fallbackSource={{
        uri: "https://www.w3schools.com/css/img_lights.jpg"
    }} />;
}

export const MenuUser=({ navigation })=> {
    const { auth } = useContext(authContext);
    const [showMenu, setShowMenu] = useState(false);
    const [showCreateButton, setShowCreateButton] = useState(false);
    
    const offsetValue = useRef(new Animated.Value(0)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const closeButtonOffset = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const callApicheckPermission = async() => {
            const roleId = await AsyncStorage.getItem('@roleId');
            const response = await findPermissionsFromRole(+roleId);

            setShowCreateButton(getPermission(response.data.payload, 'create-user'));
        }
        try {
            callApicheckPermission();
        } catch (error) {
            console.log(error);
        }
    }, [auth]);

    const handlePressAgendamentos = () => {
        navigation.navigate("Dashboard");
    }

    const handlePressCadastro = () => {
        navigation.navigate("SignUp");
    }

    async function handlePressSair(){
        try {
            await AsyncStorage.removeItem('@token')
            navigation.navigate("SignIn");
        } catch (error) {
            
        }
    }

    return(
        <NativeBaseProvider>   
            <LinearGradient colors={['#a78bfa', '#4c1d95']} > 
                <View style={{ height: "100%", width: "100%"}}>
                    <VStack m={5}>
                        <ExampleImage  />
                        <Text 
                        fontSize={20}
                        fontWeight="bold"
                        color="white"
                        mt={3}
                        >
                            {auth?.data?.name}
                        </Text>

                        <Text
                        color="white"
                        >
                            Seu Perfil
                        </Text>
                        
                        <Button 
                        onPress={handlePressAgendamentos}
                        leftIcon={ <Ionicons name='calendar' size={25} color='white' />}
                        width="45%"
                        colorScheme="white"
                        mt="20%"
                        borderRadius={8}
                        variant="ghost"
                        >
                            <Text
                            color="white"
                            fontSize="16"
                            ml="3"
                            fontWeight="bold"
                            >
                                Agendamentos
                            </Text>
                                
                          
                        </Button>    

                        {showCreateButton && (
                            <Button 
                            onPress={handlePressCadastro}
                            leftIcon={ <Ionicons name='person-add-outline' size={25} color='white' />}
                            width="35%"
                            colorScheme="white"
                            mt="3%"
                            borderRadius={8}
                            variant="ghost"
                            >
                                <Text
                                color="white"
                                fontSize="16"
                                ml="3"
                                fontWeight="bold"
                                >
                                    Cadastro
                                </Text>
                                    
                                
                            </Button> 
                        )}

                        <Button 
                        onPress={()=>handlePressSair()}
                        leftIcon={ <Ionicons name='exit' size={25} color='white' />}
                        width="25%"
                        colorScheme="white"
                        p="4"
                        mt="60%"
                        borderRadius={8}
                        variant="ghost"
                        >
                           <Text
                           color="white"
                           fontSize="16"
                           ml="3"
                           fontWeight="bold"
                           >
                            Sair
                           </Text>
                        </Button>  
                    </VStack>     

                </View>
            </LinearGradient>

            <Animated.View style={{
                flexGrow: 1,
                backgroundColor: '#fff',
                position: 'absolute',
                top: 0,
                bottom:0,
                left: 0,
                right: 0,

                borderRadius: showMenu ? 15 : 0,

                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,

                elevation: 5,

                transform:[
                    { scale: scaleValue },
                    {translateX: offsetValue}
                ]
            }}>
                
                <Animated.View style={{
                    transform: [{
                        translateY: closeButtonOffset
                    }]
                }}>
                <TouchableOpacity onPress={() =>{
                    Animated.timing(scaleValue, {
                        toValue: showMenu ? 1 : 0.88,
                        duration: 300,
                        useNativeDriver: true
                    })
                        .start()

                    Animated.timing(offsetValue, {
                        toValue: showMenu ? 0 : 230,
                        duration: 300,
                        useNativeDriver: true
                    })
                        .start()

                    Animated.timing(closeButtonOffset, {
                        toValue: !showMenu ? -30 : 0,
                        duration: 300,
                        useNativeDriver: true
                    })
                        .start()

                    setShowMenu(!showMenu);
                }}>
                    <Ionicons name='menu' size={45} color='#57534e'/>
                </TouchableOpacity>

                </Animated.View>

                <Center>
                    <Text
                    fontSize='30'
                    fontWeight="bold"
                    m="3"
                    color="#57534e"
                    >
                        Home
                    </Text>

                    <ExampleImage2 />
                </Center>

            </Animated.View>
        </NativeBaseProvider>
    );
}
