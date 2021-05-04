import { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router';


let logoutTimer;

export const useAuth = () => {

    const [jsonWebTokenState, setJsonWebTokenState] = useState(() => false);
    const [tokenEpirationDate, setTokenExpirationDate] = useState();
    const [userIdState, setUserIdState] = useState(() => null);

    const history = useHistory();




    const loginHandler = useCallback((userId, token, expirationDate) => {
        setJsonWebTokenState(() => token);
        setUserIdState(userId);
        const tokenEpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenEpirationDate);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId,
                token,
                expiration: tokenEpirationDate.toISOString()
            })
        );
    }, []);

    const logoutHandler = useCallback(() => {
        setJsonWebTokenState(() => null);
        setTokenExpirationDate(null);
        setUserIdState(() => null);
        localStorage.removeItem('userData');
        history.push('/');
    }, []);

    useEffect(() => {
        if (jsonWebTokenState && tokenEpirationDate) {
            const remainingTime = tokenEpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logoutHandler, remainingTime)
        } else {
            clearTimeout(logoutTimer);
        }

    }, [jsonWebTokenState, logoutHandler, tokenEpirationDate]);


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            loginHandler(storedData.userId, storedData.token, new Date(storedData.expiration));
        };
    }, [loginHandler]);


    return {
        jsonWebTokenState,
        userIdState,
        loginHandler,
        logoutHandler
    }
};