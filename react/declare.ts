import { Alert, Button, Link, ListItemText, Menu, Snackbar } from "@mui/material";
import React from "react";
import { Redirect, Route } from "react-router";

const materialUILink = React.createElement(Link, {})
const redirectRouterDom = React.createElement(Redirect, '' as any)
const materialUIAlert = React.createElement(Alert, {})
const materialButton = React.createElement(Button, {})
const materialMenu = React.createElement(Menu, { open: true })
const materialListItemText = React.createElement(ListItemText, {})
const materialSnackBar = React.createElement(Snackbar, { open: true })
const routerProps = React.createElement(Route, { path: "/login" })

export type $MLinkProps = typeof materialUILink.props
export type $MAlertProps = typeof redirectRouterDom.props
export type $RedirectRouterDomProps = typeof redirectRouterDom.props
export type $MButtonProps = typeof materialButton.props
export type $MMenuProps = typeof materialMenu.props
export type $MListItemText = typeof materialListItemText.props
export type $MSnackbar = typeof materialSnackBar.props
export type $ReactRouteProps = typeof routerProps.props