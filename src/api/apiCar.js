import { apiUrl } from "./api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const findAllCars = async() =>{
    try {
        const token = await AsyncStorage.getItem('@token')
        return await axios.get(`${apiUrl}/cars`, {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}