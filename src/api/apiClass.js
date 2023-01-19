import { apiUrl } from "./api";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const findAllClasses = async() =>{
    try {
        const token = await AsyncStorage.getItem('@token');
        return await axios.get(`${apiUrl}/classes?available=1`, {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}

export const deleteClass = async(classId) =>{
    try {
        const token = await AsyncStorage.getItem('@token');
        return await axios.delete(`${apiUrl}/classes/${classId}`, {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}

export const updateClass = async(classId, userId) =>{
    try {
        const token = await AsyncStorage.getItem('@token');
        return await axios.put(`${apiUrl}/classes/${classId}`, 
        {
            studentId: userId
        },
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}

export const createClass = async(data) =>{
    try {
        const token = await AsyncStorage.getItem('@token');
        return await axios.post(`${apiUrl}/classes`, {
            classDate: data.selectedDate,
            startedAt: data.selectedIniTime,
            finishedAt: data.selectedEndTime,
            instructorId: data.instructor,
            carId: data.car
        },
        {
            headers:{token:token}
        });
    } catch (error) {
        return error;
    }
}