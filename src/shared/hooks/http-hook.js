import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(() => false);
    const [error, setError] = useState(() => false);

    //will create a ref which is a peice of data that will not rerender/construct when this component rerenders.
    //its kinda like useCallback but is not resticted to functions. For example this is an array.
    const activeHttpRequest = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        //set isLoading to true
        setIsLoading(() => true);

        //storing an abort controller.
        const httpAbortCtrll = new AbortController();
        activeHttpRequest.current.push(httpAbortCtrll);

        try {
            //setup options
            const options = {
                method,
                body,
                headers,
                signal: httpAbortCtrll.signal //linking the abortSignal to this request which we can use the abbortController to cancel the request when need be.
            };

            //make call
            const response = await fetch(url, options);

            //convert call to json
            const responseData = await response.json();

            activeHttpRequest.current = activeHttpRequest.current.filter(ctrl => ctrl !== httpAbortCtrll);

            //check if it's ok (basically not status 1-299)
            if (!response.ok) {
                throw new Error(responseData.message);
            };

            //set isLoading to false
            setIsLoading(() => false);

            //return the data back to the component that called useHttpClient
            return responseData;

        } catch (err) {
            setError(err.message);
            //set isLoading to false
            setIsLoading(() => false);
            throw err;
        };//end of catch



    }//end of sendRequestHandler
        , []);//end of useCallback


    //function that can erase the errors from the error state. The hosting component can use this.
    const clearError = () => {
        setError(() => null);
    };

    //using useEffect to clean up some data after the component unmounts.
    useEffect(() => {
        return () => {
            activeHttpRequest.current.forEach(abortCtrl => abortCtrl.abort());
        };
    }, []);

    //return the states and the sendRequest and clearError functions so the hosting component can access them
    return {
        isLoading,
        error,
        clearError,
        sendRequest
    }

};//end of useHttpClient