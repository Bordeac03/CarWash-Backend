import { createContext, useLayoutEffect, useState, useContext } from "react";
import Login from "../routes/Login";
import Cookies from 'js-cookie';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    const userConfig = {
        loggedIn,
        setLoggedIn,
    };

    useLayoutEffect(() => {

        if (Cookies.get('isLoggedIn') === 'true') {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }

        return () => {};
    }, []);

    if (!loggedIn) {
        return (
            <UserContext.Provider value={userConfig}>
                <Login />
            </UserContext.Provider>
        );
    }

    return <UserContext.Provider value={userConfig}>{children}</UserContext.Provider>;
};
