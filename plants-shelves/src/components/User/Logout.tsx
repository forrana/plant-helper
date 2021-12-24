import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { UserState } from "./models";
import { REVOKE_TOKEN } from "./queries";
import { useUserDispatch } from "./UserDispatch";
import { getInitialState } from "./UserReducer";

function Logout() {
    const dispatch = useUserDispatch();
    let userState: UserState  = getInitialState()
    let refreshToken = userState.refreshToken;

    const [revokeToken, { loading, error }] = useMutation(REVOKE_TOKEN, {
        onError: (e) => console.error('Error updating plant:', e)
      });


    useEffect(() => {
        revokeToken({ variables: { refreshToken } })
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