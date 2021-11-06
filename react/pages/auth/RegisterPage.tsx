//@ts-nocheck

import { Button, Card, FormControl, FormGroup, Typography } from "@mui/material"
import React, { useRef } from "react"
import { Helmet } from "react-helmet"
import { RouteProps } from "react-router-dom"
import { AuthApi } from "../../api/auth"
import { utils } from "../../common/utils"
import { CAlert } from "../../components/custom/CAlert"
import { VTextField } from "../../components/validator/inputs/VTextField"
import { Validator } from "../../components/validator/ValidatorComponent"


export default function RegisterPage(props: RouteProps<any>) {
    const { state } = props.location
    let user: { email: string, password: string } = {}
    const alert = utils.CAlert(useRef())
    if (state !== undefined && state.user) {
        user = state.user
    }

    async function handleSubmit({ formData, axios }) {
        alert.waiting()
        await axios(utils.delay(500, AuthApi.register(formData())), {
            error: ({ message }) => alert.errorAlert(message),
            success: ({ message }) => alert.successAlert(message),
        })
        alert.waiting(false)
    }

    return utils.nonAuthRender(
        <Card sx={{ p: 2, m: 1 }} variant="outlined">
            <Helmet title="Đăng kí">
                <meta name="description" content="Đăng ký tài khoản Dinzltt App" />
            </Helmet>
            <Typography color="black" sx={{ textAlign: 'center' }} variant="h5" component="h1">
                Đăng kí
            </Typography>
            <Validator
                onSuccess={handleSubmit}
                render={({ register }) => (
                    <FormGroup >
                        <FormControl >
                            {register(<VTextField label="Email" variant="standard" defaultValue={user.email} name="email" />, (r) => r.email())}
                        </FormControl>
                        <FormControl>
                            {register(<VTextField label="Họ và tên" variant="standard" name="name" />, (r) => r.min(1))}
                        </FormControl>
                        <FormControl>
                            {register(<VTextField label="Mật khẩu" type="password" variant="standard" defaultValue={user.password} name="password" />, (r) => r.min(6))}
                        </FormControl>
                        <FormControl>
                            {register(<VTextField label="Xác nhận mật khẩu" type="password" variant="standard" name="password_confirm" />, (r) => r.confirm('password', 'mật khẩu'))}
                        </FormControl>
                        <Button sx={{ mt: 2, mx: 'auto', width: '100%' }} type="submit" variant="outlined">Đăng ký</Button>
                        <br/>
                        <CAlert ref={alert.alertRef} />
                    </FormGroup>
                )} />
        </Card>)
}