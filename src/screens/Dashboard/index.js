import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { findAllClasses, updateClass } from '../../api/apiClass';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteClass } from '../../api/apiClass';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ModalBase } from '../../Components/ModalBase';
import {
    NativeBaseProvider,
    Text,
    HStack,
    VStack,
    AlertDialog,
    Button,
    Center,
    Divider,
    Flex
} from 'native-base';
import { View, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { authContext } from '../../contexts/authContext';
import { findPermissionsFromRole } from '../../api/apiRole';
import getPermission from '../../utils/getPermission';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Dashboard=()=> {
    const { auth } = useContext(authContext);
    const [classes, setClasses] = useState([]);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const [showCreateButton, setShowCreateButton] = useState(false); 
    const [showScheduleButton, setShowScheduleButton] = useState(false);

    const handleClasses = (newClasses) => {
        setClasses(newClasses);
    }

    useEffect(() => {
        const callApicheckPermission = async() => {
            const roleId = await AsyncStorage.getItem('@roleId');
            const response = await findPermissionsFromRole(+roleId);
            setShowCreateButton(getPermission(response.data.payload, 'create-class'));
        }
        try {
            callApicheckPermission();
        } catch (error) {
            console.log(error);
        }
    }, [auth]);

    useEffect(()=>{
        const callApiFindAllClasses = async () =>{
            const response = await findAllClasses();
            let{message, payload} = response.data;
            if(response.status !== 200) throw Error(message);
            setClasses(payload);
        }
        try {
            callApiFindAllClasses();
        } catch (error) {
            console.log(error);
        }
    }, [classes]);
   
    return(
        <NativeBaseProvider> 
            <LinearGradient colors={['#8991DC', '#494C73']} > 
                <View style={{ height: "100%", width: "100%"}}>
                {showCreateButton &&
                    <ModalBase />
                }
                    <FlashList
                    data={classes}
                    renderItem= {({item}) => <ListItem data={item} updateClasses={handleClasses} classes={classes} auth={auth} showDeleteButton={showDeleteButton} setShowDeleteButton={setShowDeleteButton} showScheduleButton={showScheduleButton} setShowScheduleButton={setShowScheduleButton}/>}
                    estimatedItemSize={10}
                    />
                </View>
            </LinearGradient>
        </NativeBaseProvider>
    );
}

const ListItem = React.memo(({data, updateClasses, classes, auth, showDeleteButton, setShowDeleteButton, showScheduleButton, setShowScheduleButton}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpenSchedule, setIsOpenSchedule] = React.useState(false);
    const onClose = () => setIsOpen(false);
    const onCloseSchedule = () => setIsOpenSchedule(false);

    const cancelRef = React.useRef(null);

    useEffect(() => {
        const callApicheckPermission = async() => {
            const roleId = await AsyncStorage.getItem('@roleId');
            const response = await findPermissionsFromRole(+roleId);

            setShowDeleteButton(getPermission(response.data.payload, 'delete-class'));
            setShowScheduleButton(getPermission(response.data.payload, 'schedule-class'))
        }
        try {
            callApicheckPermission();
        } catch (error) {
            console.log(error);
        }
    }, [auth]);

    const handleDelete = async(classId) => {
        try {
            const response = await deleteClass(classId);
            let{message, payload} = response.data;

            if(response.status !== 200) throw Error(message);
            updateClasses(classes.filter((item) => item.classId !== classId));
            setIsOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleSchedule = async(classId) => {
        try {
            const response = await updateClass(classId, auth.data.userId);
            let{message, payload} = response.data;

            if(response.status !== 200) throw Error(message);
            updateClasses(classes.filter((item) => item.classId !== classId));
            setIsOpenSchedule(false);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <View>
            <Center>
                <VStack 
                    flex="1"
                    key={data.classId}
                    space={3} 
                    w="60%" 
                    backgroundColor="white"
                    borderRadius={5}
                    shadow={4}
                    p="4"
                    margin={4}
                >       
                        <TouchableOpacity>
                            <Flex direction="row-reverse">
                            {showDeleteButton ? (
                                <Ionicons name='close-outline' size={35} color='red' onPress={() => setIsOpen(!isOpen)}/>
                            ): showScheduleButton ?(
                                <Button 
                                leftIcon={ <Ionicons name='checkmark-outline' size={25} color='white' />}
                                p="3"    
                                colorScheme="violet"
                                borderRadius={3}
                                shadow="4"
                                onPress={() => setIsOpenSchedule(!isOpenSchedule)}
                                >
                                    Agendar
                                </Button>
                            ): null}
                            </Flex>
                        </TouchableOpacity>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Deletar Aula</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Tem certeza que deseja deletar esta aula?
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="unstyled" onPress={onClose} ref={cancelRef}>
                                            Cancelar
                                        </Button>
                                        <Button colorScheme="danger" onPress={()=>handleDelete(data.classId)}>
                                            Deletar
                                        </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpenSchedule} onClose={onCloseSchedule}>
                            <AlertDialog.Content>
                                <AlertDialog.CloseButton />
                                <AlertDialog.Header>Agendar Aula</AlertDialog.Header>
                                <AlertDialog.Body>
                                    Tem certeza que deseja agendar esta aula?
                                </AlertDialog.Body>
                                <AlertDialog.Footer>
                                    <Button.Group space={2}>
                                        <Button variant="unstyled" onPress={onCloseSchedule} ref={cancelRef}>
                                            Cancelar
                                        </Button>
                                        <Button colorScheme="success" onPress={()=>handleSchedule(data.classId)}>
                                            Agendar
                                        </Button>
                                    </Button.Group>
                                </AlertDialog.Footer>
                            </AlertDialog.Content>
                        </AlertDialog>
                    <HStack mt={-3} justifyContent="space-between">
                        <Text>Data</Text>
                        <Text>{data.classDate}</Text>
                    </HStack>
        
                    <Divider/>

                    <HStack justifyContent="space-between">
                        <Text>Horário</Text>
                        <Text>{data.startedAt} - {data.finishedAt}</Text>
                    </HStack>
        
                    <Divider/>

                    <HStack justifyContent="space-between">
                        <Text>Instrutor</Text>
                        <Text>{data.instructorName}</Text>
                    </HStack>

                    <Divider/>

                    <HStack justifyContent="space-between">
                        <Text>Carro</Text>
                        <Text>{data.brand} {data.model} {data.year}</Text>
                    </HStack>
                </VStack>
            </Center>
            
        </View>
    )
}, (prevProps, nextProps) => {
    if (prevProps.data === nextProps.data) return true;
    return false;
});