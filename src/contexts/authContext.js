import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authContext = createContext({});

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});

    const setAuthData = (data) => {
        setAuth(data);
    };

    const setAuthDataLogged = async (token) => {
        const data = jwt_decode(token);
        setAuth({
            data: data,
        });
    };
    // useEffect(() => {
    //     const getToken = async() => {
    //         const token = await AsyncStorage.getItem('@token');
    //         const data = jwt_decode(token);
    //         setAuth({
    //             data: data,
    //         });
    //         console.log(auth);
    //     }
    //     try {
    //         getToken();
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }, []);
    //2. if object with key 'authData' exists in localStorage, we are putting its value in auth.data and we set loading to false.
    //This function will be executed every time component is mounted (every time the user refresh the page);

    // useEffect(() => {
    //     window.localStorage.setItem('authData', JSON.stringify(auth.data));
    // }, [auth.data]);
    // 1. when **auth.data** changes we are setting **auth.data** in localStorage with the key 'authData'.

    return (
        <authContext.Provider value={{ auth, setAuthData, setAuthDataLogged }}>
            {children}
        </authContext.Provider>
    );
};

export default AuthProvider;