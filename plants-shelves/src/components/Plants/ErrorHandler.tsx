import { ApolloError } from "@apollo/client";
import { Redirect } from "react-router-dom"

interface ErrorHandlerProps {
    error: ApolloError
}

const ErrorHandler = ( { error } : ErrorHandlerProps ) => {
    switch(error.message) {
        case "Unauthorized":
        return (
            <Redirect
                to={{
                pathname: "/logout"
            }}
        />)
        default: return <p>Error :( {error.message}</p>;
    }
}

export default ErrorHandler