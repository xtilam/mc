import React from "react";
import { Component, createContext } from "react";
import { AuthApi } from "../api/auth";
import { storage } from "../common/storage";
import { utils } from "../common/utils";
import { env } from "../config/env";

const AuthContext = createContext<AuthContextType>({} as any)

export const User: {
    user: () => { id: number, name: string } | undefined
    login: (token) => void,
    logout: () => void
} = {} as any

export class AuthProvider extends Component<any, AuthProviderState> {
    constructor(props) {
        super(props)
        const user = this.parseToken(storage.get(env.userToken))
        this.state = { user: user as any }

        User.login = (function (token: string) {
            const user = this.parseToken(token)
            console.log(user)
            if (user) this.setState({ user: user })
        }).bind(this)

        User.logout = (async function () {
            await AuthApi.logout()
            storage.remove(env.userToken)
            this.setState({ user: null })
        }).bind(this)

        User.user = (function () { return this.state.user }).bind(this)
    }
    parseToken(token) {
        try {
            const { id, name } = utils.parseJwt(token)
            if (!(id && name)) return
            storage.put(env.userToken, token)
            return { id, name }
        } catch (error) {
        }
    }
    render() {
        return <AuthContext.Provider value={{ user: this.state.user }} children={
            <>
                {this.props.children}
            </>
        } />
    }
}
export function AuthConsumer(props: React.ConsumerProps<AuthContextType>) {
    return <AuthContext.Consumer children={props.children} />
}

interface AuthProviderState extends AuthContextType {
}

interface AuthContextType {
    user?: {
        id: number,
        name: string,
    }
}