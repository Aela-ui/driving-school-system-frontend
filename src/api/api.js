import axios from "axios";
import jwt_decode from "jwt-decode";

export const apiUrl = "https://cfc-system-backend.herokuapp.com";

export const login = async(email, password) =>{
    try {
        const response = await axios.post(`${apiUrl}/auth/login`, {
            email,
            password,
        });
        return{
            token: response.data.payload,
            data: jwt_decode(response.data.payload)
        }
    } catch (error) {
        return error;
    }
}