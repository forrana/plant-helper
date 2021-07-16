import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import UserDispatch from "./UserDispatch";

function Logout() {
    const dispatch = useContext(UserDispatch);
    
    localStorage.setItem('token', "");
    dispatch && dispatch({
        type: 'logout'
    });

    return  (
        <Redirect
                to={{
                    pathname: "/login"
                }}
            />
    )
}

export default Logout;