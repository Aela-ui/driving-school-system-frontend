import React from "react";
import { findAllCars } from '../../api/apiCar';
import { findAllInstructors } from '../../api/apiUser';

import { 
    Button,
    Modal, 
    FormControl, 
    Center,
    Text,
    Select,
    CheckIcon,
    WarningOutlineIcon,
    HStack,
    AlertDialog,
} from "native-base";
import { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { createClass } from "../../api/apiClass";

const Example = () => {
    const [showModal, setShowModal] = useState(false);

    const [selectedIniTime, setSelectedIniTime] = useState([]);
    const [isTimeIniVisible, setTimeIniVisibility] = useState(false);
    const [selectedEndTime, setSelectedEndTime] = useState();
    const [isTimeEndVisible, setTimeEndVisibility] = useState(false);

    const [selectedDate, setSelectedDate] = useState();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [car, setCar] = useState(0);
    const [instructor, setInstructor] = useState(0);
    const [cars, setCars] = useState([]);
    const [instructors, setInstructors] = useState([]);
    const [isOpenError, setIsOpenError] = React.useState(false);
    const onClose = () => setIsOpen(false);

    useEffect(()=>{
        const callApiFindAllCars = async () =>{
            const response = await findAllCars();
            let{message, payload} = response.data;

            if(response.status !== 200) throw Error(message);
            setCars(payload);
        }
        try {
            callApiFindAllCars();
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(()=>{
        const callApiFindAllInstructors = async () =>{
            const response = await findAllInstructors();
            let{message, payload} = response.data;

            if(response.status !== 200) throw Error(message);
            setInstructors(payload);
        }
        try {
            callApiFindAllInstructors();
        } catch (error) {
            console.log(error);
        }
    }, [])

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    
    const hideIniPicker = () => {
        setTimeIniVisibility(false);
    };


    const showIniPicker = () => {
        setTimeIniVisibility(true);
    };
    
    const hideEndPicker = () => {
        setTimeEndVisibility(false);
    };

    const showEndPicker = () => {
        setTimeEndVisibility(true);
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    
    const handleConfirmDate = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const handleConfirmTimeIni = (date) => {
        setSelectedIniTime(moment(date).utc(date).format('HH:mm'));
        hideIniPicker();
    };    

    const handleConfirmTimeEnd = (date) => {
        setSelectedEndTime(moment(date).utc(date).format('HH:mm'));
        hideTimeEnd();
    };    

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await createClass({
                selectedDate, 
                selectedIniTime, 
                selectedEndTime, 
                instructor, 
                car
            });

            let{message, payload} = response.data;

            if(response.status !== 201){
                setIsOpenError(true);
            } {
                setShowModal(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    return <Center>
        <Button 
        leftIcon={ <Ionicons name='create-outline' size={25} color='white' />}
        onPress={() => setShowModal(true)}
        m="3"
        p="3"
        colorScheme="violet"
        borderRadius={3}
        shadow="4"
        >
            Criar Aula
        </Button>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
            <Modal.Content maxWidth="400px">
            <Modal.CloseButton />
            <Modal.Header>Criar Aula</Modal.Header>
            <Modal.Body>
                <FormControl>
                <FormControl.Label>Data</FormControl.Label>

                <Button 
                leftIcon={ <Ionicons name='calendar-outline' size={25} color='grey' />}
                onPress={showDatePicker}
                width='50%'
                placeholder='data'
                size="sm" variant="outline"
                >
                    <Text>
                        {selectedDate? moment(selectedDate).format("DD/MM/YYYY"):""}
                    </Text>
            
                </Button>

                <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirmDate}
                onCancel={hideDatePicker}
                />

                </FormControl>
                
                <FormControl.Label mt="6">Horário:</FormControl.Label>

                <HStack space={3} justifyContent="space-between">
                    <Center w="45%">
                        <FormControl>
                        <FormControl.Label>Início</FormControl.Label>

                            <Button
                            leftIcon={ <Ionicons name='time-outline' size={25} color='grey' />}
                            onPress={showIniPicker}
                            
                            placeholder="hora"
                            size="sm" variant="outline"
                            >
                                <Text>
                                    {selectedIniTime}
                                </Text>
                            </Button>

                            <DateTimePickerModal
                            isVisible={isTimeIniVisible}
                            mode="time"
                            date={selectedDate}
                            onConfirm={handleConfirmTimeIni}
                            onCancel={hideIniPicker}
                            />

                        </FormControl>
                    </Center>

                    <Center w="45%">
                        <FormControl>
                        <FormControl.Label>Fim</FormControl.Label>

                            <Button
                            leftIcon={ <Ionicons name='time-outline' size={25} color='grey' />}
                            onPress={showEndPicker}
                            
                            placeholder="hora"
                            size="sm" variant="outline"
                            >
                                <Text>
                                    {selectedEndTime}
                                </Text>
                            </Button>
                            <DateTimePickerModal
                            isVisible={isTimeEndVisible}
                            mode="time"
                            date={selectedDate}
                            onConfirm={handleConfirmTimeEnd}
                            onCancel={hideEndPicker}
                            />
                        </FormControl>
                    </Center>
                </HStack>

                <FormControl mt="4">
                <FormControl.Label>Instrutor</FormControl.Label>

                    <Select onValueChange={itemValue=>setInstructor(itemValue)} width="100%" accessibilityLabel="Escolha o Instrutor" placeholder="Escolha o Instrutor" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />
                    }} mt="1">
                        {instructors.map(instructor=>(
                            <Select.Item key={instructor.userId} label={instructor.name} value={instructor.userId} /> 
                        ))}
                    </Select>

                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Por favor selecione uma opção!
                    </FormControl.ErrorMessage>

                </FormControl>
                
                <FormControl mt="4">
                <FormControl.Label>Carro</FormControl.Label>

                    <Select onValueChange={itemValue=>setCar(itemValue)} width="100%" accessibilityLabel="Escolha o Carro" placeholder="Escolha o Carro" _selectedItem={{
                    bg: "teal.600",
                    endIcon: <CheckIcon size={5} />
                    }} mt="1">
                        {cars.map(car=>(
                            <Select.Item key={car.carId} label={car.brand+' '+car.model} value={car.carId} /> 
                        ))}
                    </Select>

                    <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                        Por favor selecione uma opção!
                    </FormControl.ErrorMessage>

                </FormControl>
                

            </Modal.Body>
            <Modal.Footer>
                <Button.Group space={2}>
                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setShowModal(false);
                }}>
                    Cancelar
                </Button>
                <Button 
                colorScheme="green"
                onPress={handleSubmit}>
                    Criar
                </Button>
                </Button.Group>
            </Modal.Footer>
            </Modal.Content>
            <AlertDialog isOpen={isOpenError} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>Cadastro de Aula</AlertDialog.Header>
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
        </Modal>
        </Center>;
    };

    export const ModalBase = () => {
        return (
            <Example />
        );
    };
    