import { apiUrl } from "./api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const findAllRoles = async() =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.get(`${apiUrl}/roles`,
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}

export const findPermissionsFromRole = async(roleId) =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.get(`${apiUrl}/roles/${roleId}/findPermissionsFromRole`,
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}