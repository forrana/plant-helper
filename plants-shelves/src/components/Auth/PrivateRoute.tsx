import { useContext } from "react";
import {
    Route,
    Redirect,
  } from "react-router-dom";
import UserContext from "../User/UserContext";

function useAuth() {
    return useContext(UserContext);
}

function PrivateRoute({ children, ...rest }: any) {
    let auth = useAuth();
    return (
        <Route
        {...rest}
        render={({ location }) =>
            auth.token ? (
            children
            ) : (
            <Redirect
                to={{
                pathname: "/login",
                state: { from: location }
                }}
            />
            )
        }
        />
    );
}

export { PrivateRoute }



