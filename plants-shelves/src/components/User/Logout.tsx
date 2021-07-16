import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import UserDispatch from "./UserDispatch";

function Logout() {
    const dispatch = useContext(UserDispatch);
    
    useEffect(() => {        
        dispatch && dispatch({
            type: 'logout'
        });
    }, [dispatch]);

    return  (
        <Redirect
                to={{
                    pathname: "/login"
                }}
            />
    )
}

export default Logout;