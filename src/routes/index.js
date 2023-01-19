import { NavigationContainer } from "@react-navigation/native";

import { StackRoutes } from "./stack.routes";
import AuthProvider from "../contexts/authContext";

export const Routes = () => {
    return(
        <NavigationContainer>
            <AuthProvider>
                <StackRoutes />
            </AuthProvider>
        </NavigationContainer>
    )
}