import React, { useEffect, useState } from "react";
import { RouteProps } from "react-router-dom";
import query from "query-string"
import { Alert, AlertColor, Typography } from "@mui/material";
import axios from "axios";
import { AuthApi } from "../../api/auth";

export default function VerificationEmail(props: RouteProps<any>) {

    const [message, setMessage] = useState<[AlertColor, string]>(["info", "Chờ xíu"])
    useEffect(() => {
        AuthApi.emailVerification(props.location.search)
            .then(({ message }: any) => {
                setMessage(["success", message])
            })
            .catch(({ message }) => {
                setMessage(["error", message])
            })
    }, [])
    return <Alert severity={message[0]}>{message[1]}</Alert>
}