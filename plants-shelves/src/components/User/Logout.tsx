import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { useUserDispatch } from "./UserDispatch";

function Logout() {
    const dispatch = useUserDispatch();

    useEffect(() => {
        dispatch({
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