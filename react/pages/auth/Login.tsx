import { Button, Card, FormControl, FormGroup, Typography } from "@mui/material";
import React, { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Redirect } from "react-router";
import { AuthApi } from "../../api/auth";
import { utils } from "../../common/utils";
import { CAlert } from "../../components/custom/CAlert";
import CLink from "../../components/custom/CLink";
import { VTextField } from "../../components/validator/inputs/VTextField";
import { Validator, ValidatorEvent } from "../../components/validator/ValidatorComponent";
import { messageAPI } from "../../config/api-message";
import { route } from "../../config/route";
import { AuthConsumer, User } from "../../context/AuthProvider";
import { $ReactRouteProps } from "../../declare";


export default function LoginPage(props: $ReactRouteProps) {

    const [username] = useState((() => {
        const { state }: { state: any } = props.location
        if (state !== undefined) {
            return state.username || ''
        }
        return ''
    })())

    const [userRegister, setUserRegister] = useState<{ email: string, password: string }>()
    const alertRef = useRef<CAlert>()
    const alert = utils.CAlert(alertRef)

    const onSuccess: ValidatorEvent.onSuccess = async ({ axios, formData, json }) => {
        alert.waiting()
        await axios(utils.delay(500, AuthApi.login(formData())), {
            error({ code, message }) {
                const { user_not_found } = messageAPI.auth.login
                switch (code) {
                    case user_not_found:
                        setUserRegister(json())
                        break;
                    default:
                        alert.alert(message, 'error')
                        break;
                }
            },
            success({ data: { token } }) {
                User.login(token);
            }
        })
        alert.waiting(false)
    }
    return utils.nonAuthRender(
        <Card sx={{ p: 2, m: 1 }} variant="outlined">
            <Helmet title="Đăng nhập">
                <meta name="description" content="Đăng nhập vào Dinzltt App" />
            </Helmet>
            <Typography component="h1" variant="h5" sx={{ textAlign: 'center' }} children="Đăng nhập" />
            <Validator
                onSuccess={onSuccess}
                render={({ register }) => (
                    <FormGroup >
                        <FormControl >
                            {register(<VTextField label="Email" variant="standard" defaultValue={username} name="email" />, (r) => r.email())}
                        </FormControl>
                        <FormControl>
                            {register(<VTextField label="Mật khẩu" type="password" variant="standard" name="password" />, (r) => r.min(6))}
                        </FormControl>
                        <Button sx={{ mt: 2, mx: 'auto', width: '100%' }} type="submit" variant="outlined">Đăng nhập</Button>
                    </FormGroup>
                )} />
            <CAlert ref={alertRef as any} sx={{ my: 1 }} />
            <CLink {...{
                m: { underline: 'none' },
                ... (userRegister
                    ? {
                        children: <>{'Đăng kí tài khoản '}<Typography sx={{ display: 'inline' }} color="orangered">{userRegister.email}</Typography>{' ngay!'}</>,
                        to: { pathname: route.register, state: { user: userRegister } }
                    }
                    : {
                        children: 'Chưa có tài khoản? Đăng kí ngay!',
                        to: route.register
                    })
            }
            } />
        </Card>)
}
