import { AlertColor, LinearProgress } from "@mui/material";
import React, { RefObject } from "react";
import { Redirect } from "react-router-dom";
import { CAlert } from "../components/custom/CAlert";
import { route } from "../config/route";
import { AuthConsumer } from "../context/AuthProvider";

class Utils {
    makeID(length = 20) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    CAlert(alertRef) {
        return new CAlertUtils(alertRef)
    }
    async delay(time: number = 500, promise?: Promise<any>) {
        return new Promise<any>((resolve, reject) => {
            setTimeout(() => {
                promise.then(resolve).catch(reject)
            }, time)
        })
    }
    parseJwt(token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }
    nonAuthRender(children) {
        return <AuthConsumer>
            {({ user }) => {
                if (user) return <Redirect to={route.home} />
                return children
            }}
        </AuthConsumer>
    }
    requireAuthRender(children) {
        return <AuthConsumer>
            {({ user }) => {
                if (!user) return <Redirect to={route.login} />
                return children
            }}
        </AuthConsumer>
    }
}

class CAlertUtils {
    alertRef: RefObject<CAlert>

    private die() {
        if (!this.alertRef.current) return true
    }
    constructor(alertRef) {
        this.alertRef = alertRef
    }
    alert(message, type: AlertColor, clickClose: boolean = true) {
        this.alertRef.current.update({
            children: message,
            severity: type,
            clickClose: true,
        })
    }
    successAlert(message) {
        if (this.die()) return
        this.alert(message, 'success')
    }
    errorAlert(message) {
        if (this.die()) return
        this.alert(message, 'error')
    }
    waiting(status = true) {
        if (this.die()) return
        if (status) {
            return this.alertRef.current.update({ render: <LinearProgress sx={{ my: 2 }} />, children: '' })
        }
        this.alertRef.current.update({ render: undefined })
    }
    hide() {
        console.log(this)
    }


}

export const utils = new Utils()