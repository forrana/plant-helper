import { ApolloError } from "@apollo/client";
import { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom"
import AlertDispatch from "../UI/AlertDispatch";

interface ErrorHandlerProps {
    error: ApolloError | undefined
}

const ErrorHandler = ( { error } : ErrorHandlerProps ) => {
    const dispatch = useContext(AlertDispatch);

    useEffect(() => {
        if(error && dispatch) {
            dispatch({
                type: "addMessage",
                message: { description: error.message, color: "danger" }
            })
        }
    },[error, dispatch])

    if(error !== undefined) {
        switch(error.message) {
            case "Unauthorized":
            return (
                <Redirect
                    to={{
                    pathname: "/logout"
                }}
            />)
            default:
                console.log("ErrorHandler error,", error.message);
                return <></>
        }
    } else {
        return <></>
    }
}

export default ErrorHandler