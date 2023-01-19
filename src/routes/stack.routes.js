import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Screen, Navigator } = createNativeStackNavigator();

import { SignIn } from '../screens/SignIn';
import { Dashboard } from '../screens/Dashboard';
import { SignUp } from '../screens/SignUp';
import { MenuUser } from '../screens/MenuUser';
import { ModalBase } from '../Components/ModalBase';

export const StackRoutes = () =>{
    return(
        <Navigator>
            <Screen
                name="SignIn"
                component={SignIn}
            />

            <Screen
                name="Dashboard"
                component={Dashboard}
            />

            <Screen
                name="SignUp"
                component={SignUp}
            />

            <Screen
                name="MenuUser"
                component={MenuUser}
            />

            <Screen
                name="ModalBase"
                component={ModalBase}
            />

        </Navigator>
    )
}

