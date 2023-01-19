import { apiUrl } from "./api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const findAllUsers = async() =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.get(`${apiUrl}/users`,
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}

export const createUser = async(data) =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.post(`${apiUrl}/users`, {
            name: data.nome,
            cpf: data.cpf,
            email: data.email,
            phone: data.telefone,
            roleId: data.funcao
        },
        {
            headers:{token:token}
        });
        
    } catch (error) {
        return error;
    }
}

export const findAllInstructors = async() =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.get(`${apiUrl}/users/findAllInstructors`,
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}