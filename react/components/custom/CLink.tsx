import { Link as MLink, LinkTypeMap } from "@mui/material";
import React from 'react';
import { Link, LinkProps, Redirect } from "react-router-dom";
import { $MLinkProps, $RedirectRouterDomProps } from "../../declare";

export default class CLink extends React.Component<{ m?: $MLinkProps } & $RedirectRouterDomProps, { redirect: boolean }>{

    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }
    render() {
        const linkProps = { ...(this.props as any) }

        return this.state.redirect
            ? <Redirect {...(linkProps)} />
            : <MLink href="#" {...this.props.m}
                onClick={(e) => {
                    e.preventDefault()
                    this.setState({ redirect: true })
                }}
            >
                {this.props.children}
            </MLink>
    }
}